// Main exports for Pareto Optimization Package
import { ParetoOptimizationEngine, ParetoUtils } from './core/pareto-engine.js';
import { RevenueForecastEngine, ForecastingUtils } from './forecasting/revenue-forecast.js';
import { ParetoAnalyticsEngine, AnalyticsUtils } from './analytics/pareto-analytics.js';
import { EffortAllocator, AllocationUtils } from './strategies/effort-allocator.js';
import {
  Q1_2025_ROADMAP,
  IMPLEMENTATION_TASKS,
  SUCCESS_METRICS,
  RISK_MITIGATION,
  calculateImplementationProgress,
  getNextPriorityTasks,
  updateTaskStatus,
  type RoadmapPhase,
  type ImplementationTask
} from './strategies/implementation-roadmap.js';
import type {
  ParetoDomain,
  DomainPriority,
  EffortLevel,
  RevenueType,
  ParetoOptimizationResult,
  EffortAllocation,
  RevenueForecast
} from './types/domain.js';
import { PARETO_DOMAINS } from './types/domain.js';

export { ParetoOptimizationEngine, ParetoUtils };
export { RevenueForecastEngine, ForecastingUtils };
export { ParetoAnalyticsEngine, AnalyticsUtils };
export { EffortAllocator, AllocationUtils };
export {
  Q1_2025_ROADMAP,
  IMPLEMENTATION_TASKS,
  SUCCESS_METRICS,
  RISK_MITIGATION,
  calculateImplementationProgress,
  getNextPriorityTasks,
  updateTaskStatus
};
export type { RoadmapPhase, ImplementationTask };

// Type exports
export type {
  ParetoDomain,
  DomainPriority,
  EffortLevel,
  RevenueType,
  ParetoOptimizationResult,
  EffortAllocation,
  RevenueForecast
};

// PARETO DOMAINS constant export
export { PARETO_DOMAINS };

/**
 * Quick start function for Pareto optimization
 */
export function createParetoOptimization() {
  const engine = new ParetoOptimizationEngine();
  const forecastEngine = new RevenueForecastEngine(engine.getAllDomains());
  const analyticsEngine = new ParetoAnalyticsEngine(engine, forecastEngine);

  return {
    engine,
    forecastEngine,
    analyticsEngine,

    // Quick methods
    getRankings: () => engine.calculateParetoRanking(),
    getAllocations: () => engine.calculateEffortAllocation(),
    getMetrics: () => engine.calculatePortfolioMetrics(),
    getAnalytics: () => analyticsEngine.generateAnalyticsDashboard(),
    getForecasts: () => engine.generateRevenueForecasts()
  };
}

/**
 * Utility function to validate Pareto compliance
 */
export function validateParetoCompliance(domains: ParetoDomain[]): {
  isCompliant: boolean;
  score: number;
  recommendations: string[];
} {
  const engine = new ParetoOptimizationEngine(domains);
  const metrics = engine.calculatePortfolioMetrics();

  const isCompliant = metrics.revenueConcentration.paretoRatio;
  const score = metrics.revenueConcentration.top5Percentage;

  const recommendations: string[] = [];
  if (!isCompliant) {
    recommendations.push('Focus more effort on top 5 domains to achieve 80/20 ratio');
    recommendations.push('Reallocate resources from low-ROI domains to high-ROI domains');
    recommendations.push('Implement stricter prioritization based on revenue impact');
  }

  return { isCompliant, score, recommendations };
}

/**
 * Generate Pareto optimization report
 */
export function generateParetoReport(): string {
  const { engine, analyticsEngine } = createParetoOptimization();
  const rankings = engine.calculateParetoRanking();
  const metrics = engine.calculatePortfolioMetrics();
  const analytics = analyticsEngine.generateAnalyticsDashboard();

  return `
🎯 PARETO OPTIMIZATION REPORT
=============================

📊 PORTFOLIO METRICS
- Total Revenue: €${analytics.summary.totalRevenue.toLocaleString()}
- Total Domains: ${analytics.summary.totalDomains}
- Average ROI: ${analytics.summary.averageROI.toFixed(1)}%
- Pareto Ratio: ${analytics.summary.paretoRatio}%
- Efficiency Score: ${analytics.summary.efficiencyScore.toFixed(2)}

🏆 TOP 5 DOMAINS (80% Revenue)
${rankings.slice(0, 5).map((r, i) =>
  `${i + 1}. ${r.domainId}: €${r.revenueImpact.toLocaleString()} revenue impact`
).join('\n')}

⚠️  ALERTS
${analytics.alerts.map(alert => `- ${alert.type.toUpperCase()}: ${alert.message}`).join('\n')}

💡 RECOMMENDATIONS
${analytics.alerts.length === 0 ? '- Portfolio performing optimally under Pareto principles' :
  '- Address critical alerts to maintain Pareto efficiency'}

Generated on ${new Date().toISOString().split('T')[0]}
`;
}
