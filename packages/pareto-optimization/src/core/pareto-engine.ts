import {
  ParetoDomain,
  PARETO_DOMAINS,
  ParetoOptimizationResult,
  EffortAllocation,
  RevenueForecast,
  DomainPriority
} from '../types/domain.js';

/**
 * Core Pareto Optimization Engine
 * Implements 80/20 rule analysis for domain portfolio optimization
 */
export class ParetoOptimizationEngine {
  private domains: ParetoDomain[];

  constructor(domains: ParetoDomain[] = PARETO_DOMAINS) {
    this.domains = domains;
  }

  /**
   * Calculate Pareto ranking based on revenue and effort
   */
  calculateParetoRanking(): ParetoOptimizationResult[] {
    const totalRevenue = this.domains.reduce((sum, domain) => sum + domain.y1Revenue, 0);
    const totalEffort = this.domains.reduce((sum, domain) => sum + domain.weeklyHours, 0);

    return this.domains.map(domain => {
      const revenuePercentage = (domain.y1Revenue / totalRevenue) * 100;
      const effortPercentage = (domain.weeklyHours / totalEffort) * 100;
      const efficiency = revenuePercentage / effortPercentage;

      // Determine optimal priority based on 80/20 analysis
      let recommendedPriority: DomainPriority;

      if (revenuePercentage >= 15 && efficiency >= 2.0) {
        recommendedPriority = 'CRITICAL';
      } else if (revenuePercentage >= 8 && efficiency >= 1.5) {
        recommendedPriority = 'HIGH';
      } else if (revenuePercentage >= 4 && efficiency >= 1.0) {
        recommendedPriority = 'SUPPORTING';
      } else {
        recommendedPriority = 'EMERGING';
      }

      // Calculate optimization metrics
      const revenueImpact = domain.y1Revenue * 0.2; // 20% improvement potential
      const effortReduction = domain.weeklyHours * 0.3; // 30% efficiency gain
      const roiImprovement = domain.roi * 0.25; // 25% ROI increase

      return {
        domainId: domain.id,
        currentPriority: domain.priority,
        recommendedPriority,
        revenueImpact,
        effortReduction,
        roiImprovement,
        optimizationActions: this.generateOptimizationActions(domain),
        timeframe: this.determineTimeframe(domain.priority, recommendedPriority)
      };
    }).sort((a, b) => b.revenueImpact - a.revenueImpact);
  }

  /**
   * Generate effort allocation matrix based on Pareto principles
   */
  calculateEffortAllocation(): EffortAllocation[] {
    const totalWeeklyHours = this.domains.reduce((sum, domain) => sum + domain.weeklyHours, 0);

    return this.domains.map(domain => {
      const roiPerHour = domain.y1Revenue / (domain.weeklyHours * 52); // Annual revenue per weekly hour
      const totalWeeklyEffort = (domain.weeklyHours / totalWeeklyHours) * 100;

      return {
        domainId: domain.id,
        weeklyHours: domain.weeklyHours,
        focus: domain.focus,
        roiPerHour,
        totalWeeklyEffort
      };
    }).sort((a, b) => b.roiPerHour - a.roiPerHour);
  }

  /**
   * Generate revenue forecasts using Pareto growth factors
   */
  generateRevenueForecasts(): RevenueForecast[] {
    const growthFactors = {
      CRITICAL: { conservative: 1.2, aggressive: 1.4, confidence: 0.85 },
      HIGH: { conservative: 1.15, aggressive: 1.35, confidence: 0.75 },
      SUPPORTING: { conservative: 1.1, aggressive: 1.25, confidence: 0.65 },
      EMERGING: { conservative: 1.05, aggressive: 1.15, confidence: 0.55 }
    };

    return this.domains.map(domain => {
      const factors = growthFactors[domain.priority as keyof typeof growthFactors];
      const conservative = Math.round(domain.y1Revenue * factors.conservative);
      const aggressive = Math.round(domain.y1Revenue * factors.aggressive);

      return {
        domainId: domain.id,
        conservative,
        aggressive,
        growthFactor: factors.aggressive,
        confidence: factors.confidence,
        keyDrivers: this.extractKeyDrivers(domain),
        risks: this.identifyRisks(domain)
      };
    });
  }

