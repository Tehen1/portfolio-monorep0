import { ParetoOptimizationEngine } from '../core/pareto-engine.js';
import { RevenueForecastEngine } from '../forecasting/revenue-forecast.js';
import { ParetoDomain, EffortAllocation, RevenueForecast } from '../types/domain.js';

/**
 * Pareto Analytics Engine
 * Real-time monitoring and KPI tracking for Pareto optimization performance
 */
export class ParetoAnalyticsEngine {
  private optimizationEngine: ParetoOptimizationEngine;
  private forecastEngine: RevenueForecastEngine;
  private kpiHistory: Map<string, Array<{ timestamp: Date; value: number; metadata?: any }>>;

  constructor(optimizationEngine: ParetoOptimizationEngine, forecastEngine: RevenueForecastEngine) {
    this.optimizationEngine = optimizationEngine;
    this.forecastEngine = forecastEngine;
    this.kpiHistory = new Map();
  }

  /**
   * Calculate real-time Pareto performance metrics
   */
  calculateRealtimeMetrics(): {
    portfolioEfficiency: number;
    paretoCompliance: number;
    revenueConcentration: number;
    effortOptimization: number;
    forecastAccuracy: number;
    riskScore: number;
  } {
    const rankings = this.optimizationEngine.calculateParetoRanking();
    const allocations = this.optimizationEngine.calculateEffortAllocation();
    const forecasts = this.optimizationEngine.generateRevenueForecasts();
    const portfolioMetrics = this.optimizationEngine.calculatePortfolioMetrics();

    // Calculate Pareto compliance (how well we follow 80/20 rule)
    const paretoCompliance = portfolioMetrics.revenueConcentration.paretoRatio ? 100 : 75;

    // Portfolio efficiency score
    const portfolioEfficiency = this.calculatePortfolioEfficiency(rankings, allocations);

    // Revenue concentration score
    const revenueConcentration = portfolioMetrics.revenueConcentration.top5Percentage;

    // Effort optimization score
    const effortOptimization = this.calculateEffortOptimizationScore(allocations);

    // Forecast accuracy (placeholder - would be calculated from actual vs predicted)
    const forecastAccuracy = this.calculateForecastAccuracyScore();

    // Risk score based on domain distribution and forecast confidence
    const riskScore = this.calculateRiskScore(forecasts);

    return {
      portfolioEfficiency,
      paretoCompliance,
      revenueConcentration,
      effortOptimization,
      forecastAccuracy,
      riskScore
    };
  }

  /**
   * Generate comprehensive analytics dashboard data
   */
  generateAnalyticsDashboard(): {
    summary: {
      totalRevenue: number;
      totalDomains: number;
      averageROI: number;
      paretoRatio: number;
      efficiencyScore: number;
    };
    domainPerformance: Array<{
      domainId: string;
      revenue: number;
      roi: number;
      efficiency: number;
      priority: string;
      trend: 'up' | 'down' | 'stable';
    }>;
    effortAllocation: {
      optimal: EffortAllocation[];
      current: EffortAllocation[];
      gaps: Array<{ domainId: string; gap: number; action: string }>;
    };
    forecasts: {
      conservative: number;
      aggressive: number;
      expected: number;
      confidence: number;
    };
    alerts: Array<{
      type: 'warning' | 'critical' | 'info';
      message: string;
      domainId?: string;
      impact: number;
    }>;
  } {
    const domains = this.optimizationEngine.getAllDomains();
    const rankings = this.optimizationEngine.calculateParetoRanking();
    const allocations = this.optimizationEngine.calculateEffortAllocation();
    const forecasts = this.optimizationEngine.generateRevenueForecasts();
    const portfolioMetrics = this.optimizationEngine.calculatePortfolioMetrics();

    const totalRevenue = domains.reduce((sum, domain) => sum + domain.y1Revenue, 0);
    const averageROI = domains.reduce((sum, domain) => sum + domain.roi, 0) / domains.length;

    // Domain performance analysis
    const domainPerformance = domains.map(domain => {
      const ranking = rankings.find(r => r.domainId === domain.id);
      const efficiency = ranking ? (ranking.revenueImpact / ranking.effortReduction) * 100 : 0;
      const trend = this.calculateDomainTrend(domain.id);

      return {
        domainId: domain.id,
        revenue: domain.y1Revenue,
        roi: domain.roi,
        efficiency,
        priority: domain.priority,
        trend
      };
    });

    // Effort allocation analysis
    const effortGaps = this.identifyEffortGaps(allocations);

    // Forecast summary
    const forecastSummary = {
      conservative: portfolioMetrics.forecastSummary.conservativeTotal,
      aggressive: portfolioMetrics.forecastSummary.aggressiveTotal,
      expected: Math.round((portfolioMetrics.forecastSummary.conservativeTotal + portfolioMetrics.forecastSummary.aggressiveTotal) / 2),
      confidence: portfolioMetrics.forecastSummary.averageConfidence * 100
    };

    // Generate alerts
    const alerts = this.generateAlerts(rankings, allocations, forecasts);

    return {
      summary: {
        totalRevenue,
        totalDomains: domains.length,
        averageROI,
        paretoRatio: portfolioMetrics.revenueConcentration.paretoRatio ? 80 : 75,
        efficiencyScore: portfolioMetrics.effortEfficiency.averageRoiPerHour
      },
      domainPerformance,
      effortAllocation: {
        optimal: allocations,
        current: allocations, // In real implementation, this would come from actual tracking
        gaps: effortGaps
      },
      forecasts: forecastSummary,
      alerts
    };
  }

