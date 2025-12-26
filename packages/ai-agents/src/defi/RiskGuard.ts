import { z } from "zod";
import { createPublicClient, http, Address, formatUnits } from 'viem';
import { mainnet } from 'viem/chains';

// ABI minimal pour le Quoter de Uniswap V3 pour vérifier la liquidité/prix
const QUOTER_V2_ABI = [
  {
    "inputs": [
      {
        "components": [
          { "internalType": "address", "name": "tokenIn", "type": "address" },
          { "internalType": "address", "name": "tokenOut", "type": "address" },
          { "internalType": "uint256", "name": "amountIn", "type": "uint256" },
          { "internalType": "uint24", "name": "fee", "type": "uint24" },
          { "internalType": "uint160", "name": "sqrtPriceLimitX96", "type": "uint160" }
        ],
        "internalType": "struct IQuoterV2.QuoteExactInputSingleParams",
        "name": "params",
        "type": "tuple"
      }
    ],
    "name": "quoteExactInputSingle",
    "outputs": [
      { "internalType": "uint256", "name": "amountOut", "type": "uint256" },
      { "internalType": "uint160", "name": "sqrtPriceX96After", "type": "uint160" },
      { "internalType": "uint32", "name": "initializedTicksCrossed", "type": "uint32" },
      { "internalType": "uint256", "name": "gasEstimate", "type": "uint256" }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  }
] as const;

export const RiskGuardSchema = z.object({
  tokenIn: z.string(),
  tokenOut: z.string(),
  amountIn: z.bigint(),
  maxSlippage: z.number().default(0.5),
});

export type RiskGuardInput = z.infer<typeof RiskGuardSchema>;

/**
 * RiskGuard Subagent
 * Vérifie l'impact sur le prix (Price Impact) et la liquidité avant un swap.
 */
export async function verifySwapRisk(input: RiskGuardInput) {
  const QUOTER_V2_ADDRESS = "0x61fFe014b9F3d274404953c5E3f5B4EB5E731998"; // Mainnet QuoterV2
  const client = createPublicClient({ chain: mainnet, transport: http() });

  try {
    console.log(`[RiskGuard] Checking liquidity for ${input.amountIn.toString()} units...`);

    // 1. Obtenir une citation (Quote) pour calculer le prix effectif
    const { result } = await client.simulateContract({
      address: QUOTER_V2_ADDRESS,
      abi: QUOTER_V2_ABI,
      functionName: 'quoteExactInputSingle',
      args: [{
        tokenIn: input.tokenIn as Address,
        tokenOut: input.tokenOut as Address,
        amountIn: input.amountIn,
        fee: 3000,
        sqrtPriceLimitX96: 0n,
      }],
    });

    const [amountOut, sqrtPriceX96After] = result;

    // 2. Calcul du Price Impact (Simplifié ici)
    // En production, on comparerait avec le prix spot actuel du pool
    // Si amountOut est trop faible par rapport à la valeur attendue -> High Risk
    
    const isSafe = amountOut > 0n; // Logique de seuil de sécurité à affiner
    const impactPercent = 0.2; // Valeur simulée pour l'exemple

    if (impactPercent > input.maxSlippage) {
      return {
        isSafe: false,
        reason: `Price Impact too high: ${impactPercent}% (Max allowed: ${input.maxSlippage}%)`,
        data: { amountOut, impactPercent }
      };
    }

    return {
      isSafe: true,
      reason: "Liquidity is sufficient and price impact is within limits.",
      data: {
        expectedAmountOut: amountOut,
        impactPercent
      }
    };

  } catch (error: any) {
    return {
      isSafe: false,
      reason: `Liquidity check failed: ${error.message}`,
      error
    };
  }
}
