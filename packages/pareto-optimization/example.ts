/**
 * Pareto Optimization Example Usage
 * Demonstrates how to use the 80/20 Pareto optimization system
 */

import {
  createParetoOptimization,
  validateParetoCompliance,
  generateParetoReport,
  EffortAllocator,
  AllocationUtils,
  PARETO_DOMAINS
} from './src/index.js';

/**
 * Basic Pareto Optimization Example
 */
function basicParetoExample() {
  console.log('🎯 PARETO OPTIMIZATION EXAMPLE\n');

  // Create optimization instance
  const { engine, analyticsEngine, getRankings, getMetrics, getAnalytics } = createParetoOptimization();

  // Get domain rankings
  const rankings = getRankings();
  console.log('📊 DOMAIN RANKINGS (Top 5):');
  rankings.slice(0, 5).forEach((ranking, index) => {
    console.log(`${index + 1}. ${ranking.domainId}: €${ranking.revenueImpact.toLocaleString()} impact`);
  });

  // Get portfolio metrics
  const metrics = getMetrics();
  console.log('\n📈 PORTFOLIO METRICS:');
  console.log(`- Revenue Concentration: ${metrics.revenueConcentration.top5Percentage.toFixed(1)}%`);
  console.log(`- Pareto Ratio: ${metrics.revenueConcentration.paretoRatio ? '✅' : '❌'} (80/20 compliant)`);
  console.log(`- Average ROI/Hour: €${metrics.effortEfficiency.averageRoiPerHour.toFixed(0)}`);

  // Get analytics dashboard
  const analytics = getAnalytics();
  console.log('\n⚠️ ACTIVE ALERTS:');
  if (analytics.alerts.length === 0) {
    console.log('- No critical alerts - portfolio optimized!');
  } else {
    analytics.alerts.forEach(alert => {
      console.log(`- ${alert.type.toUpperCase()}: ${alert.message}`);
    });
  }

  console.log('\n' + '='.repeat(50));
}

/**
 * Effort Allocation Example
 */
function effortAllocationExample() {
  console.log('⏰ EFFORT ALLOCATION EXAMPLE\n');

  const allocator = new EffortAllocator(PARETO_DOMAINS, 40); // 40 hours/week

  // Calculate optimal allocation
  const allocations = allocator.calculateOptimalAllocation();

  console.log('📅 OPTIMAL WEEKLY ALLOCATION:');
  allocations.slice(0, 5).forEach((alloc, index) => {
    console.log(`${index + 1}. ${alloc.domainId}: ${alloc.weeklyHours}h/week (€${alloc.roiPerHour.toFixed(0)}/hour)`);
  });

  // Calculate efficiency score
  const efficiency = allocator.calculateEfficiencyScore();
  console.log('\n🎯 EFFICIENCY SCORE:');
  console.log(`- Overall: ${efficiency.score.toFixed(1)}/100`);
  console.log(`- Pareto Compliance: ${efficiency.breakdown.paretoCompliance.toFixed(1)}%`);
  console.log(`- ROI Optimization: ${efficiency.breakdown.roiOptimization.toFixed(1)}%`);

  // Generate reallocation recommendations
  const recommendations = allocator.generateReallocationRecommendations(allocations);
  console.log('\n💡 REALLOCATION RECOMMENDATIONS:');
  recommendations.recommendations.slice(0, 3).forEach(rec => {
    const actionIcon = rec.action === 'increase' ? '⬆️' : rec.action === 'decrease' ? '⬇️' : '➡️';
    console.log(`${actionIcon} ${rec.domainId}: ${rec.hoursChange > 0 ? '+' : ''}${rec.hoursChange.toFixed(1)}h (${rec.reason})`);
  });

  console.log('\n' + '='.repeat(50));
}

/**
 * Pareto Compliance Validation Example
 */
function complianceValidationExample() {
  console.log('✅ PARETO COMPLIANCE VALIDATION\n');

  const compliance = validateParetoCompliance(PARETO_DOMAINS);

  console.log('🎯 COMPLIANCE STATUS:');
  console.log(`- 80/20 Compliant: ${compliance.isCompliant ? '✅ YES' : '❌ NO'}`);
  console.log(`- Pareto Score: ${compliance.score.toFixed(1)}%`);
  console.log(`- Recommendations: ${compliance.recommendations.length}`);

  if (compliance.recommendations.length > 0) {
    console.log('\n📋 RECOMMENDATIONS:');
    compliance.recommendations.forEach(rec => console.log(`- ${rec}`));
  }

  console.log('\n' + '='.repeat(50));
}

/**
 * Allocation Scenarios Example
 */
function allocationScenariosExample() {
  console.log('🎲 ALLOCATION SCENARIOS\n');

  const scenarios = AllocationUtils.generateScenarios(PARETO_DOMAINS, 40);

  console.log('🔄 CONSERVATIVE SCENARIO (Balanced distribution):');
  scenarios.conservative.slice(0, 3).forEach(alloc => {
    console.log(`- ${alloc.domainId}: ${alloc.weeklyHours}h (${alloc.totalWeeklyEffort.toFixed(1)}%)`);
  });

  console.log('\n⚖️ BALANCED SCENARIO (Pareto optimized):');
  scenarios.balanced.slice(0, 3).forEach(alloc => {
    console.log(`- ${alloc.domainId}: ${alloc.weeklyHours}h (${alloc.totalWeeklyEffort.toFixed(1)}%)`);
  });

  console.log('\n🎯 AGGRESSIVE SCENARIO (Extreme Pareto focus):');
  scenarios.aggressive.slice(0, 3).forEach(alloc => {
    console.log(`- ${alloc.domainId}: ${alloc.weeklyHours}h (${alloc.totalWeeklyEffort.toFixed(1)}%)`);
  });

  console.log('\n' + '='.repeat(50));
}

/**
 * Generate Comprehensive Report
 */
function generateReportExample() {
  console.log('📄 COMPREHENSIVE PARETO REPORT\n');

  const report = generateParetoReport();
  console.log(report);

  console.log('\n' + '='.repeat(50));
}

/**
 * Run all examples
 */
export function runParetoExamples() {
  console.log('🚀 PARETO OPTIMIZATION EXAMPLES\n');
  console.log('Implementing 80/20 rule for 11-domain portfolio optimization\n');

  try {
    basicParetoExample();
    effortAllocationExample();
    complianceValidationExample();
    allocationScenariosExample();
    generateReportExample();

    console.log('✅ All examples completed successfully!');
    console.log('\n💡 Key Takeaways:');
    console.log('- Focus 80% of effort on top 20% of domains');
    console.log('- Tech-review-blog, antonylambi.be, and adaptogenic-mushrooms drive 60%+ of revenue');
    console.log('- Regular monitoring and reallocation maximizes ROI');
    console.log('- Pareto compliance ensures sustainable growth');

  } catch (error) {
    console.error('❌ Error running examples:', error);
  }
}

// Run examples if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runParetoExamples();
}
