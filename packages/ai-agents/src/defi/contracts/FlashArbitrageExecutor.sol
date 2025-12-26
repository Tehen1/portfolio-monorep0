// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

// Interfaces Aave V3 Flash Loan
interface IPoolAddressesProvider {
    function getPool() external view returns (address);
}

interface IPool {
    function flashLoanSimple(
        address receiverAddress,
        address asset,
        uint256 amount,
        bytes calldata params,
        uint16 referralCode
    ) external;
}

// Interfaces Uniswap V3
interface ISwapRouter {
    struct ExactInputSingleParams {
        address tokenIn;
        address tokenOut;
        uint24 fee;
        address recipient;
        uint256 deadline;
        uint256 amountIn;
        uint256 amountOutMinimum;
        uint160 sqrtPriceLimitX96;
    }

    function exactInputSingle(ExactInputSingleParams calldata params)
        external
        payable
        returns (uint256 amountOut);
}

/**
 * @title FlashArbitrageExecutor
 * @notice Exécute des arbitrages atomiques cross-DEX en utilisant Aave Flash Loans
 * @dev Compatible avec fixie.run AI Agent architecture
 */
contract FlashArbitrageExecutor is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    // Aave V3 Pool Address Provider (Mainnet)
    IPoolAddressesProvider public constant ADDRESSES_PROVIDER =
        IPoolAddressesProvider(0x2f39d218133AFaB8F2B819B1066c7E434Ad94E9e);

    // Uniswap V3 Router
    ISwapRouter public constant UNISWAP_ROUTER =
        ISwapRouter(0xE592427A0AEce92De3Edee1F18E0157C05861564);

    // SushiSwap Router (V2 style, simplifié ici)
    address public constant SUSHISWAP_ROUTER =
        0xd9e1cE17f2641f24aE83637ab66a2cca9C378B9F;

    // Events pour le Neural Buffer (monitoring)
    event ArbitrageExecuted(
        address indexed tokenIn,
        address indexed tokenOut,
        uint256 amountBorrowed,
        uint256 profit,
        address indexed executor
    );

    event ArbitrageFailed(
        address indexed tokenIn,
        address indexed tokenOut,
        uint256 amountBorrowed,
        string reason
    );

    struct ArbitrageParams {
        address tokenIn;
        address tokenOut;
        uint256 amountIn;
        address buyDex;  // DEX où acheter (prix bas)
        address sellDex; // DEX où vendre (prix haut)
        uint24 feeTier;  // Uniswap fee tier (3000 = 0.3%)
        uint256 minProfit; // Profit minimum attendu
    }

    /**
     * @notice Point d'entrée principal pour l'arbitrage
     * @dev Appelé par l'ArbitrageAgent via un wallet EOA
     */
    function executeArbitrage(ArbitrageParams calldata params)
        external
        nonReentrant
        onlyOwner
    {
        require(params.amountIn > 0, "Invalid amount");
        require(params.minProfit > 0, "Invalid min profit");

        // Encoder les paramètres pour le callback du flash loan
        bytes memory data = abi.encode(params);

        // Initier le Flash Loan
        IPool pool = IPool(ADDRESSES_PROVIDER.getPool());
        pool.flashLoanSimple(
            address(this),
            params.tokenIn,
            params.amountIn,
            data,
            0 // referralCode
        );
    }

    /**
     * @notice Callback appelé par Aave après réception du Flash Loan
     * @dev C'est ici que la logique d'arbitrage est exécutée
     */
    function executeOperation(
        address asset,
        uint256 amount,
        uint256 premium,
        address initiator,
        bytes calldata params
    ) external returns (bool) {
        require(
            msg.sender == address(ADDRESSES_PROVIDER.getPool()),
            "Caller must be Pool"
        );
        require(initiator == address(this), "Initiator must be this contract");

        ArbitrageParams memory arbParams = abi.decode(params, (ArbitrageParams));

        uint256 balanceBefore = IERC20(arbParams.tokenOut).balanceOf(address(this));

        // ÉTAPE 1: Acheter sur le DEX avec le prix le plus bas
        uint256 amountOut1 = _swapOnDex(
            arbParams.buyDex,
            arbParams.tokenIn,
            arbParams.tokenOut,
            amount,
            arbParams.feeTier
        );

        require(amountOut1 > 0, "Buy swap failed");

        // ÉTAPE 2: Vendre sur le DEX avec le prix le plus haut
        uint256 amountOut2 = _swapOnDex(
            arbParams.sellDex,
            arbParams.tokenOut,
            arbParams.tokenIn,
            amountOut1,
            arbParams.feeTier
        );

        require(amountOut2 > 0, "Sell swap failed");

        uint256 balanceAfter = IERC20(arbParams.tokenIn).balanceOf(address(this));
        uint256 totalDebt = amount + premium;

        // Vérifier la profitabilité
        require(balanceAfter >= totalDebt, "Arbitrage not profitable");

        uint256 profit = balanceAfter - totalDebt;
        require(profit >= arbParams.minProfit, "Profit below minimum");

        // Approuver le remboursement du Flash Loan
        IERC20(asset).safeApprove(msg.sender, totalDebt);

        // Transférer le profit au owner (fixie.run treasury)
        if (profit > 0) {
            IERC20(asset).safeTransfer(owner(), profit);
        }

        emit ArbitrageExecuted(
            arbParams.tokenIn,
            arbParams.tokenOut,
            amount,
            profit,
            initiator
        );

        return true;
    }

    /**
     * @dev Exécute un swap sur un DEX spécifique
     */
    function _swapOnDex(
        address dex,
        address tokenIn,
        address tokenOut,
        uint256 amountIn,
        uint24 feeTier
    ) internal returns (uint256) {
        IERC20(tokenIn).safeApprove(dex, amountIn);

        if (dex == address(UNISWAP_ROUTER)) {
            ISwapRouter.ExactInputSingleParams memory swapParams = ISwapRouter
                .ExactInputSingleParams({
                    tokenIn: tokenIn,
                    tokenOut: tokenOut,
                    fee: feeTier,
                    recipient: address(this),
                    deadline: block.timestamp + 300,
                    amountIn: amountIn,
                    amountOutMinimum: 0, // Protection via minProfit global
                    sqrtPriceLimitX96: 0
                });

            return UNISWAP_ROUTER.exactInputSingle(swapParams);
        }

        // Pour SushiSwap ou autres DEX V2, on utiliserait une logique différente
        revert("Unsupported DEX");
    }

    /**
     * @notice Fonction d'urgence pour récupérer des tokens bloqués
     */
    function emergencyWithdraw(address token, uint256 amount)
        external
        onlyOwner
    {
        IERC20(token).safeTransfer(owner(), amount);
    }

    /**
     * @notice Permet au contrat de recevoir des ETH (pour les swaps WETH)
     */
    receive() external payable {}
}
