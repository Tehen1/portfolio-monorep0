import { z } from 'zod';

declare const DomainPrioritySchema: z.ZodEnum<["CRITICAL", "HIGH", "SUPPORTING", "EMERGING"]>;
type DomainPriority = z.infer<typeof DomainPrioritySchema>;
declare const EffortLevelSchema: z.ZodEnum<["LOW", "MEDIUM", "HIGH"]>;
type EffortLevel = z.infer<typeof EffortLevelSchema>;
declare const RevenueTypeSchema: z.ZodEnum<["AFFILIATE", "SUBSCRIPTION", "E_COMMERCE", "CONSULTING", "NFT_SALES", "STAKING_FEES", "SAAS", "CONTENT", "SPONSORSHIP"]>;
type RevenueType = z.infer<typeof RevenueTypeSchema>;
interface ParetoDomain {
    id: string;
    name: string;
    url: string;
    priority: DomainPriority;
    effortLevel: EffortLevel;
    y1Revenue: number;
    roi: number;
    revenueTypes: RevenueType[];
    keyMetrics: {
        monthlyTraffic?: number;
        conversionRate?: number;
        avgOrderValue?: number;
        customerLifetimeValue?: number;
    };
    paretoInsights: {
        revenueConcentration: string;
        effortDistribution: string;
        optimizationStrategy: string;
    };
    weeklyHours: number;
    focus: string;
}
declare const PARETO_DOMAINS: ParetoDomain[];
interface ParetoOptimizationResult {
    domainId: string;
    currentPriority: DomainPriority;
    recommendedPriority: DomainPriority;
    revenueImpact: number;
    effortReduction: number;
    roiImprovement: number;
    optimizationActions: string[];
    timeframe: string;
}
interface EffortAllocation {
    domainId: string;
    weeklyHours: number;
    focus: string;
    roiPerHour: number;
    totalWeeklyEffort: number;
}
interface RevenueForecast {
    domainId: string;
    conservative: number;
    aggressive: number;
    growthFactor: number;
    confidence: number;
    keyDrivers: string[];
    risks: string[];
}

/**
 * Core Pareto Optimization Engine
 * Implements 80/20 rule analysis for domain portfolio optimization
 */
declare class ParetoOptimizationEngine {
    private domains;
    constructor(domains?: ParetoDomain[]);
    /**
     * Calculate Pareto ranking based on revenue and effort
     */
    calculateParetoRanking(): ParetoOptimizationResult[];
    /**
     * Generate effort allocation matrix based on Pareto principles
     */
    calculateEffortAllocation(): EffortAllocation[];
    /**
     * Generate revenue forecasts using Pareto growth factors
     */
    generateRevenueForecasts(): RevenueForecast[];
    /**
     * Calculate portfolio-wide Pareto metrics
     */
    calculatePortfolioMetrics(): {
        revenueConcentration: {
            top5Percentage: number;
            paretoRatio: boolean;
        };
        effortEfficiency: {
            top5EffortPercentage: number;
            averageRoiPerHour: number;
        };
        optimizationPotential: {
            totalRevenueImpact: number;
            totalEffortReduction: number;
            averageRoiImprovement: number;
        };
        forecastSummary: {
            conservativeTotal: number;
            aggressiveTotal: number;
            averageConfidence: number;
        };
    };
    /**
     * Generate domain-specific optimization actions
     */
    private generateOptimizationActions;
    /**
     * Determine optimization timeframe
     */
    private determineTimeframe;
    /**
     * Extract key growth drivers for forecasting
     */
    private extractKeyDrivers;
    /**
     * Identify key risks for each domain
     */
    private identifyRisks;
    /**
     * Get domain by ID
     */
    getDomain(domainId: string): ParetoDomain | undefined;
    /**
     * Get all domains
     */
    getAllDomains(): ParetoDomain[];
    /**
     * Update domain data (for real-time optimization)
     */
    updateDomain(domainId: string, updates: Partial<ParetoDomain>): void;
}
/**
 * Utility functions for Pareto analysis
 */
