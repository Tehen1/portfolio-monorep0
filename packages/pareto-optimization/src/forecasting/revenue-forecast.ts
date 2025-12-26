import { ParetoDomain, RevenueForecast } from '../types/domain.js';

/**
 * Revenue Forecasting Engine
 * Implements sophisticated forecasting models based on Pareto analysis
 */
export class RevenueForecastEngine {
  private domains: ParetoDomain[];
  private historicalData?: Map<string, Array<{ month: string; revenue: number; traffic: number }>>;

  constructor(domains: ParetoDomain[], historicalData?: Map<string, Array<{ month: string; revenue: number; traffic: number }>>) {
    this.domains = domains;
    this.historicalData = historicalData;
  }

  /**
   * Generate comprehensive revenue forecasts using multiple models
   */
  generateComprehensiveForecast(domainId: string): {
    conservative: RevenueForecast;
    aggressive: RevenueForecast;
    expected: RevenueForecast;
    models: {
      linear: number;
      exponential: number;
      paretoWeighted: number;
      seasonal: number;
    };
  } {
    const domain = this.domains.find(d => d.id === domainId);
    if (!domain) throw new Error(`Domain ${domainId} not found`);

    const baseRevenue = domain.y1Revenue;
    const historical = this.historicalData?.get(domainId) || [];

    // Multiple forecasting models
    const linearGrowth = this.calculateLinearGrowth(domain, historical);
    const exponentialGrowth = this.calculateExponentialGrowth(domain, historical);
    const paretoWeighted = this.calculateParetoWeightedGrowth(domain, historical);
    const seasonalAdjustment = this.calculateSeasonalAdjustment(domain, historical);

    // Weighted ensemble forecast
    const weights = this.calculateModelWeights(domain);
    const expectedRevenue = Math.round(
      linearGrowth * weights.linear +
      exponentialGrowth * weights.exponential +
      paretoWeighted * weights.paretoWeighted +
      seasonalAdjustment * weights.seasonal
    );

    return {
      conservative: this.generateConservativeForecast(domain, expectedRevenue),
      aggressive: this.generateAggressiveForecast(domain, expectedRevenue),
      expected: {
        domainId,
        conservative: Math.round(expectedRevenue * 0.9),
        aggressive: Math.round(expectedRevenue * 1.1),
        growthFactor: expectedRevenue / baseRevenue,
        confidence: this.calculateConfidenceScore(domain, historical),
        keyDrivers: this.extractForecastDrivers(domain),
        risks: this.identifyForecastRisks(domain)
      },
      models: {
        linear: linearGrowth,
        exponential: exponentialGrowth,
        paretoWeighted,
        seasonal: seasonalAdjustment
      }
    };
  }

  /**
   * Calculate linear growth forecast
   */
  private calculateLinearGrowth(domain: ParetoDomain, historical: Array<{ month: string; revenue: number }>): number {
    if (historical.length < 3) {
      // Use domain characteristics for baseline forecast
      const growthRate = this.getDomainGrowthRate(domain);
      return Math.round(domain.y1Revenue * (1 + growthRate));
    }

    // Calculate linear trend from historical data
    const revenues = historical.map(h => h.revenue);
    const months = historical.length;
    const avgGrowth = this.calculateAverageGrowthRate(revenues);

    return Math.round(revenues[revenues.length - 1] * (1 + avgGrowth));
  }

  /**
   * Calculate exponential growth forecast
   */
  private calculateExponentialGrowth(domain: ParetoDomain, historical: Array<{ month: string; revenue: number }>): number {
    if (historical.length < 3) {
      const growthRate = this.getDomainGrowthRate(domain) * 1.5; // More aggressive for exponential
      return Math.round(domain.y1Revenue * Math.pow(1 + growthRate, 1.2));
    }

    const revenues = historical.map(h => h.revenue);
    const exponentialGrowth = this.calculateExponentialGrowthRate(revenues);

    return Math.round(revenues[revenues.length - 1] * Math.pow(1 + exponentialGrowth, 1.2));
  }

  /**
   * Calculate Pareto-weighted growth (80/20 principle applied to forecasting)
   */
  private calculateParetoWeightedGrowth(domain: ParetoDomain, historical: Array<{ month: string; revenue: number }>): number {
    const baseGrowth = domain.priority === 'CRITICAL' ? 1.4 :
                      domain.priority === 'HIGH' ? 1.35 :
                      domain.priority === 'SUPPORTING' ? 1.25 : 1.15;

    // Apply Pareto efficiency factor (20% effort = 80% results)
    const paretoEfficiency = 0.8 / 0.2; // 4x efficiency factor
    const efficiencyAdjusted = baseGrowth * (paretoEfficiency * 0.1); // 40% efficiency boost

    return Math.round(domain.y1Revenue * (1 + efficiencyAdjusted));
  }

