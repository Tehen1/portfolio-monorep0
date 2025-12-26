# ARBITRAGE AGENT DOCUMENTATION
**Autonomous Cross-DEX Arbitrage System for fixie.run**

---

## 🎯 OVERVIEW
L'ArbitrageAgent est un système multi-agents qui détecte et exécute automatiquement des opportunités d'arbitrage entre différents DEX (Decentralized Exchanges).

## 🏗️ ARCHITECTURE

### Composants
1. **ArbitrageScanner** (Subagent) - Détection d'opportunités
2. **ArbitrageAgent** (Orchestrator) - Coordination et exécution
3. **TransactionMonitor** (Observer) - Surveillance post-exécution

### Flux d'Exécution
```
User Request
    ↓
ArbitrageAgent.analyzeOpportunity()
    ↓
ArbitrageScanner.scanOpportunity()
    ├─→ Query Uniswap V3 Quoter
    ├─→ Query SushiSwap Quoter
    └─→ Calculate Profit (after gas)
    ↓
Is Profitable? (> minProfitBps)
    ├─→ NO: Return analysis + recommendation
    └─→ YES: Execute atomic swap
            ↓
        TransactionMonitor.watch()
            ↓
        Return final status
```

## 📊 EXEMPLE D'UTILISATION

### Mode Analyse (Sans Exécution)
```typescript
import { ArbitrageAgent } from '@portfolio/ai-agents/defi/ArbitrageAgent';

const agent = new ArbitrageAgent();

const analysis = await agent.analyzeOpportunity({
  tokenIn: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", // WETH
  tokenOut: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", // USDC
  amountIn: "1.0", // 1 WETH
  minProfitBps: 50 // 0.5% minimum profit
});

console.log(analysis);
// Output:
// {
//   profitable: true,
//   profitBps: "75.23",
//   netProfit: "0.0075",
//   strategy: {
//     buy: { dex: "SushiSwap", price: 2450.12 },
//     sell: { dex: "Uniswap V3", price: 2468.56 }
//   },
//   recommendation: "Execute arbitrage: Buy on SushiSwap, Sell on Uniswap V3"
// }
```

### Mode Exécution
```typescript
const result = await agent.executeArbitrage({
  tokenIn: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
  tokenOut: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
  amountIn: "1.0",
  minProfitBps: 50
}, process.env.PRIVATE_KEY!);

// Output:
// {
//   success: true,
//   analysis: { ... },
//   execution: {
//     txHash: "0xabc123...",
//     finalStatus: "SUCCESS",
//     message: "Arbitrage executed successfully"
//   }
// }
```

### Mode Surveillance Continue (Bot 24/7)
```typescript
const stopWatching = await agent.watchForOpportunities(
  {
    tokenIn: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    tokenOut: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    amountIn: "1.0",
    minProfitBps: 50
  },
  (opportunity) => {
    // Callback appelé quand une opportunité est détectée
    console.log("🎯 Profitable arbitrage found!", opportunity);
    // Ici, vous pouvez décider d'exécuter automatiquement ou d'alerter l'utilisateur
  },
  30000 // Check toutes les 30 secondes
);

// Pour arrêter la surveillance:
// stopWatching();
```

## 🔐 SÉCURITÉ

### Protection Anti-Sandwich
Le scanner calcule le prix effectif en temps réel via les Quoters on-chain, ce qui garantit que le prix observé est le prix réel au moment de l'exécution.

### Validation du Profit Net
Le système déduit automatiquement les coûts de gas estimés du profit brut pour ne proposer que des opportunités réellement profitables.

### Atomic Execution (Production)
En production, l'arbitrage serait exécuté via un smart contract qui utilise des Flash Loans pour:
1. Emprunter le capital nécessaire (sans collatéral)
2. Exécuter les swaps sur les deux DEX
3. Rembourser le prêt + frais
4. Garder le profit

**Si une étape échoue, toute la transaction est annulée (atomicité).**

## 📈 MÉTRIQUES CLÉS

| Métrique | Description | Valeur Typique |
|----------|-------------|----------------|
| `minProfitBps` | Profit minimum requis (basis points) | 50 (0.5%) |
| `maxSlippage` | Slippage maximum toléré | 1.0% |
| `scanInterval` | Fréquence de scan (mode watch) | 30000ms |
| `gasEstimate` | Coût de gas estimé | ~300k gas |

## 🚀 PROCHAINES ÉTAPES

### Améliorations Recommandées
1. **Flash Loan Integration** : Intégrer Aave/dYdX pour éliminer le besoin de capital initial.
2. **Multi-Hop Arbitrage** : Supporter les arbitrages triangulaires (A→B→C→A).
3. **MEV Protection** : Utiliser Flashbots pour éviter le front-running.
4. **Machine Learning** : Prédire les opportunités avant qu'elles n'apparaissent.

### Déploiement
Pour déployer en production:
1. Créer un smart contract d'arbitrage (Solidity)
2. Déployer sur Mainnet avec Hardhat/Foundry
3. Configurer un serveur Node.js qui exécute l'agent 24/7
4. Mettre en place des alertes (Discord/Telegram) pour les opportunités détectées

---

**Status**: Production-Ready (Simulation Mode)  
**Next**: Implement Flash Loan execution logic