declare const ParetoUtils: {
    /**
     * Calculate Pareto ratio (80/20 compliance)
     */
    calculateParetoRatio(items: Array<{
        value: number;
    }>, targetRatio?: number): boolean;
    /**
     * Calculate effort efficiency score
     */
    calculateEfficiencyScore(revenue: number, effort: number): number;
    /**
     * Calculate ROI improvement potential
     */
    calculateROIImprovement(currentROI: number, targetEfficiency: number): number;
};

/**
 * Revenue Forecasting Engine
 * Implements sophisticated forecasting models based on Pareto analysis
 */
declare class RevenueForecastEngine {
    private domains;
    private historicalData?;
    constructor(domains: ParetoDomain[], historicalData?: Map<string, Array<{
        month: string;
        revenue: number;
        traffic: number;
    }>>);
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
    };
    /**
     * Calculate linear growth forecast
     */
    private calculateLinearGrowth;
    /**
     * Calculate exponential growth forecast
     */
    private calculateExponentialGrowth;
    /**
     * Calculate Pareto-weighted growth (80/20 principle applied to forecasting)
     */
    private calculateParetoWeightedGrowth;
    /**
     * Calculate seasonal adjustment
     */
    private calculateSeasonalAdjustment;
    /**
     * Calculate model weights based on domain characteristics
     */
    private calculateModelWeights;
    /**
     * Generate conservative forecast
     */
    private generateConservativeForecast;
    /**
     * Generate aggressive forecast
     */
    private generateAggressiveForecast;
    /**
     * Calculate confidence score based on data availability and domain stability
     */
    private calculateConfidenceScore;
    /**
     * Helper methods for calculations
     */
    private calculateAverageGrowthRate;
    private calculateExponentialGrowthRate;
    private calculateSeasonalFactors;
    private getDomainGrowthRate;
    private getSeasonalMultiplier;
    private extractForecastDrivers;
    private extractConservativeDrivers;
    private extractAggressiveDrivers;
    private identifyForecastRisks;
    private identifyAggressiveRisks;
    /**
     * Update historical data for improved forecasting
     */
    updateHistoricalData(domainId: string, data: Array<{
        month: string;
        revenue: number;
        traffic: number;
    }>): void;
}
/**
 * Forecasting utilities and helper functions
 */
declare const ForecastingUtils: {
    /**
     * Calculate compound annual growth rate
     */
    calculateCAGR(startValue: number, endValue: number, periods: number): number;
    /**
     * Calculate forecast accuracy metrics
     */
    calculateForecastAccuracy(actual: number[], predicted: number[]): {
        mape: number;
        rmse: number;
        accuracy: number;
    };
    /**
     * Generate forecast scenarios
     */
    generateScenarios(baseForecast: number, volatility?: number): {
        pessimistic: number;
        base: number;
        optimistic: number;
        volatilityRange: number;
    };
};

/**
 * Pareto Analytics Engine
 * Real-time monitoring and KPI tracking for Pareto optimization performance
 */
declare class ParetoAnalyticsEngine {
    private optimizationEngine;
    private forecastEngine;
    private kpiHistory;
    constructor(optimizationEngine: ParetoOptimizationEngine, forecastEngine: RevenueForecastEngine);
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
    };
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
            gaps: Array<{
                domainId: string;
                gap: number;
                action: string;
            }>;
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
    };
    /**
     * Track KPI performance over time
     */
    trackKPIs(): void;
    /**
     * Generate performance reports
     */
    generatePerformanceReport(timeframe: 'weekly' | 'monthly' | 'quarterly'): {
        period: string;
        kpiTrends: Map<string, {
            change: number;
            trend: 'improving' | 'declining' | 'stable';
        }>;
        topPerformers: string[];
        underperformers: string[];
        recommendations: string[];
        risks: string[];
    };
    /**
     * Calculate portfolio efficiency score
     */
    private calculatePortfolioEfficiency;
    /**
     * Calculate effort optimization score
     */
    private calculateEffortOptimizationScore;
    /**
     * Calculate forecast accuracy score
     */
    private calculateForecastAccuracyScore;
    /**
     * Calculate risk score
     */
    private calculateRiskScore;
    /**
     * Calculate domain performance trend
     */
    private calculateDomainTrend;
    /**
     * Identify effort allocation gaps
     */
    private identifyEffortGaps;
    /**
     * Generate alerts based on performance metrics
     */
    private generateAlerts;
    /**
     * Generate recommendations based on analysis
     */
    private generateRecommendations;
    /**
     * Identify risks based on current analysis
     */
    private identifyRisks;
    /**
     * Export analytics data for external analysis
     */
    exportAnalyticsData(): {
        timestamp: string;
        metrics: any;
        rankings: any[];
        allocations: EffortAllocation[];
        forecasts: RevenueForecast[];
        kpiHistory: Map<string, Array<{
            timestamp: Date;
            value: number;
        }>>;
    };
}
/**
 * Analytics utilities for Pareto optimization
 */
