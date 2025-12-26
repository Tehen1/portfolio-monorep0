import { z } from "zod";
import { createWalletClient, http, Address, parseUnits } from 'viem';
import { mainnet } from 'viem/chains';
import { privateKeyToAccount } from 'viem/accounts';
import { ArbitrageScanner } from "./ArbitrageScanner";
import { TransactionMonitor } from "./TransactionMonitor";

export const ArbitrageExecutionSchema = z.object({
  tokenIn: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
  tokenOut: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
  amountIn: z.string(),
  minProfitBps: z.number().default(50),
  maxSlippage: z.number().default(1.0),
});

export type ArbitrageExecution = z.infer<typeof ArbitrageExecutionSchema>;

/**
 * ArbitrageAgent (Orchestrator)
 * Coordonne le scan d'opportunités et l'exécution atomique d'arbitrages cross-DEX.
 * 
 * Architecture:
 * 1. ArbitrageScanner → Détecte les opportunités
 * 2. RiskGuard → Valide la profitabilité après gas
 * 3. FlashLoanExecutor → Exécute l'arbitrage (si capital insuffisant)
 * 4. TransactionMonitor → Surveille l'exécution
 */
export class ArbitrageAgent {
  private scanner: ArbitrageScanner;
  private monitor: TransactionMonitor;

  constructor() {
    this.scanner = new ArbitrageScanner();
    this.monitor = new TransactionMonitor(1);
  }

  /**
   * Analyse une opportunité d'arbitrage sans l'exécuter
   */
  async analyzeOpportunity(params: ArbitrageExecution) {
    const validated = ArbitrageExecutionSchema.parse(params);
    const amountInBigInt = parseUnits(validated.amountIn, 18);

    console.log(`[ArbitrageAgent] Analyzing arbitrage opportunity...`);
    
    const opportunity = await this.scanner.scanOpportunity({
      tokenIn: validated.tokenIn,
      tokenOut: validated.tokenOut,
      amountIn: amountInBigInt,
      minProfitBps: validated.minProfitBps
    });

    return {
      ...opportunity,
      timestamp: new Date().toISOString(),
      params: validated
    };
  }

  /**
   * Exécute un arbitrage si profitable
   * Note: Cette version est simplifiée. En production, on utiliserait un Flash Loan.
   */
  async executeArbitrage(params: ArbitrageExecution, privateKey: string) {
    // Phase 1: Analyse
    const analysis = await this.analyzeOpportunity(params);

    if (!analysis.profitable) {
      return {
        success: false,
        reason: analysis.recommendation,
        analysis
      };
    }

    console.log(`[ArbitrageAgent] Profitable opportunity detected!`);
    console.log(`[ArbitrageAgent] Strategy: ${analysis.recommendation}`);
    console.log(`[ArbitrageAgent] Expected profit: ${analysis.profitBps} bps (${analysis.netProfit} tokens)`);

    // Phase 2: Exécution (Simulation ici, en prod on utiliserait un contrat d'arbitrage)
    try {
      const account = privateKeyToAccount(privateKey as Address);
      const wallet = createWalletClient({ account, chain: mainnet, transport: http() });

      // Dans une implémentation réelle, on appellerait un smart contract d'arbitrage
      // qui exécuterait atomiquement:
      // 1. Flash Loan (Aave/dYdX)
      // 2. Swap sur DEX A (achat)
      // 3. Swap sur DEX B (vente)
      // 4. Remboursement du Flash Loan + profit

      console.log(`[ArbitrageAgent] Executing atomic arbitrage transaction...`);
      
      // Placeholder pour la transaction réelle
      const txHash = "0x" + "0".repeat(64); // Simulé

      // Phase 3: Monitoring
      const finalStatus = await this.monitor.watch({ txHash }, async (event) => {
        await this.monitor.logToNeuralBuffer(event);
        console.log(`[ArbitrageAgent] ${event.status}: ${event.message}`);
      });

      return {
        success: finalStatus.status === 'SUCCESS',
        analysis,
        execution: {
          txHash,
          finalStatus: finalStatus.status,
          message: finalStatus.message
        }
      };

    } catch (error: any) {
      console.error(`[ArbitrageAgent] Execution failed:`, error);
      return {
        success: false,
        reason: error.message,
        analysis
      };
    }
  }

  /**
   * Mode "Watch" - Surveillance continue des opportunités
   * Utile pour un bot qui tourne 24/7
   */
  async watchForOpportunities(
    params: ArbitrageExecution,
    onOpportunity: (analysis: any) => void,
    intervalMs: number = 30000 // Check toutes les 30 secondes
  ) {
    console.log(`[ArbitrageAgent] Starting continuous monitoring (interval: ${intervalMs}ms)...`);

    const checkOpportunity = async () => {
      const analysis = await this.analyzeOpportunity(params);
      
      if (analysis.profitable) {
        console.log(`[ArbitrageAgent] 🎯 OPPORTUNITY DETECTED!`);
        onOpportunity(analysis);
      } else {
        console.log(`[ArbitrageAgent] No profitable opportunity. Next check in ${intervalMs/1000}s...`);
      }
    };

    // Premier check immédiat
    await checkOpportunity();

    // Puis checks périodiques
    const intervalId = setInterval(checkOpportunity, intervalMs);

    // Retourne une fonction pour arrêter la surveillance
    return () => {
      clearInterval(intervalId);
      console.log(`[ArbitrageAgent] Monitoring stopped.`);
    };
  }
}
