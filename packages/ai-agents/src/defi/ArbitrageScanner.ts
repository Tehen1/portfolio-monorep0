import { z } from "zod";
import { createPublicClient, http, Address, parseUnits, formatUnits } from 'viem';
import { mainnet } from 'viem/chains';

// Schema pour les paramètres d'arbitrage
export const ArbitrageOpportunitySchema = z.object({
  tokenIn: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
  tokenOut: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
  amountIn: z.bigint(),
  minProfitBps: z.number().default(50), // 0.5% minimum profit (50 basis points)
});

export type ArbitrageOpportunity = z.infer<typeof ArbitrageOpportunitySchema>;

// Configuration des DEX à surveiller
const DEX_CONFIGS = {
  uniswapV3: {
    name: "Uniswap V3",
    quoter: "0x61fFe014b9F3d274404953c5E3f5B4EB5E731998" as Address,
    router: "0xE592427A0AEce92De3Edee1F18E0157C05861564" as Address,
  },
  sushiswap: {
    name: "SushiSwap",
    quoter: "0x64e8802FE490fa7cc61d3463958199161Bb608A7" as Address,
    router: "0xd9e1cE17f2641f24aE83637ab66a2cca9C378B9F" as Address,
  },
  curve: {
    name: "Curve",
    // Curve utilise un système différent, on simplifie ici
    quoter: "0x0000000000000000000000000000000000000000" as Address,
    router: "0x0000000000000000000000000000000000000000" as Address,
  }
};

// ABI minimal du Quoter V2
const QUOTER_ABI = [
  {
    "inputs": [
      {
        "components": [
          { "name": "tokenIn", "type": "address" },
          { "name": "tokenOut", "type": "address" },
          { "name": "amountIn", "type": "uint256" },
          { "name": "fee", "type": "uint24" },
          { "name": "sqrtPriceLimitX96", "type": "uint160" }
        ],
        "name": "params",
        "type": "tuple"
      }
    ],
    "name": "quoteExactInputSingle",
    "outputs": [
      { "name": "amountOut", "type": "uint256" },
      { "name": "sqrtPriceX96After", "type": "uint160" },
      { "name": "initializedTicksCrossed", "type": "uint32" },
      { "name": "gasEstimate", "type": "uint256" }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  }
] as const;

interface PriceQuote {
  dex: string;
  amountOut: bigint;
  gasEstimate: bigint;
  effectivePrice: number; // Prix effectif après frais
}

/**
 * ArbitrageScanner Subagent
 * Scanne plusieurs DEX pour détecter des opportunités d'arbitrage profitables.
 */
export class ArbitrageScanner {
  private client;

  constructor() {
    this.client = createPublicClient({ 
      chain: mainnet, 
      transport: http() 
    });
  }

  /**
   * Obtient une cotation de prix sur un DEX spécifique
   */
  async getQuote(
    dexName: keyof typeof DEX_CONFIGS,
    tokenIn: Address,
    tokenOut: Address,
    amountIn: bigint
  ): Promise<PriceQuote | null> {
    const dex = DEX_CONFIGS[dexName];
    
    try {
      // Pour Curve, on utiliserait une logique différente (pas implémentée ici)
      if (dexName === 'curve') {
        return null;
      }

      const { result } = await this.client.simulateContract({
        address: dex.quoter,
        abi: QUOTER_ABI,
        functionName: 'quoteExactInputSingle',
        args: [{
          tokenIn,
          tokenOut,
          amountIn,
          fee: 3000, // 0.3% fee tier
          sqrtPriceLimitX96: 0n,
        }],
      });

      const [amountOut, , , gasEstimate] = result;

      // Calcul du prix effectif (en tenant compte du gas)
      const effectivePrice = Number(formatUnits(amountOut, 18)) / Number(formatUnits(amountIn, 18));

      return {
        dex: dex.name,
        amountOut,
        gasEstimate,
        effectivePrice
      };

    } catch (error) {
      console.error(`[ArbitrageScanner] Failed to get quote from ${dex.name}:`, error);
      return null;
    }
  }

  /**
   * Scanne tous les DEX et identifie la meilleure opportunité d'arbitrage
   */
  async scanOpportunity(params: ArbitrageOpportunity) {
    console.log(`[ArbitrageScanner] Scanning for arbitrage opportunities...`);

    // Étape 1: Obtenir les cotations de tous les DEX
    const quotes = await Promise.all([
      this.getQuote('uniswapV3', params.tokenIn as Address, params.tokenOut as Address, params.amountIn),
      this.getQuote('sushiswap', params.tokenIn as Address, params.tokenOut as Address, params.amountIn),
    ]);

    const validQuotes = quotes.filter((q): q is PriceQuote => q !== null);

    if (validQuotes.length < 2) {
      return {
        profitable: false,
        reason: "Insufficient liquidity across DEXs",
        quotes: validQuotes
      };
    }

    // Étape 2: Trouver le meilleur prix d'achat (lowest) et de vente (highest)
    const sortedByPrice = [...validQuotes].sort((a, b) => a.effectivePrice - b.effectivePrice);
    const buyDex = sortedByPrice[0]; // Acheter ici (prix le plus bas)
    const sellDex = sortedByPrice[sortedByPrice.length - 1]; // Vendre ici (prix le plus haut)

    // Étape 3: Calculer le profit potentiel
    const profitAbsolute = sellDex.amountOut - buyDex.amountOut;
    const profitBps = (Number(formatUnits(profitAbsolute, 18)) / Number(formatUnits(params.amountIn, 18))) * 10000;

    // Étape 4: Estimation des coûts de gas
    const totalGasCost = buyDex.gasEstimate + sellDex.gasEstimate;
    const gasCostInToken = totalGasCost * 50n; // Estimation simplifiée (50 gwei * gas)

    const netProfit = profitAbsolute - gasCostInToken;
    const isProfitable = profitBps >= params.minProfitBps && netProfit > 0n;

    return {
      profitable: isProfitable,
      profitBps: profitBps.toFixed(2),
      profitAbsolute: formatUnits(profitAbsolute, 18),
      netProfit: formatUnits(netProfit, 18),
      strategy: {
        buy: { dex: buyDex.dex, price: buyDex.effectivePrice },
        sell: { dex: sellDex.dex, price: sellDex.effectivePrice }
      },
      gasEstimate: totalGasCost.toString(),
      recommendation: isProfitable 
        ? `Execute arbitrage: Buy on ${buyDex.dex}, Sell on ${sellDex.dex}`
        : `Not profitable. Spread: ${profitBps.toFixed(2)} bps (min required: ${params.minProfitBps} bps)`
    };
  }
}