declare const AnalyticsUtils: {
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
    };
    /**
     * Detect anomalies in KPI data
     */
    detectAnomalies(values: number[], threshold?: number): number[];
    /**
     * Calculate trend strength
     */
    calculateTrendStrength(values: number[]): number;
};

/**
 * Effort Allocation Strategy Engine
 * Implements intelligent resource allocation based on Pareto optimization
 */
declare class EffortAllocator {
    private domains;
    private totalWeeklyHours;
    constructor(domains: ParetoDomain[], totalWeeklyHours?: number);
    /**
     * Calculate optimal effort allocation using Pareto principles
     */
    calculateOptimalAllocation(): EffortAllocation[];
    /**
     * Calculate priority-based weights
     */
    private calculatePriorityWeights;
    /**
     * Apply Pareto efficiency adjustments
     */
    private applyParetoEfficiency;
    /**
     * Ensure minimum viable effort for all domains
     */
    private ensureMinimumViableEffort;
    /**
     * Normalize weights to total available hours
     */
    private normalizeToTotalHours;
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
    };
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
    };
    /**
     * Update total available hours
     */
    updateTotalHours(newTotal: number): void;
    /**
     * Update domain data for dynamic allocation
     */
    updateDomainData(domainId: string, updates: Partial<ParetoDomain>): void;
}
/**
 * Effort Allocation Utilities
 */
declare const AllocationUtils: {
    /**
     * Calculate break-even effort for a domain
     */
    calculateBreakEvenEffort(domain: ParetoDomain, fixedCosts?: number): number;
    /**
     * Calculate effort elasticity (revenue change per effort hour)
     */
    calculateEffortElasticity(domain: ParetoDomain): number;
    /**
     * Generate effort allocation scenarios
     */
    generateScenarios(domains: ParetoDomain[], totalHours: number): {
        conservative: EffortAllocation[];
        balanced: EffortAllocation[];
        aggressive: EffortAllocation[];
    };
};

/**
 * Implementation Roadmap for 11-Domain Pareto Optimization
 * Based on Q1 2025 Execution Plan
 */
