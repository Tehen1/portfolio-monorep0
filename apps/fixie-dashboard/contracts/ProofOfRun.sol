// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

/**
 * @title ProofOfRun
 * @notice Soulbound NFT attestant des activités cyclisme validées par oracle GPS
 * @dev Optimisé zkEVM : uint256 par défaut, events indexés, custom errors
 * @custom:security ReentrancyGuard + AccessControl MINTER_ROLE
 * @custom:gas Target 140-150k gas per mint, 120-130k avg batch
 */
contract ProofOfRun is
    ERC721Upgradeable,
    ReentrancyGuardUpgradeable,
    PausableUpgradeable,
    AccessControlUpgradeable,
    UUPSUpgradeable
{
    /// @dev Role pour minter (backend service validé)
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    /// @dev Role pour upgrade UUPS (multi-sig)
    bytes32 public constant UPGRADER_ROLE = keccak256("UPGRADER_ROLE");

    /// @dev Role oracle pour validation GPS
    bytes32 public constant ORACLE_ROLE = keccak256("ORACLE_ROLE");

    /// @notice Structure données activité (optimisé storage)
    struct Activity {
        uint256 distance;      // Distance en mètres
        uint256 duration;      // Durée en secondes
        uint256 calories;      // Calories brûlées
        uint256 timestamp;     // Block timestamp
        bytes32 gpsProofHash;  // Hash preuve GPS (IPFS CID)
        bool validated;        // Validé par oracle
    }

    /// @notice Mapping tokenId => données activité
    mapping(uint256 => Activity) public activities;

    /// @notice Mapping user => dernier mint timestamp (cooldown anti-sybil)
    mapping(address => uint256) public lastMintTimestamp;

    /// @notice Cooldown entre 2 mints (1 heure = 3600s)
    uint256 public constant COOLDOWN_PERIOD = 3600;

    /// @notice Distance minimale requise (500m)
    uint256 public constant MIN_DISTANCE = 500;

    /// @notice Compteur tokenId (auto-increment)
    uint256 private _tokenIdCounter;

    /// @dev Custom errors (gas-efficient, pas de string)
    error SoulboundTransferNotAllowed();
    error CooldownNotExpired(uint256 remainingTime);
    error DistanceTooShort(uint256 provided, uint256 required);
    error ActivityNotValidated(uint256 tokenId);
    error UnauthorizedUpgrade();

    /// @notice Events indexés (filtrage off-chain efficace)
    event ActivityMinted(
        address indexed user,
        uint256 indexed tokenId,
        uint256 distance,
        uint256 duration,
        bytes32 indexed gpsProofHash
    );

    event ActivityValidated(
        uint256 indexed tokenId,
        address indexed oracle,
        bool valid
    );

    event ActivityBurned(
        address indexed user,
        uint256 indexed tokenId
    );

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    /**
     * @notice Initializer (remplace constructor pour UUPS)
     * @param admin Adresse admin (multi-sig Gnosis Safe)
     * @param minter Adresse backend service autorisé à mint
     */
    function initialize(address admin, address minter) public initializer {
        __ERC721_init("ProofOfRun", "POR");
        __ReentrancyGuard_init();
        __Pausable_init();
        __AccessControl_init();
        __UUPSUpgradeable_init();

        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(MINTER_ROLE, minter);
        _grantRole(UPGRADER_ROLE, admin);
        _grantRole(ORACLE_ROLE, minter); // Initialement backend = oracle
    }

    /**
     * @notice Mint ProofOfRun NFT après validation activité
     * @param to Adresse utilisateur
     * @param distance Distance parcourue (mètres)
     * @param duration Durée (secondes)
     * @param calories Calories brûlées
     * @param gpsProofHash Hash IPFS preuve GPS
     * @dev Checks-Effects-Interactions pattern
     * @custom:security ReentrancyGuard + AccessControl MINTER_ROLE
     */
    function mint(
        address to,
        uint256 distance,
        uint256 duration,
        uint256 calories,
        bytes32 gpsProofHash
    ) external nonReentrant whenNotPaused onlyRole(MINTER_ROLE) returns (uint256) {
        // === CHECKS ===

        // Cooldown anti-sybil
        uint256 timeSinceLastMint = block.timestamp - lastMintTimestamp[to];
        if (timeSinceLastMint < COOLDOWN_PERIOD) {
            revert CooldownNotExpired(COOLDOWN_PERIOD - timeSinceLastMint);
        }

        // Distance minimale
        if (distance < MIN_DISTANCE) {
            revert DistanceTooShort(distance, MIN_DISTANCE);
        }

        // === EFFECTS ===

        uint256 tokenId = _tokenIdCounter;
        _tokenIdCounter++;

        activities[tokenId] = Activity({
            distance: distance,
            duration: duration,
            calories: calories,
            timestamp: block.timestamp,
            gpsProofHash: gpsProofHash,
            validated: false // Validation oracle asynchrone
        });

        lastMintTimestamp[to] = block.timestamp;

        // === INTERACTIONS ===

        _safeMint(to, tokenId);

        emit ActivityMinted(to, tokenId, distance, duration, gpsProofHash);

        return tokenId;
    }

    /**
     * @notice Validation oracle GPS (appel Chainlink callback)
     * @param tokenId Token à valider
     * @param valid Résultat validation
     */
    function validateActivity(uint256 tokenId, bool valid)
        external
        onlyRole(ORACLE_ROLE)
    {
        require(_exists(tokenId), "Token does not exist");

        activities[tokenId].validated = valid;

        emit ActivityValidated(tokenId, msg.sender, valid);
    }

    /**
     * @notice Burn NFT (RGPD right to deletion)
     * @param tokenId Token à burn
     */
    function burn(uint256 tokenId) external nonReentrant {
        require(ownerOf(tokenId) == msg.sender, "Not token owner");

        delete activities[tokenId];
        _burn(tokenId);

        emit ActivityBurned(msg.sender, tokenId);
    }

    /**
     * @notice Batch burn (optimisation gas)
     * @param tokenIds Tableau tokens à burn
     * @dev Max 10 burns par batch (limite zkEVM)
     * @custom:gas Avg 100-120k gas per burn (vs 140-160k solo)
     */
    function batchBurn(uint256[] calldata tokenIds) external nonReentrant {
        uint256 length = tokenIds.length;
        require(length <= 10, "Batch size exceeds limit");

        for (uint256 i = 0; i < length;) {
            uint256 tokenId = tokenIds[i];
            require(ownerOf(tokenId) == msg.sender, "Not token owner");

            delete activities[tokenId];
            _burn(tokenId);

            emit ActivityBurned(msg.sender, tokenId);

            unchecked { ++i; } // Gas optimization
        }
    }

    /**
     * @notice Batch mint (optimisation gas)
     * @param recipients Tableau adresses
     * @param distances Tableau distances
     * @param durations Tableau durées
     * @param caloriesArray Tableau calories
     * @param gpsProofHashes Tableau hash GPS
     * @dev Max 10 mints par batch (limite zkEVM)
     * @custom:gas Avg 120-130k gas per mint (vs 140-150k solo)
     */
    function batchMint(
        address[] calldata recipients,
        uint256[] calldata distances,
        uint256[] calldata durations,
        uint256[] calldata caloriesArray,
        bytes32[] calldata gpsProofHashes
    ) external nonReentrant whenNotPaused onlyRole(MINTER_ROLE) returns (uint256[] memory) {
        uint256 length = recipients.length;
        require(length <= 10, "Batch size exceeds limit");
        require(
            length == distances.length &&
            length == durations.length &&
            length == caloriesArray.length &&
            length == gpsProofHashes.length,
            "Array length mismatch"
        );

        uint256[] memory tokenIds = new uint256[](length);

        for (uint256 i = 0; i < length;) {
            tokenIds[i] = mint(
                recipients[i],
                distances[i],
                durations[i],
                caloriesArray[i],
                gpsProofHashes[i]
            );

            unchecked { ++i; } // Gas optimization
        }

        return tokenIds;
    }

    /**
     * @notice Override transfer pour enforcement soulbound
     * @dev Bloque tous les transfers sauf mint/burn
     */
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 batchSize
    ) internal override whenNotPaused {
        // Autorise mint (from = 0x0) et burn (to = 0x0)
        if (from != address(0) && to != address(0)) {
            revert SoulboundTransferNotAllowed();
        }

        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }

    /**
     * @notice Upgrade authorization (UUPS pattern)
     * @dev Only multi-sig with UPGRADER_ROLE
     */
    function _authorizeUpgrade(address newImplementation)
        internal
        override
        onlyRole(UPGRADER_ROLE)
    {
        // Additional checks possible (e.g., timelock verification)
    }

    /**
     * @notice Pause contract (emergency stop)
     * @dev Only admin can pause
     */
    function pause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _pause();
    }

    /**
     * @notice Unpause contract
     */
    function unpause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _unpause();
    }

    /**
     * @notice Interface support (ERC165)
     */
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721Upgradeable, AccessControlUpgradeable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    /**
     * @notice Get activity data
     * @param tokenId Token ID
     * @return Activity struct
     */
    function getActivity(uint256 tokenId) external view returns (Activity memory) {
        require(_exists(tokenId), "Token does not exist");
        return activities[tokenId];
    }

    /**
     * @notice Get total minted tokens
     */
    function totalSupply() external view returns (uint256) {
        return _tokenIdCounter;
    }
}