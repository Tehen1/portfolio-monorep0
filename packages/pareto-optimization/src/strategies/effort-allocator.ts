import { ParetoDomain, EffortAllocation, DomainPriority } from '../types/domain.js';

/**
 * Effort Allocation Strategy Engine
 * Implements intelligent resource allocation based on Pareto optimization
 */
export class EffortAllocator {
  private domains: ParetoDomain[];
  private totalWeeklyHours: number;

  constructor(domains: ParetoDomain[], totalWeeklyHours: number = 40) {
    this.domains = domains;
    this.totalWeeklyHours = totalWeeklyHours;
  }

  /**
   * Calculate optimal effort allocation using Pareto principles
   */
  calculateOptimalAllocation(): EffortAllocation[] {
    // Step 1: Calculate base allocation based on priority tiers
    const priorityWeights = this.calculatePriorityWeights();

    // Step 2: Apply Pareto efficiency factors
    const paretoAdjusted = this.applyParetoEfficiency(priorityWeights);

    // Step 3: Ensure minimum viable effort for supporting domains
    const minimumViable = this.ensureMinimumViableEffort(paretoAdjusted);

    // Step 4: Normalize to total available hours
    return this.normalizeToTotalHours(minimumViable);
  }

  /**
   * Calculate priority-based weights
   */
  private calculatePriorityWeights(): Map<string, number> {
    const weights = new Map<string, number>();

    // Priority multipliers based on 80/20 principle
    const priorityMultipliers: Record<DomainPriority, number> = {
      CRITICAL: 4.0,    // 80% of effort potential
      HIGH: 1.0,        // 15% of effort potential
      SUPPORTING: 0.2,  // 4% of effort potential
      EMERGING: 0.05    // 1% of effort potential
    };

    // Calculate raw weights
    let totalWeight = 0;
    this.domains.forEach(domain => {
      const multiplier = priorityMultipliers[domain.priority];
      const roiFactor = domain.roi / 100; // Convert percentage to decimal
      const weight = multiplier * roiFactor;
      weights.set(domain.id, weight);
      totalWeight += weight;
    });

    // Normalize weights
    const normalizedWeights = new Map<string, number>();
    weights.forEach((weight, domainId) => {
      normalizedWeights.set(domainId, weight / totalWeight);
    });

    return normalizedWeights;
  }

  /**
   * Apply Pareto efficiency adjustments
   */
  private applyParetoEfficiency(weights: Map<string, number>): Map<string, number> {
    const adjustedWeights = new Map<string, number>();

    // Sort domains by weight (descending)
    const sortedDomains = Array.from(weights.entries())
      .sort(([, a], [, b]) => b - a);

    // Apply diminishing returns for lower-priority domains
    sortedDomains.forEach(([domainId, weight], index) => {
      let adjustedWeight = weight;

      // Apply Pareto efficiency factor (80/20 rule)
      if (index >= 5) { // Beyond top 5 domains
        adjustedWeight *= 0.2; // Reduce by 80%
      } else if (index >= 2) { // Top 3-5 domains
        adjustedWeight *= 0.5; // Reduce by 50%
      }
      // Top 2 domains keep full weight

      adjustedWeights.set(domainId, adjustedWeight);
    });

    return adjustedWeights;
  }

  /**
   * Ensure minimum viable effort for all domains
   */
  private ensureMinimumViableEffort(weights: Map<string, number>): Map<string, number> {
    const adjustedWeights = new Map(weights);
    const minimumEffortPercent = 0.02; // 2% minimum effort

    // Ensure no domain gets less than minimum viable effort
    adjustedWeights.forEach((weight, domainId) => {
      if (weight < minimumEffortPercent) {
        adjustedWeights.set(domainId, minimumEffortPercent);
      }
    });

    // Re-normalize after minimum adjustments
    const totalWeight = Array.from(adjustedWeights.values()).reduce((sum, w) => sum + w, 0);
    const renormalizedWeights = new Map<string, number>();

    adjustedWeights.forEach((weight, domainId) => {
      renormalizedWeights.set(domainId, weight / totalWeight);
    });

    return renormalizedWeights;
  }

  /**
   * Normalize weights to total available hours
   */
  private normalizeToTotalHours(weights: Map<string, number>): EffortAllocation[] {
    const allocations: EffortAllocation[] = [];

    weights.forEach((weight, domainId) => {
      const domain = this.domains.find(d => d.id === domainId);
      if (domain) {
        const weeklyHours = Math.round(weight * this.totalWeeklyHours * 100) / 100; // Round to 2 decimal places
        const roiPerHour = domain.y1Revenue / (weeklyHours * 52); // Annual revenue per weekly hour

        allocations.push({
          domainId,
          weeklyHours,
          focus: domain.focus,
          roiPerHour,
          totalWeeklyEffort: weight * 100
        });
      }
    });

    // Sort by ROI per hour (highest first)
    return allocations.sort((a, b) => b.roiPerHour - a.roiPerHour);
  }