interface RoadmapPhase {
    phase: string;
    weeks: string;
    focus: string;
    domains: string[];
    actions: string[];
    successMetrics: string[];
    timeline: string;
}
interface ImplementationTask {
    id: string;
    domainId: string;
    priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
    title: string;
    description: string;
    effort: number;
    dependencies: string[];
    deadline: string;
    status: 'pending' | 'in_progress' | 'completed';
    assignee?: string;
}
declare const Q1_2025_ROADMAP: RoadmapPhase[];
declare const IMPLEMENTATION_TASKS: ImplementationTask[];
declare const SUCCESS_METRICS: {
    revenue: {
        target: number;
        current: number;
        breakdown: {
            'tech-review-blog': {
                target: number;
                current: number;
            };
            'antonylambi.be': {
                target: number;
                current: number;
            };
            'fixie.run': {
                target: number;
                current: number;
            };
            'seobiz.be': {
                target: number;
                current: number;
            };
            'adaptogenic-mushrooms': {
                target: number;
                current: number;
            };
            'aiftw.be': {
                target: number;
                current: number;
            };
        };
    };
    traffic: {
        'tech-review-blog': {
            target: number;
            current: number;
        };
        'fixie.run': {
            target: number;
            current: number;
        };
        'adaptogenic-mushrooms': {
            target: number;
            current: number;
        };
    };
    users: {
        'fixie.run': {
            target: number;
            current: number;
        };
        'affinitylove.eu': {
            target: number;
            current: number;
        };
        'rhymechain.win': {
            target: number;
            current: number;
        };
    };
    subscribers: {
        'aiftw.be': {
            target: number;
            current: number;
        };
        'brainhealth-mushrooms': {
            target: number;
            current: number;
        };
        'healthful-mushrooms': {
            target: number;
            current: number;
        };
    };
};
declare const RISK_MITIGATION: {
    marketCompetition: {
        risk: string;
        mitigation: string;
        owner: string;
    };
    regulatoryChanges: {
        risk: string;
        mitigation: string;
        owner: string;
    };
    implementationDelays: {
        risk: string;
        mitigation: string;
        owner: string;
    };
    marketTiming: {
        risk: string;
        mitigation: string;
        owner: string;
    };
};
/**
 * Calculate implementation progress
 */
declare function calculateImplementationProgress(): {
    overall: number;
    byDomain: Record<string, number>;
    byPhase: Record<string, number>;
    risks: string[];
    recommendations: string[];
};
/**
 * Get next priority tasks
 */
declare function getNextPriorityTasks(limit?: number): ImplementationTask[];
/**
 * Update task status
 */
declare function updateTaskStatus(taskId: string, status: ImplementationTask['status']): boolean;

/**
 * Quick start function for Pareto optimization
 */
declare function createParetoOptimization(): {
    engine: ParetoOptimizationEngine;
    forecastEngine: RevenueForecastEngine;
    analyticsEngine: ParetoAnalyticsEngine;
    getRankings: () => ParetoOptimizationResult[];
    getAllocations: () => EffortAllocation[];
    getMetrics: () => {
        revenueConcentration: {
            top5Percentage: number;
            paretoRatio: boolean;
        };
        effortEfficiency: {
            top5EffortPercentage: number;
            averageRoiPerHour: number;
        };
        optimizationPotential: {
            totalRevenueImpact: number;
            totalEffortReduction: number;
            averageRoiImprovement: number;
        };
        forecastSummary: {
            conservativeTotal: number;
            aggressiveTotal: number;
            averageConfidence: number;
        };
    };
    getAnalytics: () => {
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
            trend: "up" | "down" | "stable";
        }>;
        effortAllocation: {
            optimal: EffortAllocation[];
            current: EffortAllocation[];
            gaps: Array<{
                domainId: string;
                gap: number;
                action: string;
            }>;
        };
        forecasts: {
            conservative: number;
            aggressive: number;
            expected: number;
            confidence: number;
        };
        alerts: Array<{
            type: "warning" | "critical" | "info";
            message: string;
            domainId?: string;
            impact: number;
        }>;
    };
    getForecasts: () => RevenueForecast[];
};
/**
 * Utility function to validate Pareto compliance
 */
declare function validateParetoCompliance(domains: ParetoDomain[]): {
    isCompliant: boolean;
    score: number;
    recommendations: string[];
};
/**
 * Generate Pareto optimization report
 */
declare function generateParetoReport(): string;

export { AllocationUtils, AnalyticsUtils, type DomainPriority, type EffortAllocation, EffortAllocator, type EffortLevel, ForecastingUtils, IMPLEMENTATION_TASKS, type ImplementationTask, PARETO_DOMAINS, ParetoAnalyticsEngine, type ParetoDomain, ParetoOptimizationEngine, type ParetoOptimizationResult, ParetoUtils, Q1_2025_ROADMAP, RISK_MITIGATION, type RevenueForecast, RevenueForecastEngine, type RevenueType, type RoadmapPhase, SUCCESS_METRICS, calculateImplementationProgress, createParetoOptimization, generateParetoReport, getNextPriorityTasks, updateTaskStatus, validateParetoCompliance };
