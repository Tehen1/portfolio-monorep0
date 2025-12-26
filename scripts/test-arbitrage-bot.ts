import { ArbitrageAgent } from '../packages/ai-agents/src/defi/ArbitrageAgent';

/**
 * Script de test pour le bot d'arbitrage
 * Mode simulation (pas de vraies transactions)
 */
async function testArbitrageBot() {
  console.log('🤖 Initializing Arbitrage Bot (Simulation Mode)...\n');

  const agent = new ArbitrageAgent();

  // Configuration
  const config = {
    tokenIn: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", // WETH
    tokenOut: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", // USDC
    amountIn: "1.0",
    minProfitBps: 50 // 0.5% minimum
  };

  console.log('📊 Configuration:');
  console.log(`   Pair: WETH/USDC`);
  console.log(`   Amount: ${config.amountIn} WETH`);
  console.log(`   Min Profit: ${config.minProfitBps} bps (${config.minProfitBps/100}%)\n`);

  // Test 1: Analyse unique
  console.log('🔍 Test 1: Single Opportunity Analysis\n');
  try {
    const analysis = await agent.analyzeOpportunity(config);
    
    console.log('📈 Analysis Result:');
    console.log(`   Profitable: ${analysis.profitable ? '✅ YES' : '❌ NO'}`);
    console.log(`   Profit: ${analysis.profitBps} bps`);
    console.log(`   Net Profit: ${analysis.netProfit} tokens`);
    console.log(`   Strategy: ${analysis.recommendation}\n`);

    if (analysis.profitable) {
      console.log('💰 Trade Details:');
      console.log(`   Buy on: ${analysis.strategy.buy.dex} @ $${analysis.strategy.buy.price}`);
      console.log(`   Sell on: ${analysis.strategy.sell.dex} @ $${analysis.strategy.sell.price}\n`);
    }
  } catch (error: any) {
    console.error('❌ Error during analysis:', error.message);
  }

  // Test 2: Mode surveillance (3 scans)
  console.log('\n🔄 Test 2: Continuous Monitoring (3 scans)\n');
  
  let scanCount = 0;
  const maxScans = 3;

  const stopWatching = await agent.watchForOpportunities(
    config,
    (opportunity) => {
      scanCount++;
      console.log(`\n🎯 Scan #${scanCount}/${maxScans}`);
      console.log(`   Timestamp: ${new Date(opportunity.timestamp).toLocaleTimeString()}`);
      console.log(`   Profitable: ${opportunity.profitable ? '✅' : '❌'}`);
      console.log(`   Profit: ${opportunity.profitBps} bps`);
      
      if (scanCount >= maxScans) {
        console.log('\n✅ Test completed. Stopping bot...\n');
        stopWatching();
      }
    },
    10000 // Scan toutes les 10 secondes
  );

  // Attendre la fin des scans
  await new Promise(resolve => setTimeout(resolve, 35000));
  
  console.log('🏁 Arbitrage Bot Test Finished\n');
  console.log('💡 Next Steps:');
  console.log('   1. Deploy smart contract to testnet');
  console.log('   2. Test with real (small) amounts on testnet');
  console.log('   3. Enable Flashbots protection');
  console.log('   4. Launch on mainnet with monitoring\n');
}

// Lancer le test
testArbitrageBot().catch(console.error);