  /**
   * Generate effort reallocation recommendations
   */
  generateReallocationRecommendations(currentAllocations: EffortAllocation[]): {
    recommendations: Array<{
      domainId: string;
      action: 'increase' | 'decrease' | 'maintain';
      hoursChange: number;
      reason: string;
      impact: number;
    }>;
    summary: {
      totalHoursToReallocate: number;
      expectedRevenueImpact: number;
      efficiencyGain: number;
    };
  } {
    const optimalAllocations = this.calculateOptimalAllocation();
    const recommendations: Array<{
      domainId: string;
      action: 'increase' | 'decrease' | 'maintain';
      hoursChange: number;
      reason: string;
      impact: number;
    }> = [];

    let totalHoursChange = 0;
    let totalRevenueImpact = 0;

    optimalAllocations.forEach(optimal => {
      const current = currentAllocations.find(c => c.domainId === optimal.domainId);
      if (current) {
        const hoursDifference = optimal.weeklyHours - current.weeklyHours;
        const revenueImpact = hoursDifference * optimal.roiPerHour * 52; // Annual impact

        let action: 'increase' | 'decrease' | 'maintain' = 'maintain';
        let reason = '';

        if (Math.abs(hoursDifference) < 0.5) {
          action = 'maintain';
          reason = 'Current allocation is optimal';
        } else if (hoursDifference > 0) {
          action = 'increase';
          reason = `High ROI potential (€${revenueImpact.toFixed(0)} annual impact)`;
        } else {
          action = 'decrease';
          reason = `Lower priority - reallocate to higher-ROI domains`;
        }

        recommendations.push({
          domainId: optimal.domainId,
          action,
          hoursChange: hoursDifference,
          reason,
          impact: revenueImpact
        });

        totalHoursChange += hoursDifference;
        totalRevenueImpact += revenueImpact;
      }
    });

    const efficiencyGain = recommendations.reduce((sum, rec) => {
      return rec.action === 'increase' ? sum + Math.abs(rec.impact) : sum;
    }, 0);

    return {
      recommendations,
      summary: {
        totalHoursToReallocate: totalHoursChange,
        expectedRevenueImpact: totalRevenueImpact,
        efficiencyGain
      }
    };
  }

  /**
   * Calculate effort allocation efficiency score
   */
  calculateEfficiencyScore(): {
    score: number;
    breakdown: {
      paretoCompliance: number;
      roiOptimization: number;
      resourceUtilization: number;
    };
    recommendations: string[];
  } {
    const allocations = this.calculateOptimalAllocation();
    const totalRevenue = this.domains.reduce((sum, domain) => sum + domain.y1Revenue, 0);

    // Pareto compliance score (how well we follow 80/20)
    const top5Revenue = allocations
      .slice(0, 5)
      .reduce((sum, alloc) => {
        const domain = this.domains.find(d => d.id === alloc.domainId);
        return sum + (domain?.y1Revenue || 0);
      }, 0);

    const paretoCompliance = (top5Revenue / totalRevenue) >= 0.8 ? 100 : 75;

    // ROI optimization score
    const avgRoiPerHour = allocations.reduce((sum, alloc) => sum + alloc.roiPerHour, 0) / allocations.length;
    const roiOptimization = Math.min(avgRoiPerHour / 100, 100); // Cap at 100

    // Resource utilization score
    const totalAllocatedHours = allocations.reduce((sum, alloc) => sum + alloc.weeklyHours, 0);
    const resourceUtilization = (totalAllocatedHours / this.totalWeeklyHours) * 100;

    const score = (paretoCompliance + roiOptimization + resourceUtilization) / 3;

    const recommendations: string[] = [];
    if (paretoCompliance < 80) {
      recommendations.push('Reallocate effort to top-performing domains to achieve 80/20 ratio');
    }
    if (roiOptimization < 50) {
      recommendations.push('Focus effort on domains with highest ROI potential');
    }
    if (resourceUtilization < 90) {
      recommendations.push('Increase resource utilization or reduce scope');

    }

    return {
      score,
      breakdown: {
        paretoCompliance,
        roiOptimization,
        resourceUtilization
      },
      recommendations
    };
  }

  /**
   * Update total available hours
   */
  updateTotalHours(newTotal: number): void {
    this.totalWeeklyHours = newTotal;
  }

  /**
   * Update domain data for dynamic allocation
   */
  updateDomainData(domainId: string, updates: Partial<ParetoDomain>): void {
    const index = this.domains.findIndex(d => d.id === domainId);
    if (index !== -1) {
      this.domains[index] = { ...this.domains[index], ...updates };
    }
  }
}

/**
 * Effort Allocation Utilities
 */
export const AllocationUtils = {
  /**
   * Calculate break-even effort for a domain
   */
  calculateBreakEvenEffort(domain: ParetoDomain, fixedCosts: number = 0): number {
    const annualRevenue = domain.y1Revenue;
    const weeklyBreakEven = (fixedCosts + (annualRevenue * 0.1)) / 52; // 10% profit margin

    return Math.max(weeklyBreakEven, 1); // Minimum 1 hour/week
  },

  /**
   * Calculate effort elasticity (revenue change per effort hour)
   */
  calculateEffortElasticity(domain: ParetoDomain): number {
    const baseRevenue = domain.y1Revenue;
    const baseEffort = domain.weeklyHours;

    // Assume 10% effort increase leads to proportional revenue increase
    const elasticity = (baseRevenue * 0.1) / baseEffort;

    return elasticity;
  },

  /**
   * Generate effort allocation scenarios
   */
  generateScenarios(domains: ParetoDomain[], totalHours: number): {
    conservative: EffortAllocation[];
    balanced: EffortAllocation[];
    aggressive: EffortAllocation[];
  } {
    const allocator = new EffortAllocator(domains, totalHours);

    // Conservative: More even distribution
    const conservativeDomains = domains.map(d => ({
      ...d,
      priority: d.priority === 'CRITICAL' ? 'HIGH' as DomainPriority : d.priority
    }));

    // Aggressive: Extreme Pareto focus
    const aggressiveDomains = domains.map(d => ({
      ...d,
      priority: d.priority === 'HIGH' ? 'CRITICAL' as DomainPriority : d.priority
    }));

    return {
      conservative: new EffortAllocator(conservativeDomains, totalHours).calculateOptimalAllocation(),
      balanced: allocator.calculateOptimalAllocation(),
      aggressive: new EffortAllocator(aggressiveDomains, totalHours).calculateOptimalAllocation()
    };
  }
};
