import { z } from "zod";
import { createPublicClient, createWalletClient, http, parseUnits, Address } from 'viem';
import { mainnet } from 'viem/chains';
import { privateKeyToAccount } from 'viem/accounts';
import { verifySwapRisk } from "./RiskGuard";
import { TransactionMonitor } from "./TransactionMonitor";

// ABIs (Simulés pour l'exemple)
const ERC20_ABI = [
  { "constant": true, "inputs": [{ "name": "_owner", "type": "address" }, { "name": "_spender", "type": "address" }], "name": "allowance", "outputs": [{ "name": "", "type": "uint256" }], "type": "function" },
  { "constant": false, "inputs": [{ "name": "_spender", "type": "address" }, { "name": "_value", "type": "uint256" }], "name": "approve", "outputs": [{ "name": "", "type": "bool" }], "type": "function" }
] as const;

export const SwapInputSchema = z.object({
  tokenIn: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
  tokenOut: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
  amountIn: z.string(),
  slippage: z.number().default(0.5),
  recipient: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
});

export type SwapInput = z.infer<typeof SwapInputSchema>;

/**
 * SwapAgent (fixie.run pattern)
 * Utilise le RiskGuard comme sous-agent avant d'émettre la transaction.
 */
export async function executeSwapWithSafety(input: SwapInput, privateKey: string) {
  const account = privateKeyToAccount(privateKey as Address);
  const client = createPublicClient({ chain: mainnet, transport: http() });
  const wallet = createWalletClient({ account, chain: mainnet, transport: http() });

  const amountToSwap = parseUnits(input.amountIn, 18); // Hypothèse 18 decimals

  // --- STEP 1: RISK ASSESSMENT (Subagent Call) ---
  console.log("[SwapAgent] Initializing Risk Assessment...");
  const riskAssessment = await verifySwapRisk({
    tokenIn: input.tokenIn,
    tokenOut: input.tokenOut,
    amountIn: amountToSwap,
    maxSlippage: input.slippage
  });

  if (!riskAssessment.isSafe) {
    return {
      success: false,
      error: `Swap rejected by RiskGuard: ${riskAssessment.reason}`,
      code: "RISK_REJECTION"
    };
  }

  console.log(`[SwapAgent] Risk Assessment Clear: ${riskAssessment.reason}`);

    // --- PHASE 3: SWAP EXECUTION ---
    const ROUTER_ADDRESS = "0xE592427A0AEce92De3Edee1F18E0157C05861564";
    const swapParams = {
      tokenIn: input.tokenIn as Address,
      tokenOut: input.tokenOut as Address,
      fee: 3000,
      recipient: input.recipient as Address,
      deadline: BigInt(Math.floor(Date.now() / 1000) + 60 * 20),
      amountIn: amountToSwap,
      amountOutMinimum: riskAssessment.data?.expectedAmountOut || 0n,
      sqrtPriceLimitX96: 0n,
    };

    console.log(`[SwapAgent] Dispatching Transaction to Uniswap V3...`);
    const txHash = await wallet.writeContract({
      address: ROUTER_ADDRESS,
      abi: [] as any, // ABI à importer normalement
      functionName: 'exactInputSingle',
      args: [swapParams],
    });

    // --- PHASE 4: REAL-TIME MONITORING ---
    const monitor = new TransactionMonitor(1);
    
    // On lance la surveillance en tâche de fond (Fire and Forget or Await depending on UI needs)
    // Ici on await pour retourner le résultat final au dashboard
    const finalStatus = await monitor.watch({ txHash }, async (event) => {
      // Log chaque mise à jour vers le Neural Buffer pour le dashboard
      await monitor.logToNeuralBuffer(event);
      console.log(`[SwapAgent Update] Status: ${event.status} - ${event.message}`);
    });

    return {
      success: finalStatus.status === 'SUCCESS',
      data: {
        hash: txHash,
        finalReceipt: finalStatus.receipt,
        priceImpact: riskAssessment.data?.impactPercent
      },
      message: finalStatus.message
    };

  } catch (error: any) {
    console.error("[SwapAgent Error]", error);
    return {
      success: false,
      error: error.message || "Execution error",
      code: "EXECUTION_FAILED"
    };
  }
}