  /**
   * Track KPI performance over time
   */
  trackKPIs(): void {
    const metrics = this.calculateRealtimeMetrics();
    const timestamp = new Date();

    // Track each metric
    Object.entries(metrics).forEach(([key, value]) => {
      if (!this.kpiHistory.has(key)) {
        this.kpiHistory.set(key, []);
      }
      this.kpiHistory.get(key)!.push({ timestamp, value });
    });
  }

  /**
   * Generate performance reports
   */
  generatePerformanceReport(timeframe: 'weekly' | 'monthly' | 'quarterly'): {
    period: string;
    kpiTrends: Map<string, { change: number; trend: 'improving' | 'declining' | 'stable' }>;
    topPerformers: string[];
    underperformers: string[];
    recommendations: string[];
    risks: string[];
  } {
    const now = new Date();
    const periods = timeframe === 'weekly' ? 7 : timeframe === 'monthly' ? 30 : 90;
    const startDate = new Date(now.getTime() - periods * 24 * 60 * 60 * 1000);

    const kpiTrends = new Map<string, { change: number; trend: 'improving' | 'declining' | 'stable' }>();

    // Analyze KPI trends
    this.kpiHistory.forEach((history, kpiName) => {
      const recentData = history.filter(h => h.timestamp >= startDate);
      if (recentData.length >= 2) {
        const firstValue = recentData[0].value;
        const lastValue = recentData[recentData.length - 1].value;
        const change = ((lastValue - firstValue) / firstValue) * 100;

        let trend: 'improving' | 'declining' | 'stable' = 'stable';
        if (change > 5) trend = 'improving';
        else if (change < -5) trend = 'declining';

        kpiTrends.set(kpiName, { change, trend });
      }
    });

    // Identify top and underperformers
    const rankings = this.optimizationEngine.calculateParetoRanking();
    const topPerformers = rankings.slice(0, 3).map(r => r.domainId);
    const underperformers = rankings.slice(-3).map(r => r.domainId);

    // Generate recommendations
    const recommendations = this.generateRecommendations(rankings, kpiTrends);

    // Identify risks
    const risks = this.identifyRisks(rankings, kpiTrends);

    return {
      period: `${timeframe} report (${startDate.toISOString().split('T')[0]} to ${now.toISOString().split('T')[0]})`,
      kpiTrends,
      topPerformers,
      underperformers,
      recommendations,
      risks
    };
  }

  /**
   * Calculate portfolio efficiency score
   */
  private calculatePortfolioEfficiency(rankings: any[], allocations: EffortAllocation[]): number {
    const totalRevenueImpact = rankings.reduce((sum, r) => sum + r.revenueImpact, 0);
    const totalEffort = allocations.reduce((sum, a) => sum + a.weeklyHours, 0);
    const avgROI = allocations.reduce((sum, a) => sum + a.roiPerHour, 0) / allocations.length;

    // Efficiency score combines revenue impact, effort optimization, and ROI
    const efficiencyScore = (totalRevenueImpact / totalEffort) * avgROI / 100;

    return Math.min(efficiencyScore, 100); // Cap at 100
  }

