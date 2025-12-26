import { createPublicClient, http, Address, TransactionReceipt } from 'viem';
import { mainnet } from 'viem/chains';
import { z } from "zod";

export const MonitorSchema = z.object({
  txHash: z.string().regex(/^0x[a-fA-F0-9]{64}$/, "Invalid transaction hash"),
  chainId: z.number().int().positive().default(1),
  timeout: z.number().int().positive().default(60000), // 60 seconds default
});

export type MonitorInput = z.infer<typeof MonitorSchema>;

export interface MonitorEvent {
  status: 'PENDING' | 'SUCCESS' | 'FAILED' | 'TIMEOUT';
  hash: string;
  receipt?: TransactionReceipt;
  message: string;
  timestamp: number;
}

/**
 * TransactionMonitor Subagent
 * Surveille en temps réel le statut d'une transaction blockchain.
 * Notifie le Neural Buffer / Dashboard fixie.run à chaque étape.
 */
export class TransactionMonitor {
  private client;

  constructor(chainId: number = 1) {
    // Dans une version plus avancée, on mapperait le chainId vers le bon RPC
    this.client = createPublicClient({ 
      chain: mainnet, 
      transport: http() 
    });
  }

  /**
   * Lance la surveillance d'une transaction
   */
  async watch(input: MonitorInput, onUpdate?: (event: MonitorEvent) => void): Promise<MonitorEvent> {
    const { txHash, timeout } = MonitorSchema.parse(input);
    const startTime = Date.now();

    console.log(`[Monitor] Starting surveillance for: ${txHash}`);

    // Événement initial
    const initialEvent: MonitorEvent = {
      status: 'PENDING',
      hash: txHash,
      message: "Transaction soumise. En attente de confirmation...",
      timestamp: startTime,
    };
    if (onUpdate) onUpdate(initialEvent);

    try {
      // Attente du reçu avec timeout
      const receipt = await this.client.waitForTransactionReceipt({ 
        hash: txHash as Address,
        timeout: timeout
      });

      const success = receipt.status === 'success';
      const event: MonitorEvent = {
        status: success ? 'SUCCESS' : 'FAILED',
        hash: txHash,
        receipt: receipt,
        message: success 
          ? `Succès ! Transaction confirmée dans le bloc ${receipt.blockNumber}.`
          : "Échec : La transaction a été rejetée par le réseau (Reverted).",
        timestamp: Date.now(),
      };

      if (onUpdate) onUpdate(event);
      return event;

    } catch (error: any) {
      let finalStatus: 'TIMEOUT' | 'FAILED' = 'FAILED';
      let message = `Erreur de monitoring : ${error.message}`;

      if (error.name === 'WaitForTransactionReceiptTimeoutError') {
        finalStatus = 'TIMEOUT';
        message = "Délai d'attente dépassé (Timeout). La transaction est peut-être toujours en attente.";
      }

      const errorEvent: MonitorEvent = {
        status: finalStatus,
        hash: txHash,
        message: message,
        timestamp: Date.now(),
      };

      if (onUpdate) onUpdate(errorEvent);
      return errorEvent;
    }
  }

  /**
   * Log statut vers le Neural Buffer (Auditabilité)
   */
  async logToNeuralBuffer(event: MonitorEvent) {
    // Cette fonction simule l'envoi vers votre base de données de logs / dashboard
    console.log(`[NeuralBuffer] AUDIT_LOG: ${JSON.stringify(event)}`);
    // En production: await prisma.transactionLogs.create({ data: event });
  }
}