  /**
   * Calculate portfolio-wide Pareto metrics
   */
  calculatePortfolioMetrics() {
    const rankings = this.calculateParetoRanking();
    const allocations = this.calculateEffortAllocation();
    const forecasts = this.generateRevenueForecasts();

    const totalRevenue = this.domains.reduce((sum, domain) => sum + domain.y1Revenue, 0);
    const top5Domains = rankings.slice(0, 5);
    const top5Revenue = top5Domains.reduce((sum, result) => {
      const domain = this.domains.find(d => d.id === result.domainId);
      return sum + (domain?.y1Revenue || 0);
    }, 0);

    const totalEffort = allocations.reduce((sum, alloc) => sum + alloc.weeklyHours, 0);
    const top5Effort = top5Domains.reduce((sum, result) => {
      const alloc = allocations.find(a => a.domainId === result.domainId);
      return sum + (alloc?.weeklyHours || 0);
    }, 0);

    return {
      revenueConcentration: {
        top5Percentage: (top5Revenue / totalRevenue) * 100,
        paretoRatio: top5Revenue / totalRevenue >= 0.8
      },
      effortEfficiency: {
        top5EffortPercentage: (top5Effort / totalEffort) * 100,
        averageRoiPerHour: allocations.reduce((sum, alloc) => sum + alloc.roiPerHour, 0) / allocations.length
      },
      optimizationPotential: {
        totalRevenueImpact: rankings.reduce((sum, result) => sum + result.revenueImpact, 0),
        totalEffortReduction: rankings.reduce((sum, result) => sum + result.effortReduction, 0),
        averageRoiImprovement: rankings.reduce((sum, result) => sum + result.roiImprovement, 0) / rankings.length
      },
      forecastSummary: {
        conservativeTotal: forecasts.reduce((sum, f) => sum + f.conservative, 0),
        aggressiveTotal: forecasts.reduce((sum, f) => sum + f.aggressive, 0),
        averageConfidence: forecasts.reduce((sum, f) => sum + f.confidence, 0) / forecasts.length
      }
    };
  }

  /**
   * Generate domain-specific optimization actions
   */
  private generateOptimizationActions(domain: ParetoDomain): string[] {
    const actions: string[] = [];

    switch (domain.id) {
      case 'tech-review-blog':
        actions.push(
          'Publish 5 high-commission affiliate articles/week',
          'Focus on ChatGPT, Midjourney, NordVPN comparisons',
          'Implement automated content generation pipeline',
          'Launch email campaigns for top-performing content'
        );
        break;

      case 'antonylambi':
        actions.push(
          'Secure 2-3 high-value consulting clients ($5k/month)',
          'Create case studies showcasing consulting wins',
          'Launch LinkedIn authority content (3-5 posts/week)',
          'Develop speaking engagement pipeline'
        );
        break;

      case 'adaptogenic-mushrooms':
        actions.push(
          'Optimize top 3 product pages (Reishi, Lion\'s Mane, Cordyceps)',
          'Increase Google Ads budget for high-margin products',
          'Implement affiliate traffic driving strategies',
          'Stock 6-12 months inventory for core products'
        );
        break;

      case 'fixie-run':
        actions.push(
          'Launch VIP tier with premium NFT pricing ($400-800)',
          'Implement hardcore cyclist retention mechanics',
          'Develop NFT marketplace with exclusive bikes',
          'Create community ambassador program'
        );
        break;

      case 'seobiz':
        actions.push(
          'Execute account-based marketing for 100 high-value prospects',
          'Create enterprise sales pitch deck and demos',
          'Focus on keyword clustering automation feature',
          'Secure first 2 enterprise customers'
        );
        break;

      default:
        actions.push(
          'Analyze top 20% revenue drivers',
          'Optimize effort allocation based on ROI',
          'Implement Pareto-focused content strategy',
          'Monitor and adjust based on performance metrics'
        );
    }

    return actions;
  }