  /**
   * Calculate seasonal adjustment
   */
  private calculateSeasonalAdjustment(domain: ParetoDomain, historical: Array<{ month: string; revenue: number }>): number {
    if (historical.length < 12) {
      // Default seasonal patterns by domain type
      const seasonalMultiplier = this.getSeasonalMultiplier(domain);
      return Math.round(domain.y1Revenue * seasonalMultiplier);
    }

    // Calculate actual seasonal patterns from historical data
    const seasonalFactors = this.calculateSeasonalFactors(historical);
    const currentMonth = new Date().getMonth();
    const seasonalFactor = seasonalFactors[currentMonth] || 1.0;

    return Math.round(domain.y1Revenue * seasonalFactor);
  }

  /**
   * Calculate model weights based on domain characteristics
   */
  private calculateModelWeights(domain: ParetoDomain): {
    linear: number;
    exponential: number;
    paretoWeighted: number;
    seasonal: number;
  } {
    // Weights based on domain maturity and type
    switch (domain.priority) {
      case 'CRITICAL':
        return { linear: 0.3, exponential: 0.3, paretoWeighted: 0.3, seasonal: 0.1 };
      case 'HIGH':
        return { linear: 0.35, exponential: 0.25, paretoWeighted: 0.3, seasonal: 0.1 };
      case 'SUPPORTING':
        return { linear: 0.4, exponential: 0.2, paretoWeighted: 0.25, seasonal: 0.15 };
      case 'EMERGING':
        return { linear: 0.3, exponential: 0.4, paretoWeighted: 0.2, seasonal: 0.1 };
      default:
        return { linear: 0.25, exponential: 0.25, paretoWeighted: 0.25, seasonal: 0.25 };
    }
  }

  /**
   * Generate conservative forecast
   */
  private generateConservativeForecast(domain: ParetoDomain, expectedRevenue: number): RevenueForecast {
    const conservativeRevenue = Math.round(expectedRevenue * 0.85);

    return {
      domainId: domain.id,
      conservative: conservativeRevenue,
      aggressive: Math.round(conservativeRevenue * 1.3),
      growthFactor: conservativeRevenue / domain.y1Revenue,
      confidence: 0.75,
      keyDrivers: this.extractConservativeDrivers(domain),
      risks: this.identifyForecastRisks(domain)
    };
  }

  /**
   * Generate aggressive forecast
   */
  private generateAggressiveForecast(domain: ParetoDomain, expectedRevenue: number): RevenueForecast {
    const aggressiveRevenue = Math.round(expectedRevenue * 1.25);

    return {
      domainId: domain.id,
      conservative: Math.round(aggressiveRevenue * 0.8),
      aggressive: aggressiveRevenue,
      growthFactor: aggressiveRevenue / domain.y1Revenue,
      confidence: 0.6,
      keyDrivers: this.extractAggressiveDrivers(domain),
      risks: this.identifyAggressiveRisks(domain)
    };
  }

  /**
   * Calculate confidence score based on data availability and domain stability
   */
  private calculateConfidenceScore(domain: ParetoDomain, historical: Array<{ month: string; revenue: number }>): number {
    let confidence = 0.5; // Base confidence

    // Historical data increases confidence
    if (historical.length >= 12) confidence += 0.2;
    else if (historical.length >= 6) confidence += 0.1;
    else if (historical.length >= 3) confidence += 0.05;

    // Domain priority affects confidence
    switch (domain.priority) {
      case 'CRITICAL': confidence += 0.2; break;
      case 'HIGH': confidence += 0.15; break;
      case 'SUPPORTING': confidence += 0.1; break;
      case 'EMERGING': confidence += 0.05; break;
    }

    // Revenue stability
    if (domain.roi > 200) confidence += 0.1;
    else if (domain.roi > 100) confidence += 0.05;

    return Math.min(confidence, 0.95); // Cap at 95%
  }

  /**
   * Helper methods for calculations
   */
  private calculateAverageGrowthRate(revenues: number[]): number {
    if (revenues.length < 2) return 0.1; // Default 10% growth

    let totalGrowth = 0;
    for (let i = 1; i < revenues.length; i++) {
      const growth = (revenues[i] - revenues[i - 1]) / revenues[i - 1];
      totalGrowth += growth;
    }

    return totalGrowth / (revenues.length - 1);
  }

  private calculateExponentialGrowthRate(revenues: number[]): number {
    if (revenues.length < 3) return 0.15; // Default 15% exponential growth

    // Use compound annual growth rate calculation
    const periods = revenues.length - 1;
    const startValue = revenues[0];
    const endValue = revenues[revenues.length - 1];

    return Math.pow(endValue / startValue, 1 / periods) - 1;
  }