  /**
   * Calculate effort optimization score
   */
  private calculateEffortOptimizationScore(allocations: EffortAllocation[]): number {
    const totalEffort = allocations.reduce((sum, a) => sum + a.weeklyHours, 0);
    const top5Effort = allocations
      .sort((a, b) => b.roiPerHour - a.roiPerHour)
      .slice(0, 5)
      .reduce((sum, a) => sum + a.weeklyHours, 0);

    return (top5Effort / totalEffort) * 100;
  }

  /**
   * Calculate forecast accuracy score
   */
  private calculateForecastAccuracyScore(): number {
    // Placeholder - in real implementation, this would compare actual vs predicted
    return 85; // Assume 85% accuracy for now
  }

  /**
   * Calculate risk score
   */
  private calculateRiskScore(forecasts: RevenueForecast[]): number {
    const avgConfidence = forecasts.reduce((sum, f) => sum + f.confidence, 0) / forecasts.length;
    const riskFactors = forecasts.reduce((sum, f) => sum + f.risks.length, 0) / forecasts.length;

    // Risk score is inverse of confidence adjusted by risk factors
    return Math.min((1 - avgConfidence) * 100 + riskFactors * 10, 100);
  }

  /**
   * Calculate domain performance trend
   */
  private calculateDomainTrend(domainId: string): 'up' | 'down' | 'stable' {
    // Placeholder - would analyze historical performance data
    const trends = ['up', 'down', 'stable'] as const;
    return trends[Math.floor(Math.random() * trends.length)];
  }

  /**
   * Identify effort allocation gaps
   */
  private identifyEffortGaps(allocations: EffortAllocation[]): Array<{ domainId: string; gap: number; action: string }> {
    return allocations
      .filter(alloc => alloc.totalWeeklyEffort < 10) // Less than 10% of total effort
      .map(alloc => ({
        domainId: alloc.domainId,
        gap: 10 - alloc.totalWeeklyEffort,
        action: 'Increase effort allocation to improve Pareto efficiency'
      }));
  }

  /**
   * Generate alerts based on performance metrics
   */
  private generateAlerts(
    rankings: any[],
    allocations: EffortAllocation[],
    forecasts: RevenueForecast[]
  ): Array<{ type: 'warning' | 'critical' | 'info'; message: string; domainId?: string; impact: number }> {
    const alerts: Array<{ type: 'warning' | 'critical' | 'info'; message: string; domainId?: string; impact: number }> = [];

    // Check for domains with low efficiency
    rankings.forEach(ranking => {
      if (ranking.revenueImpact < ranking.effortReduction * 2) {
        alerts.push({
          type: 'warning',
          message: `Low efficiency: Revenue impact (${ranking.revenueImpact}) vs effort (${ranking.effortReduction})`,
          domainId: ranking.domainId,
          impact: ranking.revenueImpact
        });
      }
    });

    // Check forecast confidence
    forecasts.forEach(forecast => {
      if (forecast.confidence < 0.6) {
        alerts.push({
          type: 'critical',
          message: `Low forecast confidence (${(forecast.confidence * 100).toFixed(1)}%) for ${forecast.domainId}`,
          domainId: forecast.domainId,
          impact: forecast.aggressive - forecast.conservative
        });
      }
    });

    // Check Pareto compliance
    const portfolioMetrics = this.optimizationEngine.calculatePortfolioMetrics();
    if (!portfolioMetrics.revenueConcentration.paretoRatio) {
      alerts.push({
        type: 'info',
        message: 'Portfolio not achieving 80/20 Pareto ratio - consider reallocating resources',
        impact: portfolioMetrics.revenueConcentration.top5Percentage
      });
    }

    return alerts;
  }