  /**
   * Determine optimization timeframe
   */
  private determineTimeframe(current: DomainPriority, recommended: DomainPriority): string {
    const priorityOrder = { CRITICAL: 4, HIGH: 3, SUPPORTING: 2, EMERGING: 1 };
    const currentScore = priorityOrder[current];
    const recommendedScore = priorityOrder[recommended];

    if (recommendedScore > currentScore) {
      return 'Q1'; // Immediate action needed
    } else if (recommendedScore === currentScore) {
      return 'Q2'; // Maintain current priority
    } else {
      return 'Q3-Q4'; // De-prioritize gradually
    }
  }

  /**
   * Extract key growth drivers for forecasting
   */
  private extractKeyDrivers(domain: ParetoDomain): string[] {
    const drivers: string[] = [];

    switch (domain.id) {
      case 'tech-review-blog':
        drivers.push('High-commission affiliate content', 'SEO traffic growth', 'Email list monetization');
        break;
      case 'antonylambi':
        drivers.push('Consulting client acquisition', 'Speaking engagement bookings', 'Personal brand authority');
        break;
      case 'fixie-run':
        drivers.push('NFT marketplace adoption', 'Staking fee revenue', 'Premium user conversion');
        break;
      default:
        drivers.push('Revenue optimization', 'User acquisition', 'Product-market fit');
    }

    return drivers;
  }

  /**
   * Identify key risks for each domain
   */
  private identifyRisks(domain: ParetoDomain): string[] {
    const risks: string[] = [];

    switch (domain.id) {
      case 'tech-review-blog':
        risks.push('Affiliate program policy changes', 'Competition from similar blogs', 'Algorithm changes affecting traffic');
        break;
      case 'fixie-run':
        risks.push('Crypto market volatility', 'Regulatory changes in NFT space', 'Competition from Web3 fitness apps');
        break;
      case 'puffs-store':
        risks.push('Regulatory compliance issues', 'State legalization delays', 'Supply chain disruptions');
        break;
      default:
        risks.push('Market competition', 'Economic downturn impact', 'Technical implementation challenges');
    }

    return risks;
  }

  /**
   * Get domain by ID
   */
  getDomain(domainId: string): ParetoDomain | undefined {
    return this.domains.find(domain => domain.id === domainId);
  }

  /**
   * Get all domains
   */
  getAllDomains(): ParetoDomain[] {
    return [...this.domains];
  }

  /**
   * Update domain data (for real-time optimization)
   */
  updateDomain(domainId: string, updates: Partial<ParetoDomain>): void {
    const index = this.domains.findIndex(domain => domain.id === domainId);
    if (index !== -1) {
      this.domains[index] = { ...this.domains[index], ...updates };
    }
  }
}

/**
 * Utility functions for Pareto analysis
 */
export const ParetoUtils = {
  /**
   * Calculate Pareto ratio (80/20 compliance)
   */
  calculateParetoRatio(items: Array<{ value: number }>, targetRatio: number = 0.8): boolean {
    const sortedItems = [...items].sort((a, b) => b.value - a.value);
    const totalValue = sortedItems.reduce((sum, item) => sum + item.value, 0);
    const top20Percent = sortedItems.slice(0, Math.ceil(items.length * 0.2));
    const top20Value = top20Percent.reduce((sum, item) => sum + item.value, 0);

    return (top20Value / totalValue) >= targetRatio;
  },

  /**
   * Calculate effort efficiency score
   */
  calculateEfficiencyScore(revenue: number, effort: number): number {
    return revenue / effort;
  },

  /**
   * Calculate ROI improvement potential
   */
  calculateROIImprovement(currentROI: number, targetEfficiency: number): number {
    return currentROI * targetEfficiency;
  }
};