  private calculateSeasonalFactors(historical: Array<{ month: string; revenue: number }>): number[] {
    const monthlyTotals: number[] = new Array(12).fill(0);
    const monthlyCounts: number[] = new Array(12).fill(0);

    historical.forEach(record => {
      const month = new Date(record.month + '-01').getMonth();
      monthlyTotals[month] += record.revenue;
      monthlyCounts[month]++;
    });

    const overallAverage = monthlyTotals.reduce((sum, total) => sum + total, 0) /
                          monthlyCounts.reduce((sum, count) => sum + count, 0);

    return monthlyTotals.map((total, index) =>
      monthlyCounts[index] > 0 ? total / monthlyCounts[index] / overallAverage : 1.0
    );
  }

  private getDomainGrowthRate(domain: ParetoDomain): number {
    switch (domain.priority) {
      case 'CRITICAL': return 0.25; // 25% growth
      case 'HIGH': return 0.20; // 20% growth
      case 'SUPPORTING': return 0.15; // 15% growth
      case 'EMERGING': return 0.10; // 10% growth
      default: return 0.15;
    }
  }

  private getSeasonalMultiplier(domain: ParetoDomain): number {
    // Seasonal patterns based on domain type
    switch (domain.id) {
      case 'adaptogenic-mushrooms':
      case 'brainhealth-mushrooms':
      case 'healthful-mushrooms':
        return 1.1; // Health products peak in winter
      case 'fixie-run':
        return 1.15; // Fitness peaks in spring/summer
      case 'puffs-store':
        return 0.95; // Compliance-heavy, more stable
      default:
        return 1.05; // Slight seasonal variation
    }
  }

  private extractForecastDrivers(domain: ParetoDomain): string[] {
    return [
      'Historical performance trends',
      'Market growth in domain category',
      'Competitive landscape analysis',
      'Seasonal demand patterns',
      'Pareto optimization efficiency gains'
    ];
  }

  private extractConservativeDrivers(domain: ParetoDomain): string[] {
    return [
      'Stable market conditions',
      'Conservative competitor analysis',
      'Historical baseline performance',
      'Risk-adjusted growth assumptions'
    ];
  }

  private extractAggressiveDrivers(domain: ParetoDomain): string[] {
    return [
      'Rapid market expansion',
      'First-mover advantage capture',
      'Successful optimization implementation',
      'Favorable competitive dynamics'
    ];
  }

  private identifyForecastRisks(domain: ParetoDomain): string[] {
    const risks = [
      'Market competition intensification',
      'Economic downturn impact',
      'Regulatory changes'
    ];

    // Domain-specific risks
    switch (domain.id) {
      case 'fixie-run':
        risks.push('Crypto market volatility');
        break;
      case 'puffs-store':
        risks.push('Regulatory compliance issues');
        break;
      case 'tech-review-blog':
        risks.push('Algorithm changes', 'Affiliate policy changes');
        break;
    }

    return risks;
  }

  private identifyAggressiveRisks(domain: ParetoDomain): string[] {
    return [
      'Overly optimistic assumptions',
      'Implementation execution risks',
      'Market timing misalignment',
      'Resource allocation constraints'
    ];
  }

  /**
   * Update historical data for improved forecasting
   */
  updateHistoricalData(domainId: string, data: Array<{ month: string; revenue: number; traffic: number }>): void {
    if (!this.historicalData) {
      this.historicalData = new Map();
    }
    this.historicalData.set(domainId, data);
  }
}

/**
 * Forecasting utilities and helper functions
 */
export const ForecastingUtils = {
  /**
   * Calculate compound annual growth rate
   */
  calculateCAGR(startValue: number, endValue: number, periods: number): number {
    return Math.pow(endValue / startValue, 1 / periods) - 1;
  },

  /**
   * Calculate forecast accuracy metrics
   */
  calculateForecastAccuracy(actual: number[], predicted: number[]): {
    mape: number; // Mean Absolute Percentage Error
    rmse: number; // Root Mean Square Error
    accuracy: number; // Overall accuracy percentage
  } {
    if (actual.length !== predicted.length) {
      throw new Error('Actual and predicted arrays must have the same length');
    }

    let sumAPE = 0; // Sum of Absolute Percentage Errors
    let sumSquaredErrors = 0;

    for (let i = 0; i < actual.length; i++) {
      const error = predicted[i] - actual[i];
      const ape = Math.abs(error) / actual[i];
      sumAPE += ape;
      sumSquaredErrors += error * error;
    }

    const mape = (sumAPE / actual.length) * 100;
    const rmse = Math.sqrt(sumSquaredErrors / actual.length);
    const accuracy = 100 - mape;

    return { mape, rmse, accuracy: Math.max(0, accuracy) };
  },

  /**
   * Generate forecast scenarios
   */
  generateScenarios(baseForecast: number, volatility: number = 0.2): {
    pessimistic: number;
    base: number;
    optimistic: number;
    volatilityRange: number;
  } {
    const volatilityRange = baseForecast * volatility;

    return {
      pessimistic: Math.round(baseForecast - volatilityRange),
      base: Math.round(baseForecast),
      optimistic: Math.round(baseForecast + volatilityRange),
      volatilityRange: Math.round(volatilityRange)
    };
  }
};