  /**
   * Generate recommendations based on analysis
   */
  private generateRecommendations(
    rankings: any[],
    kpiTrends: Map<string, { change: number; trend: 'improving' | 'declining' | 'stable' }>
  ): string[] {
    const recommendations: string[] = [];

    // Analyze KPI trends
    kpiTrends.forEach((trend, kpi) => {
      if (trend.trend === 'declining') {
        recommendations.push(`Address declining ${kpi} (${trend.change.toFixed(1)}% change)`);
      }
    });

    // Analyze domain performance
    const topPerformer = rankings[0];
    const underPerformer = rankings[rankings.length - 1];

    recommendations.push(`Focus more resources on ${topPerformer.domainId} (highest ROI)`);
    recommendations.push(`Review strategy for ${underPerformer.domainId} (lowest efficiency)`);

    // General Pareto recommendations
    recommendations.push('Maintain 80/20 focus: 80% effort on top 20% domains');
    recommendations.push('Regularly review and adjust effort allocation based on performance');

    return recommendations;
  }

  /**
   * Identify risks based on current analysis
   */
  private identifyRisks(
    rankings: any[],
    kpiTrends: Map<string, { change: number; trend: 'improving' | 'declining' | 'stable' }>
  ): string[] {
    const risks: string[] = [];

    // Check for declining KPIs
    const decliningKPIs = Array.from(kpiTrends.entries())
      .filter(([, trend]) => trend.trend === 'declining')
      .map(([kpi]) => kpi);

    if (decliningKPIs.length > 0) {
      risks.push(`Declining KPIs: ${decliningKPIs.join(', ')}`);
    }

    // Check for high-risk domains
    const highRiskDomains = rankings.filter(r => r.revenueImpact < 10000);
    if (highRiskDomains.length > 3) {
      risks.push('Multiple domains showing low revenue impact - diversification risk');
    }

    // Market and external risks
    risks.push('Market competition may impact affiliate revenue streams');
    risks.push('Regulatory changes could affect emerging domains');

    return risks;
  }

  /**
   * Export analytics data for external analysis
   */
  exportAnalyticsData(): {
    timestamp: string;
    metrics: any;
    rankings: any[];
    allocations: EffortAllocation[];
    forecasts: RevenueForecast[];
    kpiHistory: Map<string, Array<{ timestamp: Date; value: number }>>;
  } {
    return {
      timestamp: new Date().toISOString(),
      metrics: this.calculateRealtimeMetrics(),
      rankings: this.optimizationEngine.calculateParetoRanking(),
      allocations: this.optimizationEngine.calculateEffortAllocation(),
      forecasts: this.optimizationEngine.generateRevenueForecasts(),
      kpiHistory: this.kpiHistory
    };
  }
}

/**
 * Analytics utilities for Pareto optimization
 */
export const AnalyticsUtils = {
  /**
   * Calculate statistical measures
   */
  calculateStats(values: number[]): {
    mean: number;
    median: number;
    stdDev: number;
    min: number;
    max: number;
    quartiles: [number, number, number];
  } {
    const sorted = [...values].sort((a, b) => a - b);
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const median = sorted[Math.floor(sorted.length / 2)];

    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
    const stdDev = Math.sqrt(variance);

    const quartiles: [number, number, number] = [
      sorted[Math.floor(sorted.length * 0.25)],
      sorted[Math.floor(sorted.length * 0.5)],
      sorted[Math.floor(sorted.length * 0.75)]
    ];

    return {
      mean,
      median,
      stdDev,
      min: sorted[0],
      max: sorted[sorted.length - 1],
      quartiles
    };
  },

  /**
   * Detect anomalies in KPI data
   */
  detectAnomalies(values: number[], threshold: number = 2): number[] {
    const stats = this.calculateStats(values);
    const anomalies: number[] = [];

    values.forEach((value, index) => {
      const zScore = Math.abs((value - stats.mean) / stats.stdDev);
      if (zScore > threshold) {
        anomalies.push(index);
      }
    });

    return anomalies;
  },

  /**
   * Calculate trend strength
   */
  calculateTrendStrength(values: number[]): number {
    if (values.length < 3) return 0;

    let upward = 0;
    let downward = 0;

    for (let i = 1; i < values.length; i++) {
      if (values[i] > values[i - 1]) upward++;
      else if (values[i] < values[i - 1]) downward++;
    }

    const trendStrength = Math.abs(upward - downward) / (values.length - 1);
    return upward > downward ? trendStrength : -trendStrength;
  }
};
