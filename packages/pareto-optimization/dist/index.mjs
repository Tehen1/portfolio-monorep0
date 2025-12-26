// src/types/domain.ts
import { z } from "zod";
var DomainPrioritySchema = z.enum(["CRITICAL", "HIGH", "SUPPORTING", "EMERGING"]);
var EffortLevelSchema = z.enum(["LOW", "MEDIUM", "HIGH"]);
var RevenueTypeSchema = z.enum([
  "AFFILIATE",
  "SUBSCRIPTION",
  "E_COMMERCE",
  "CONSULTING",
  "NFT_SALES",
  "STAKING_FEES",
  "SAAS",
  "CONTENT",
  "SPONSORSHIP"
]);
var PARETO_DOMAINS = [
  {
    id: "tech-review-blog",
    name: "Tech Review Blog",
    url: "tech-review-blog.com",
    priority: "CRITICAL",
    effortLevel: "LOW",
    y1Revenue: 608e3,
    roi: 340,
    revenueTypes: ["AFFILIATE", "CONTENT"],
    keyMetrics: {
      monthlyTraffic: 12e5,
      conversionRate: 0.03,
      avgOrderValue: 150
    },
    paretoInsights: {
      revenueConcentration: "80% revenue from 20% of content (160 out of 800 articles)",
      effortDistribution: "40% time: 5 high-commission reviews/week, 35% time: 10 comparison articles/week, 15% time: Email campaigns, link building, 10% time: Analytics & optimization",
      optimizationStrategy: "High-ROI Articles: ChatGPT Plus vs Claude Pro vs Gemini (\u20AC1,200-1,500/article), Best VPN 2025 NordVPN vs ExpressVPN (\u20AC800-1,000/article), Midjourney vs DALL-E vs Stable Diffusion (\u20AC900-1,200/article), Project Management Tools Ranked (\u20AC600-800/article), Best Web Hosting for Beginners (\u20AC700-900/article)"
    },
    weeklyHours: 8,
    focus: "5 high-comm articles"
  },
  {
    id: "antonylambi",
    name: "Anthony Lambi Personal",
    url: "antonylambi.be",
    priority: "CRITICAL",
    effortLevel: "MEDIUM",
    y1Revenue: 662e3,
    roi: 260,
    revenueTypes: ["CONSULTING", "CONTENT", "SPONSORSHIP"],
    keyMetrics: {
      monthlyTraffic: 5e4,
      conversionRate: 0.08,
      customerLifetimeValue: 5e3
    },
    paretoInsights: {
      revenueConcentration: "80% from consulting services (41%) + project revenue (57%)",
      effortDistribution: "80% on consulting delivery + personal brand authority, 15% on speaking engagements, 5% on passive income",
      optimizationStrategy: "Focus on high-value consulting (2-3 clients = $120k/year), leverage Fixie.run, RhymeChain, SEOBiz ownership"
    },
    weeklyHours: 6,
    focus: "Consulting + speaking"
  },
  {
    id: "adaptogenic-mushrooms",
    name: "Adaptogenic Mushrooms",
    url: "adaptogenic-mushrooms.com",
    priority: "CRITICAL",
    effortLevel: "MEDIUM",
    y1Revenue: 37e4,
    roi: 185,
    revenueTypes: ["E_COMMERCE", "AFFILIATE", "SUBSCRIPTION"],
    keyMetrics: {
      monthlyTraffic: 15e4,
      conversionRate: 0.025,
      avgOrderValue: 85
    },
    paretoInsights: {
      revenueConcentration: "80% from top 2 streams: Private Label Products + Affiliate",
      effortDistribution: "80% on 3 core products (reishi, lion's mane, cordyceps), 60% budget on Google Ads + affiliate",
      optimizationStrategy: "Optimize landing pages, drive affiliate traffic, stock 6-12 months, focus on premium positioning"
    },
    weeklyHours: 5,
    focus: "Product optimization"
  },
  {
    id: "fixie-run",
    name: "Fixie Run",
    url: "fixie.run",
    priority: "HIGH",
    effortLevel: "HIGH",
    y1Revenue: 39e4,
    roi: 156,
    revenueTypes: ["NFT_SALES", "STAKING_FEES", "E_COMMERCE"],
    keyMetrics: {
      monthlyTraffic: 75e3,
      conversionRate: 0.02,
      avgOrderValue: 400
    },
    paretoInsights: {
      revenueConcentration: "80% from NFT Bike Sales + Staking Fees",
      effortDistribution: "70% on hardcore cyclist retention, 20% on regular rider engagement, 10% on experimentation",
      optimizationStrategy: "Focus NFT bike sales to 20% of users (high-value buyers), premium bike pricing $400-800"
    },
    weeklyHours: 5,
    focus: "VIP retention"
  },
  {
    id: "seobiz",
    name: "SEOBiz SaaS",
    url: "seobiz.be",
    priority: "HIGH",
    effortLevel: "MEDIUM",
    y1Revenue: 28e4,
    roi: 145,
    revenueTypes: ["SAAS", "SUBSCRIPTION"],
    keyMetrics: {
      monthlyTraffic: 25e3,
      conversionRate: 0.05,
      customerLifetimeValue: 1200
    },
    paretoInsights: {
      revenueConcentration: "80% revenue from 20% of customers (Enterprise + Scale plans)",
      effortDistribution: "80% on Enterprise + Scale Tier Sales (50 target customers), account-based marketing",
      optimizationStrategy: "Focus keyword clustering automation, AI content generation templates, custom implementation"
    },
    weeklyHours: 4,
    focus: "Enterprise sales"
  },
  {
    id: "rhymechain",
    name: "RhymeChain",
    url: "rhymechain.win",
    priority: "SUPPORTING",
    effortLevel: "HIGH",
    y1Revenue: 315e3,
    roi: 126,
    revenueTypes: ["NFT_SALES", "CONTENT"],
    keyMetrics: {
      monthlyTraffic: 1e5,
      conversionRate: 0.015,
      avgOrderValue: 75
    },
    paretoInsights: {
      revenueConcentration: "80% revenue from 20% of users (top 5% creators generate 60% of battle volume)",
      effortDistribution: "70% on creator partnerships, 20% on community events, 10% on mass marketing",
      optimizationStrategy: "Revenue share model for top 400 creators, exclusive events & tournaments, NFT recognition"
    },
    weeklyHours: 2,
    focus: "Creator partnerships"
  },
  {
    id: "affinitylove",
    name: "AffinityLove",
    url: "affinitylove.eu",
    priority: "SUPPORTING",
    effortLevel: "HIGH",
    y1Revenue: 313e3,
    roi: 104,
    revenueTypes: ["SUBSCRIPTION", "E_COMMERCE"],
    keyMetrics: {
      monthlyTraffic: 2e5,
      conversionRate: 0.025,
      customerLifetimeValue: 480
    },
    paretoInsights: {
      revenueConcentration: "80% revenue from 20% of users (Premium + Elite subscribers)",
      effortDistribution: "70% on premium conversion, 20% on Elite tier positioning, 10% on discovery",
      optimizationStrategy: "Freemium base, premium tier 8.5% conversion, elite tier 2% conversion, profile strength scores"
    },
    weeklyHours: 2,
    focus: "Premium conversion"
  },
  {
    id: "brainhealth-mushrooms",
    name: "BrainHealth Mushrooms",
    url: "brainhealthmushrooms.com",
    priority: "SUPPORTING",
    effortLevel: "MEDIUM",
    y1Revenue: 28e4,
    roi: 112,
    revenueTypes: ["E_COMMERCE", "AFFILIATE", "SUBSCRIPTION"],
    keyMetrics: {
      monthlyTraffic: 8e4,
      conversionRate: 0.028,
      avgOrderValue: 120
    },
    paretoInsights: {
      revenueConcentration: "80% from premium nootropic stacks + high-ticket affiliate",
      effortDistribution: "80% on biohacker/performance segment, neuroscience research content, premium stacks",
      optimizationStrategy: "Target 20% biohackers (high-value), lifetime value $4,000+, clinical studies focus"
    },
    weeklyHours: 2,
    focus: "Biohacker targeting"
  },
  {
    id: "aiftw",
    name: "AIFTW Affiliate",
    url: "aiftw.be",
    priority: "SUPPORTING",
    effortLevel: "LOW",
    y1Revenue: 293e3,
    roi: 146,
    revenueTypes: ["AFFILIATE", "CONTENT"],
    keyMetrics: {
      monthlyTraffic: 3e5,
      conversionRate: 0.035,
      avgOrderValue: 85
    },
    paretoInsights: {
      revenueConcentration: "80% from top 5 programs: ChatGPT, Claude, Midjourney, NordVPN, Vercel",
      effortDistribution: "60% on high-commission comparisons, 30% on roundup content, 10% on tutorials",
      optimizationStrategy: "4-5 in-depth comparison articles/month, target $3,000-4,000 per article, newsletter launch"
    },
    weeklyHours: 3,
    focus: "High-comm content"
  },
  {
    id: "healthful-mushrooms",
    name: "Healthful Mushrooms",
    url: "healthfulmushrooms.com",
    priority: "EMERGING",
    effortLevel: "MEDIUM",
    y1Revenue: 22e4,
    roi: 88,
    revenueTypes: ["SUBSCRIPTION", "AFFILIATE"],
    keyMetrics: {
      monthlyTraffic: 12e4,
      conversionRate: 0.022,
      customerLifetimeValue: 1170
    },
    paretoInsights: {
      revenueConcentration: "80% from subscription box + volume affiliate",
      effortDistribution: "80% on high-LTV subscriber retention, quality assurance, educational content",
      optimizationStrategy: "Focus on 15% high-LTV subscribers (3+ months), $1,755 lifetime value, personalized recommendations"
    },
    weeklyHours: 2,
    focus: "Retention focus"
  },
  {
    id: "puffs-store",
    name: "Puffs Store",
    url: "puffs-store.com",
    priority: "EMERGING",
    effortLevel: "HIGH",
    y1Revenue: 267e3,
    roi: 107,
    revenueTypes: ["E_COMMERCE"],
    keyMetrics: {
      monthlyTraffic: 45e3,
      conversionRate: 0.018,
      avgOrderValue: 95
    },
    paretoInsights: {
      revenueConcentration: "80% from 2 compliant states (CA, CO), regulatory compliance = 40% of effort",
      effortDistribution: "40% on compliance, 60% on revenue optimization, risk management focus",
      optimizationStrategy: "Year 1: CA + CO focus, Year 2: OR + WA expansion, age verification, Metrc tracking integration"
    },
    weeklyHours: 1,
    focus: "Compliance check"
  }
];

// src/core/pareto-engine.ts
var ParetoOptimizationEngine = class {
  domains;
  constructor(domains = PARETO_DOMAINS) {
    this.domains = domains;
  }
  /**
   * Calculate Pareto ranking based on revenue and effort
   */
  calculateParetoRanking() {
    const totalRevenue = this.domains.reduce((sum, domain) => sum + domain.y1Revenue, 0);
    const totalEffort = this.domains.reduce((sum, domain) => sum + domain.weeklyHours, 0);
    return this.domains.map((domain) => {
      const revenuePercentage = domain.y1Revenue / totalRevenue * 100;
      const effortPercentage = domain.weeklyHours / totalEffort * 100;
      const efficiency = revenuePercentage / effortPercentage;
      let recommendedPriority;
      if (revenuePercentage >= 15 && efficiency >= 2) {
        recommendedPriority = "CRITICAL";
      } else if (revenuePercentage >= 8 && efficiency >= 1.5) {
        recommendedPriority = "HIGH";
      } else if (revenuePercentage >= 4 && efficiency >= 1) {
        recommendedPriority = "SUPPORTING";
      } else {
        recommendedPriority = "EMERGING";
      }
      const revenueImpact = domain.y1Revenue * 0.2;
      const effortReduction = domain.weeklyHours * 0.3;
      const roiImprovement = domain.roi * 0.25;
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
  calculateEffortAllocation() {
    const totalWeeklyHours = this.domains.reduce((sum, domain) => sum + domain.weeklyHours, 0);
    return this.domains.map((domain) => {
      const roiPerHour = domain.y1Revenue / (domain.weeklyHours * 52);
      const totalWeeklyEffort = domain.weeklyHours / totalWeeklyHours * 100;
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
  generateRevenueForecasts() {
    const growthFactors = {
      CRITICAL: { conservative: 1.2, aggressive: 1.4, confidence: 0.85 },
      HIGH: { conservative: 1.15, aggressive: 1.35, confidence: 0.75 },
      SUPPORTING: { conservative: 1.1, aggressive: 1.25, confidence: 0.65 },
      EMERGING: { conservative: 1.05, aggressive: 1.15, confidence: 0.55 }
    };
    return this.domains.map((domain) => {
      const factors = growthFactors[domain.priority];
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
      const domain = this.domains.find((d) => d.id === result.domainId);
      return sum + (domain?.y1Revenue || 0);
    }, 0);
    const totalEffort = allocations.reduce((sum, alloc) => sum + alloc.weeklyHours, 0);
    const top5Effort = top5Domains.reduce((sum, result) => {
      const alloc = allocations.find((a) => a.domainId === result.domainId);
      return sum + (alloc?.weeklyHours || 0);
    }, 0);
    return {
      revenueConcentration: {
        top5Percentage: top5Revenue / totalRevenue * 100,
        paretoRatio: top5Revenue / totalRevenue >= 0.8
      },
      effortEfficiency: {
        top5EffortPercentage: top5Effort / totalEffort * 100,
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
  generateOptimizationActions(domain) {
    const actions = [];
    switch (domain.id) {
      case "tech-review-blog":
        actions.push(
          "Publish 5 high-commission affiliate articles/week",
          "Focus on ChatGPT, Midjourney, NordVPN comparisons",
          "Implement automated content generation pipeline",
          "Launch email campaigns for top-performing content"
        );
        break;
      case "antonylambi":
        actions.push(
          "Secure 2-3 high-value consulting clients ($5k/month)",
          "Create case studies showcasing consulting wins",
          "Launch LinkedIn authority content (3-5 posts/week)",
          "Develop speaking engagement pipeline"
        );
        break;
      case "adaptogenic-mushrooms":
        actions.push(
          "Optimize top 3 product pages (Reishi, Lion's Mane, Cordyceps)",
          "Increase Google Ads budget for high-margin products",
          "Implement affiliate traffic driving strategies",
          "Stock 6-12 months inventory for core products"
        );
        break;
      case "fixie-run":
        actions.push(
          "Launch VIP tier with premium NFT pricing ($400-800)",
          "Implement hardcore cyclist retention mechanics",
          "Develop NFT marketplace with exclusive bikes",
          "Create community ambassador program"
        );
        break;
      case "seobiz":
        actions.push(
          "Execute account-based marketing for 100 high-value prospects",
          "Create enterprise sales pitch deck and demos",
          "Focus on keyword clustering automation feature",
          "Secure first 2 enterprise customers"
        );
        break;
      default:
        actions.push(
          "Analyze top 20% revenue drivers",
          "Optimize effort allocation based on ROI",
          "Implement Pareto-focused content strategy",
          "Monitor and adjust based on performance metrics"
        );
    }
    return actions;
  }
  /**
   * Determine optimization timeframe
   */
  determineTimeframe(current, recommended) {
    const priorityOrder = { CRITICAL: 4, HIGH: 3, SUPPORTING: 2, EMERGING: 1 };
    const currentScore = priorityOrder[current];
    const recommendedScore = priorityOrder[recommended];
    if (recommendedScore > currentScore) {
      return "Q1";
    } else if (recommendedScore === currentScore) {
      return "Q2";
    } else {
      return "Q3-Q4";
    }
  }
  /**
   * Extract key growth drivers for forecasting
   */
  extractKeyDrivers(domain) {
    const drivers = [];
    switch (domain.id) {
      case "tech-review-blog":
        drivers.push("High-commission affiliate content", "SEO traffic growth", "Email list monetization");
        break;
      case "antonylambi":
        drivers.push("Consulting client acquisition", "Speaking engagement bookings", "Personal brand authority");
        break;
      case "fixie-run":
        drivers.push("NFT marketplace adoption", "Staking fee revenue", "Premium user conversion");
        break;
      default:
        drivers.push("Revenue optimization", "User acquisition", "Product-market fit");
    }
    return drivers;
  }
  /**
   * Identify key risks for each domain
   */
  identifyRisks(domain) {
    const risks = [];
    switch (domain.id) {
      case "tech-review-blog":
        risks.push("Affiliate program policy changes", "Competition from similar blogs", "Algorithm changes affecting traffic");
        break;
      case "fixie-run":
        risks.push("Crypto market volatility", "Regulatory changes in NFT space", "Competition from Web3 fitness apps");
        break;
      case "puffs-store":
        risks.push("Regulatory compliance issues", "State legalization delays", "Supply chain disruptions");
        break;
      default:
        risks.push("Market competition", "Economic downturn impact", "Technical implementation challenges");
    }
    return risks;
  }
  /**
   * Get domain by ID
   */
  getDomain(domainId) {
    return this.domains.find((domain) => domain.id === domainId);
  }
  /**
   * Get all domains
   */
  getAllDomains() {
    return [...this.domains];
  }
  /**
   * Update domain data (for real-time optimization)
   */
  updateDomain(domainId, updates) {
    const index = this.domains.findIndex((domain) => domain.id === domainId);
    if (index !== -1) {
      this.domains[index] = { ...this.domains[index], ...updates };
    }
  }
};
var ParetoUtils = {
  /**
   * Calculate Pareto ratio (80/20 compliance)
   */
  calculateParetoRatio(items, targetRatio = 0.8) {
    const sortedItems = [...items].sort((a, b) => b.value - a.value);
    const totalValue = sortedItems.reduce((sum, item) => sum + item.value, 0);
    const top20Percent = sortedItems.slice(0, Math.ceil(items.length * 0.2));
    const top20Value = top20Percent.reduce((sum, item) => sum + item.value, 0);
    return top20Value / totalValue >= targetRatio;
  },
  /**
   * Calculate effort efficiency score
   */
  calculateEfficiencyScore(revenue, effort) {
    return revenue / effort;
  },
  /**
   * Calculate ROI improvement potential
   */
  calculateROIImprovement(currentROI, targetEfficiency) {
    return currentROI * targetEfficiency;
  }
};

// src/forecasting/revenue-forecast.ts
var RevenueForecastEngine = class {
  domains;
  historicalData;
  constructor(domains, historicalData) {
    this.domains = domains;
    this.historicalData = historicalData;
  }
  /**
   * Generate comprehensive revenue forecasts using multiple models
   */
  generateComprehensiveForecast(domainId) {
    const domain = this.domains.find((d) => d.id === domainId);
    if (!domain) throw new Error(`Domain ${domainId} not found`);
    const baseRevenue = domain.y1Revenue;
    const historical = this.historicalData?.get(domainId) || [];
    const linearGrowth = this.calculateLinearGrowth(domain, historical);
    const exponentialGrowth = this.calculateExponentialGrowth(domain, historical);
    const paretoWeighted = this.calculateParetoWeightedGrowth(domain, historical);
    const seasonalAdjustment = this.calculateSeasonalAdjustment(domain, historical);
    const weights = this.calculateModelWeights(domain);
    const expectedRevenue = Math.round(
      linearGrowth * weights.linear + exponentialGrowth * weights.exponential + paretoWeighted * weights.paretoWeighted + seasonalAdjustment * weights.seasonal
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
  calculateLinearGrowth(domain, historical) {
    if (historical.length < 3) {
      const growthRate = this.getDomainGrowthRate(domain);
      return Math.round(domain.y1Revenue * (1 + growthRate));
    }
    const revenues = historical.map((h) => h.revenue);
    const months = historical.length;
    const avgGrowth = this.calculateAverageGrowthRate(revenues);
    return Math.round(revenues[revenues.length - 1] * (1 + avgGrowth));
  }
  /**
   * Calculate exponential growth forecast
   */
  calculateExponentialGrowth(domain, historical) {
    if (historical.length < 3) {
      const growthRate = this.getDomainGrowthRate(domain) * 1.5;
      return Math.round(domain.y1Revenue * Math.pow(1 + growthRate, 1.2));
    }
    const revenues = historical.map((h) => h.revenue);
    const exponentialGrowth = this.calculateExponentialGrowthRate(revenues);
    return Math.round(revenues[revenues.length - 1] * Math.pow(1 + exponentialGrowth, 1.2));
  }
  /**
   * Calculate Pareto-weighted growth (80/20 principle applied to forecasting)
   */
  calculateParetoWeightedGrowth(domain, historical) {
    const baseGrowth = domain.priority === "CRITICAL" ? 1.4 : domain.priority === "HIGH" ? 1.35 : domain.priority === "SUPPORTING" ? 1.25 : 1.15;
    const paretoEfficiency = 0.8 / 0.2;
    const efficiencyAdjusted = baseGrowth * (paretoEfficiency * 0.1);
    return Math.round(domain.y1Revenue * (1 + efficiencyAdjusted));
  }
  /**
   * Calculate seasonal adjustment
   */
  calculateSeasonalAdjustment(domain, historical) {
    if (historical.length < 12) {
      const seasonalMultiplier = this.getSeasonalMultiplier(domain);
      return Math.round(domain.y1Revenue * seasonalMultiplier);
    }
    const seasonalFactors = this.calculateSeasonalFactors(historical);
    const currentMonth = (/* @__PURE__ */ new Date()).getMonth();
    const seasonalFactor = seasonalFactors[currentMonth] || 1;
    return Math.round(domain.y1Revenue * seasonalFactor);
  }
  /**
   * Calculate model weights based on domain characteristics
   */
  calculateModelWeights(domain) {
    switch (domain.priority) {
      case "CRITICAL":
        return { linear: 0.3, exponential: 0.3, paretoWeighted: 0.3, seasonal: 0.1 };
      case "HIGH":
        return { linear: 0.35, exponential: 0.25, paretoWeighted: 0.3, seasonal: 0.1 };
      case "SUPPORTING":
        return { linear: 0.4, exponential: 0.2, paretoWeighted: 0.25, seasonal: 0.15 };
      case "EMERGING":
        return { linear: 0.3, exponential: 0.4, paretoWeighted: 0.2, seasonal: 0.1 };
      default:
        return { linear: 0.25, exponential: 0.25, paretoWeighted: 0.25, seasonal: 0.25 };
    }
  }
  /**
   * Generate conservative forecast
   */
  generateConservativeForecast(domain, expectedRevenue) {
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
  generateAggressiveForecast(domain, expectedRevenue) {
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
  calculateConfidenceScore(domain, historical) {
    let confidence = 0.5;
    if (historical.length >= 12) confidence += 0.2;
    else if (historical.length >= 6) confidence += 0.1;
    else if (historical.length >= 3) confidence += 0.05;
    switch (domain.priority) {
      case "CRITICAL":
        confidence += 0.2;
        break;
      case "HIGH":
        confidence += 0.15;
        break;
      case "SUPPORTING":
        confidence += 0.1;
        break;
      case "EMERGING":
        confidence += 0.05;
        break;
    }
    if (domain.roi > 200) confidence += 0.1;
    else if (domain.roi > 100) confidence += 0.05;
    return Math.min(confidence, 0.95);
  }
  /**
   * Helper methods for calculations
   */
  calculateAverageGrowthRate(revenues) {
    if (revenues.length < 2) return 0.1;
    let totalGrowth = 0;
    for (let i = 1; i < revenues.length; i++) {
      const growth = (revenues[i] - revenues[i - 1]) / revenues[i - 1];
      totalGrowth += growth;
    }
    return totalGrowth / (revenues.length - 1);
  }
  calculateExponentialGrowthRate(revenues) {
    if (revenues.length < 3) return 0.15;
    const periods = revenues.length - 1;
    const startValue = revenues[0];
    const endValue = revenues[revenues.length - 1];
    return Math.pow(endValue / startValue, 1 / periods) - 1;
  }
  calculateSeasonalFactors(historical) {
    const monthlyTotals = new Array(12).fill(0);
    const monthlyCounts = new Array(12).fill(0);
    historical.forEach((record) => {
      const month = (/* @__PURE__ */ new Date(record.month + "-01")).getMonth();
      monthlyTotals[month] += record.revenue;
      monthlyCounts[month]++;
    });
    const overallAverage = monthlyTotals.reduce((sum, total) => sum + total, 0) / monthlyCounts.reduce((sum, count) => sum + count, 0);
    return monthlyTotals.map(
      (total, index) => monthlyCounts[index] > 0 ? total / monthlyCounts[index] / overallAverage : 1
    );
  }
  getDomainGrowthRate(domain) {
    switch (domain.priority) {
      case "CRITICAL":
        return 0.25;
      // 25% growth
      case "HIGH":
        return 0.2;
      // 20% growth
      case "SUPPORTING":
        return 0.15;
      // 15% growth
      case "EMERGING":
        return 0.1;
      // 10% growth
      default:
        return 0.15;
    }
  }
  getSeasonalMultiplier(domain) {
    switch (domain.id) {
      case "adaptogenic-mushrooms":
      case "brainhealth-mushrooms":
      case "healthful-mushrooms":
        return 1.1;
      // Health products peak in winter
      case "fixie-run":
        return 1.15;
      // Fitness peaks in spring/summer
      case "puffs-store":
        return 0.95;
      // Compliance-heavy, more stable
      default:
        return 1.05;
    }
  }
  extractForecastDrivers(domain) {
    return [
      "Historical performance trends",
      "Market growth in domain category",
      "Competitive landscape analysis",
      "Seasonal demand patterns",
      "Pareto optimization efficiency gains"
    ];
  }
  extractConservativeDrivers(domain) {
    return [
      "Stable market conditions",
      "Conservative competitor analysis",
      "Historical baseline performance",
      "Risk-adjusted growth assumptions"
    ];
  }
  extractAggressiveDrivers(domain) {
    return [
      "Rapid market expansion",
      "First-mover advantage capture",
      "Successful optimization implementation",
      "Favorable competitive dynamics"
    ];
  }
  identifyForecastRisks(domain) {
    const risks = [
      "Market competition intensification",
      "Economic downturn impact",
      "Regulatory changes"
    ];
    switch (domain.id) {
      case "fixie-run":
        risks.push("Crypto market volatility");
        break;
      case "puffs-store":
        risks.push("Regulatory compliance issues");
        break;
      case "tech-review-blog":
        risks.push("Algorithm changes", "Affiliate policy changes");
        break;
    }
    return risks;
  }
  identifyAggressiveRisks(domain) {
    return [
      "Overly optimistic assumptions",
      "Implementation execution risks",
      "Market timing misalignment",
      "Resource allocation constraints"
    ];
  }
  /**
   * Update historical data for improved forecasting
   */
  updateHistoricalData(domainId, data) {
    if (!this.historicalData) {
      this.historicalData = /* @__PURE__ */ new Map();
    }
    this.historicalData.set(domainId, data);
  }
};
var ForecastingUtils = {
  /**
   * Calculate compound annual growth rate
   */
  calculateCAGR(startValue, endValue, periods) {
    return Math.pow(endValue / startValue, 1 / periods) - 1;
  },
  /**
   * Calculate forecast accuracy metrics
   */
  calculateForecastAccuracy(actual, predicted) {
    if (actual.length !== predicted.length) {
      throw new Error("Actual and predicted arrays must have the same length");
    }
    let sumAPE = 0;
    let sumSquaredErrors = 0;
    for (let i = 0; i < actual.length; i++) {
      const error = predicted[i] - actual[i];
      const ape = Math.abs(error) / actual[i];
      sumAPE += ape;
      sumSquaredErrors += error * error;
    }
    const mape = sumAPE / actual.length * 100;
    const rmse = Math.sqrt(sumSquaredErrors / actual.length);
    const accuracy = 100 - mape;
    return { mape, rmse, accuracy: Math.max(0, accuracy) };
  },
  /**
   * Generate forecast scenarios
   */
  generateScenarios(baseForecast, volatility = 0.2) {
    const volatilityRange = baseForecast * volatility;
    return {
      pessimistic: Math.round(baseForecast - volatilityRange),
      base: Math.round(baseForecast),
      optimistic: Math.round(baseForecast + volatilityRange),
      volatilityRange: Math.round(volatilityRange)
    };
  }
};

// src/analytics/pareto-analytics.ts
var ParetoAnalyticsEngine = class {
  optimizationEngine;
  forecastEngine;
  kpiHistory;
  constructor(optimizationEngine, forecastEngine) {
    this.optimizationEngine = optimizationEngine;
    this.forecastEngine = forecastEngine;
    this.kpiHistory = /* @__PURE__ */ new Map();
  }
  /**
   * Calculate real-time Pareto performance metrics
   */
  calculateRealtimeMetrics() {
    const rankings = this.optimizationEngine.calculateParetoRanking();
    const allocations = this.optimizationEngine.calculateEffortAllocation();
    const forecasts = this.optimizationEngine.generateRevenueForecasts();
    const portfolioMetrics = this.optimizationEngine.calculatePortfolioMetrics();
    const paretoCompliance = portfolioMetrics.revenueConcentration.paretoRatio ? 100 : 75;
    const portfolioEfficiency = this.calculatePortfolioEfficiency(rankings, allocations);
    const revenueConcentration = portfolioMetrics.revenueConcentration.top5Percentage;
    const effortOptimization = this.calculateEffortOptimizationScore(allocations);
    const forecastAccuracy = this.calculateForecastAccuracyScore();
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
  generateAnalyticsDashboard() {
    const domains = this.optimizationEngine.getAllDomains();
    const rankings = this.optimizationEngine.calculateParetoRanking();
    const allocations = this.optimizationEngine.calculateEffortAllocation();
    const forecasts = this.optimizationEngine.generateRevenueForecasts();
    const portfolioMetrics = this.optimizationEngine.calculatePortfolioMetrics();
    const totalRevenue = domains.reduce((sum, domain) => sum + domain.y1Revenue, 0);
    const averageROI = domains.reduce((sum, domain) => sum + domain.roi, 0) / domains.length;
    const domainPerformance = domains.map((domain) => {
      const ranking = rankings.find((r) => r.domainId === domain.id);
      const efficiency = ranking ? ranking.revenueImpact / ranking.effortReduction * 100 : 0;
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
    const effortGaps = this.identifyEffortGaps(allocations);
    const forecastSummary = {
      conservative: portfolioMetrics.forecastSummary.conservativeTotal,
      aggressive: portfolioMetrics.forecastSummary.aggressiveTotal,
      expected: Math.round((portfolioMetrics.forecastSummary.conservativeTotal + portfolioMetrics.forecastSummary.aggressiveTotal) / 2),
      confidence: portfolioMetrics.forecastSummary.averageConfidence * 100
    };
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
        current: allocations,
        // In real implementation, this would come from actual tracking
        gaps: effortGaps
      },
      forecasts: forecastSummary,
      alerts
    };
  }
  /**
   * Track KPI performance over time
   */
  trackKPIs() {
    const metrics = this.calculateRealtimeMetrics();
    const timestamp = /* @__PURE__ */ new Date();
    Object.entries(metrics).forEach(([key, value]) => {
      if (!this.kpiHistory.has(key)) {
        this.kpiHistory.set(key, []);
      }
      this.kpiHistory.get(key).push({ timestamp, value });
    });
  }
  /**
   * Generate performance reports
   */
  generatePerformanceReport(timeframe) {
    const now = /* @__PURE__ */ new Date();
    const periods = timeframe === "weekly" ? 7 : timeframe === "monthly" ? 30 : 90;
    const startDate = new Date(now.getTime() - periods * 24 * 60 * 60 * 1e3);
    const kpiTrends = /* @__PURE__ */ new Map();
    this.kpiHistory.forEach((history, kpiName) => {
      const recentData = history.filter((h) => h.timestamp >= startDate);
      if (recentData.length >= 2) {
        const firstValue = recentData[0].value;
        const lastValue = recentData[recentData.length - 1].value;
        const change = (lastValue - firstValue) / firstValue * 100;
        let trend = "stable";
        if (change > 5) trend = "improving";
        else if (change < -5) trend = "declining";
        kpiTrends.set(kpiName, { change, trend });
      }
    });
    const rankings = this.optimizationEngine.calculateParetoRanking();
    const topPerformers = rankings.slice(0, 3).map((r) => r.domainId);
    const underperformers = rankings.slice(-3).map((r) => r.domainId);
    const recommendations = this.generateRecommendations(rankings, kpiTrends);
    const risks = this.identifyRisks(rankings, kpiTrends);
    return {
      period: `${timeframe} report (${startDate.toISOString().split("T")[0]} to ${now.toISOString().split("T")[0]})`,
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
  calculatePortfolioEfficiency(rankings, allocations) {
    const totalRevenueImpact = rankings.reduce((sum, r) => sum + r.revenueImpact, 0);
    const totalEffort = allocations.reduce((sum, a) => sum + a.weeklyHours, 0);
    const avgROI = allocations.reduce((sum, a) => sum + a.roiPerHour, 0) / allocations.length;
    const efficiencyScore = totalRevenueImpact / totalEffort * avgROI / 100;
    return Math.min(efficiencyScore, 100);
  }
  /**
   * Calculate effort optimization score
   */
  calculateEffortOptimizationScore(allocations) {
    const totalEffort = allocations.reduce((sum, a) => sum + a.weeklyHours, 0);
    const top5Effort = allocations.sort((a, b) => b.roiPerHour - a.roiPerHour).slice(0, 5).reduce((sum, a) => sum + a.weeklyHours, 0);
    return top5Effort / totalEffort * 100;
  }
  /**
   * Calculate forecast accuracy score
   */
  calculateForecastAccuracyScore() {
    return 85;
  }
  /**
   * Calculate risk score
   */
  calculateRiskScore(forecasts) {
    const avgConfidence = forecasts.reduce((sum, f) => sum + f.confidence, 0) / forecasts.length;
    const riskFactors = forecasts.reduce((sum, f) => sum + f.risks.length, 0) / forecasts.length;
    return Math.min((1 - avgConfidence) * 100 + riskFactors * 10, 100);
  }
  /**
   * Calculate domain performance trend
   */
  calculateDomainTrend(domainId) {
    const trends = ["up", "down", "stable"];
    return trends[Math.floor(Math.random() * trends.length)];
  }
  /**
   * Identify effort allocation gaps
   */
  identifyEffortGaps(allocations) {
    return allocations.filter((alloc) => alloc.totalWeeklyEffort < 10).map((alloc) => ({
      domainId: alloc.domainId,
      gap: 10 - alloc.totalWeeklyEffort,
      action: "Increase effort allocation to improve Pareto efficiency"
    }));
  }
  /**
   * Generate alerts based on performance metrics
   */
  generateAlerts(rankings, allocations, forecasts) {
    const alerts = [];
    rankings.forEach((ranking) => {
      if (ranking.revenueImpact < ranking.effortReduction * 2) {
        alerts.push({
          type: "warning",
          message: `Low efficiency: Revenue impact (${ranking.revenueImpact}) vs effort (${ranking.effortReduction})`,
          domainId: ranking.domainId,
          impact: ranking.revenueImpact
        });
      }
    });
    forecasts.forEach((forecast) => {
      if (forecast.confidence < 0.6) {
        alerts.push({
          type: "critical",
          message: `Low forecast confidence (${(forecast.confidence * 100).toFixed(1)}%) for ${forecast.domainId}`,
          domainId: forecast.domainId,
          impact: forecast.aggressive - forecast.conservative
        });
      }
    });
    const portfolioMetrics = this.optimizationEngine.calculatePortfolioMetrics();
    if (!portfolioMetrics.revenueConcentration.paretoRatio) {
      alerts.push({
        type: "info",
        message: "Portfolio not achieving 80/20 Pareto ratio - consider reallocating resources",
        impact: portfolioMetrics.revenueConcentration.top5Percentage
      });
    }
    return alerts;
  }
  /**
   * Generate recommendations based on analysis
   */
  generateRecommendations(rankings, kpiTrends) {
    const recommendations = [];
    kpiTrends.forEach((trend, kpi) => {
      if (trend.trend === "declining") {
        recommendations.push(`Address declining ${kpi} (${trend.change.toFixed(1)}% change)`);
      }
    });
    const topPerformer = rankings[0];
    const underPerformer = rankings[rankings.length - 1];
    recommendations.push(`Focus more resources on ${topPerformer.domainId} (highest ROI)`);
    recommendations.push(`Review strategy for ${underPerformer.domainId} (lowest efficiency)`);
    recommendations.push("Maintain 80/20 focus: 80% effort on top 20% domains");
    recommendations.push("Regularly review and adjust effort allocation based on performance");
    return recommendations;
  }
  /**
   * Identify risks based on current analysis
   */
  identifyRisks(rankings, kpiTrends) {
    const risks = [];
    const decliningKPIs = Array.from(kpiTrends.entries()).filter(([, trend]) => trend.trend === "declining").map(([kpi]) => kpi);
    if (decliningKPIs.length > 0) {
      risks.push(`Declining KPIs: ${decliningKPIs.join(", ")}`);
    }
    const highRiskDomains = rankings.filter((r) => r.revenueImpact < 1e4);
    if (highRiskDomains.length > 3) {
      risks.push("Multiple domains showing low revenue impact - diversification risk");
    }
    risks.push("Market competition may impact affiliate revenue streams");
    risks.push("Regulatory changes could affect emerging domains");
    return risks;
  }
  /**
   * Export analytics data for external analysis
   */
  exportAnalyticsData() {
    return {
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      metrics: this.calculateRealtimeMetrics(),
      rankings: this.optimizationEngine.calculateParetoRanking(),
      allocations: this.optimizationEngine.calculateEffortAllocation(),
      forecasts: this.optimizationEngine.generateRevenueForecasts(),
      kpiHistory: this.kpiHistory
    };
  }
};
var AnalyticsUtils = {
  /**
   * Calculate statistical measures
   */
  calculateStats(values) {
    const sorted = [...values].sort((a, b) => a - b);
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const median = sorted[Math.floor(sorted.length / 2)];
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
    const stdDev = Math.sqrt(variance);
    const quartiles = [
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
  detectAnomalies(values, threshold = 2) {
    const stats = this.calculateStats(values);
    const anomalies = [];
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
  calculateTrendStrength(values) {
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

// src/strategies/effort-allocator.ts
var EffortAllocator = class {
  domains;
  totalWeeklyHours;
  constructor(domains, totalWeeklyHours = 40) {
    this.domains = domains;
    this.totalWeeklyHours = totalWeeklyHours;
  }
  /**
   * Calculate optimal effort allocation using Pareto principles
   */
  calculateOptimalAllocation() {
    const priorityWeights = this.calculatePriorityWeights();
    const paretoAdjusted = this.applyParetoEfficiency(priorityWeights);
    const minimumViable = this.ensureMinimumViableEffort(paretoAdjusted);
    return this.normalizeToTotalHours(minimumViable);
  }
  /**
   * Calculate priority-based weights
   */
  calculatePriorityWeights() {
    const weights = /* @__PURE__ */ new Map();
    const priorityMultipliers = {
      CRITICAL: 4,
      // 80% of effort potential
      HIGH: 1,
      // 15% of effort potential
      SUPPORTING: 0.2,
      // 4% of effort potential
      EMERGING: 0.05
      // 1% of effort potential
    };
    let totalWeight = 0;
    this.domains.forEach((domain) => {
      const multiplier = priorityMultipliers[domain.priority];
      const roiFactor = domain.roi / 100;
      const weight = multiplier * roiFactor;
      weights.set(domain.id, weight);
      totalWeight += weight;
    });
    const normalizedWeights = /* @__PURE__ */ new Map();
    weights.forEach((weight, domainId) => {
      normalizedWeights.set(domainId, weight / totalWeight);
    });
    return normalizedWeights;
  }
  /**
   * Apply Pareto efficiency adjustments
   */
  applyParetoEfficiency(weights) {
    const adjustedWeights = /* @__PURE__ */ new Map();
    const sortedDomains = Array.from(weights.entries()).sort(([, a], [, b]) => b - a);
    sortedDomains.forEach(([domainId, weight], index) => {
      let adjustedWeight = weight;
      if (index >= 5) {
        adjustedWeight *= 0.2;
      } else if (index >= 2) {
        adjustedWeight *= 0.5;
      }
      adjustedWeights.set(domainId, adjustedWeight);
    });
    return adjustedWeights;
  }
  /**
   * Ensure minimum viable effort for all domains
   */
  ensureMinimumViableEffort(weights) {
    const adjustedWeights = new Map(weights);
    const minimumEffortPercent = 0.02;
    adjustedWeights.forEach((weight, domainId) => {
      if (weight < minimumEffortPercent) {
        adjustedWeights.set(domainId, minimumEffortPercent);
      }
    });
    const totalWeight = Array.from(adjustedWeights.values()).reduce((sum, w) => sum + w, 0);
    const renormalizedWeights = /* @__PURE__ */ new Map();
    adjustedWeights.forEach((weight, domainId) => {
      renormalizedWeights.set(domainId, weight / totalWeight);
    });
    return renormalizedWeights;
  }
  /**
   * Normalize weights to total available hours
   */
  normalizeToTotalHours(weights) {
    const allocations = [];
    weights.forEach((weight, domainId) => {
      const domain = this.domains.find((d) => d.id === domainId);
      if (domain) {
        const weeklyHours = Math.round(weight * this.totalWeeklyHours * 100) / 100;
        const roiPerHour = domain.y1Revenue / (weeklyHours * 52);
        allocations.push({
          domainId,
          weeklyHours,
          focus: domain.focus,
          roiPerHour,
          totalWeeklyEffort: weight * 100
        });
      }
    });
    return allocations.sort((a, b) => b.roiPerHour - a.roiPerHour);
  }
  /**
   * Generate effort reallocation recommendations
   */
  generateReallocationRecommendations(currentAllocations) {
    const optimalAllocations = this.calculateOptimalAllocation();
    const recommendations = [];
    let totalHoursChange = 0;
    let totalRevenueImpact = 0;
    optimalAllocations.forEach((optimal) => {
      const current = currentAllocations.find((c) => c.domainId === optimal.domainId);
      if (current) {
        const hoursDifference = optimal.weeklyHours - current.weeklyHours;
        const revenueImpact = hoursDifference * optimal.roiPerHour * 52;
        let action = "maintain";
        let reason = "";
        if (Math.abs(hoursDifference) < 0.5) {
          action = "maintain";
          reason = "Current allocation is optimal";
        } else if (hoursDifference > 0) {
          action = "increase";
          reason = `High ROI potential (\u20AC${revenueImpact.toFixed(0)} annual impact)`;
        } else {
          action = "decrease";
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
      return rec.action === "increase" ? sum + Math.abs(rec.impact) : sum;
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
  calculateEfficiencyScore() {
    const allocations = this.calculateOptimalAllocation();
    const totalRevenue = this.domains.reduce((sum, domain) => sum + domain.y1Revenue, 0);
    const top5Revenue = allocations.slice(0, 5).reduce((sum, alloc) => {
      const domain = this.domains.find((d) => d.id === alloc.domainId);
      return sum + (domain?.y1Revenue || 0);
    }, 0);
    const paretoCompliance = top5Revenue / totalRevenue >= 0.8 ? 100 : 75;
    const avgRoiPerHour = allocations.reduce((sum, alloc) => sum + alloc.roiPerHour, 0) / allocations.length;
    const roiOptimization = Math.min(avgRoiPerHour / 100, 100);
    const totalAllocatedHours = allocations.reduce((sum, alloc) => sum + alloc.weeklyHours, 0);
    const resourceUtilization = totalAllocatedHours / this.totalWeeklyHours * 100;
    const score = (paretoCompliance + roiOptimization + resourceUtilization) / 3;
    const recommendations = [];
    if (paretoCompliance < 80) {
      recommendations.push("Reallocate effort to top-performing domains to achieve 80/20 ratio");
    }
    if (roiOptimization < 50) {
      recommendations.push("Focus effort on domains with highest ROI potential");
    }
    if (resourceUtilization < 90) {
      recommendations.push("Increase resource utilization or reduce scope");
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
  updateTotalHours(newTotal) {
    this.totalWeeklyHours = newTotal;
  }
  /**
   * Update domain data for dynamic allocation
   */
  updateDomainData(domainId, updates) {
    const index = this.domains.findIndex((d) => d.id === domainId);
    if (index !== -1) {
      this.domains[index] = { ...this.domains[index], ...updates };
    }
  }
};
var AllocationUtils = {
  /**
   * Calculate break-even effort for a domain
   */
  calculateBreakEvenEffort(domain, fixedCosts = 0) {
    const annualRevenue = domain.y1Revenue;
    const weeklyBreakEven = (fixedCosts + annualRevenue * 0.1) / 52;
    return Math.max(weeklyBreakEven, 1);
  },
  /**
   * Calculate effort elasticity (revenue change per effort hour)
   */
  calculateEffortElasticity(domain) {
    const baseRevenue = domain.y1Revenue;
    const baseEffort = domain.weeklyHours;
    const elasticity = baseRevenue * 0.1 / baseEffort;
    return elasticity;
  },
  /**
   * Generate effort allocation scenarios
   */
  generateScenarios(domains, totalHours) {
    const allocator = new EffortAllocator(domains, totalHours);
    const conservativeDomains = domains.map((d) => ({
      ...d,
      priority: d.priority === "CRITICAL" ? "HIGH" : d.priority
    }));
    const aggressiveDomains = domains.map((d) => ({
      ...d,
      priority: d.priority === "HIGH" ? "CRITICAL" : d.priority
    }));
    return {
      conservative: new EffortAllocator(conservativeDomains, totalHours).calculateOptimalAllocation(),
      balanced: allocator.calculateOptimalAllocation(),
      aggressive: new EffortAllocator(aggressiveDomains, totalHours).calculateOptimalAllocation()
    };
  }
};

// src/strategies/implementation-roadmap.ts
var Q1_2025_ROADMAP = [
  {
    phase: "Foundation",
    weeks: "Week 1-2",
    focus: "Critical Path Infrastructure",
    domains: ["tech-review-blog", "antonylambi.be", "fixie.run"],
    actions: [
      "Publish 8 high-commission comparisons on tech-review-blog",
      "Create 2 case studies + speaking inquiry outreach for antonylambi.be",
      "Launch VIP tier + retention mechanics for fixie.run",
      "Optimize top 3 product pages for adaptogenic-mushrooms",
      "Create enterprise pitch deck for seobiz.be"
    ],
    successMetrics: [
      "tech-review-blog: 8 high-ROI articles published",
      "antonylambi.be: 2 case studies completed",
      "fixie.run: VIP tier MVP launched",
      "adaptogenic-mushrooms: 3 product pages optimized",
      "seobiz.be: Enterprise sales deck ready"
    ],
    timeline: "Complete by Day 14"
  },
  {
    phase: "Momentum",
    weeks: "Week 3-4",
    focus: "Scale High-ROI Channels",
    domains: ["tech-review-blog", "antonylambi.be", "fixie.run", "aiftw.be", "rhymechain.win"],
    actions: [
      "Batch generate 15 affiliate articles on tech-review-blog",
      "LinkedIn content 3x/week for antonylambi.be",
      "NFT marketplace launch for fixie.run",
      "4 comparison posts for aiftw.be",
      "Creator outreach (top 50 artists) for rhymechain.win"
    ],
    successMetrics: [
      "tech-review-blog: 15+ articles published",
      "antonylambi.be: Weekly LinkedIn cadence established",
      "fixie.run: NFT marketplace live",
      "aiftw.be: 4 comparison articles completed",
      "rhymechain.win: 50 creator partnerships initiated"
    ],
    timeline: "Complete by Day 28"
  },
  {
    phase: "Optimization",
    weeks: "Week 5-8",
    focus: "Double Down on Winners",
    domains: ["tech-review-blog", "fixie.run", "seobiz.be", "brainhealth-mushrooms", "affinitylove.eu", "puffs-store.com"],
    actions: [
      "20+ articles published, analyze top performers on tech-review-blog",
      "User cohort analysis + retention optimization for fixie.run",
      "Demo enterprise pipeline for seobiz.be",
      "Biohacker targeting test for brainhealth-mushrooms",
      "Premium tier A/B testing for affinitylove.eu",
      "Secondary market expansion (OR, WA) for puffs-store.com"
    ],
    successMetrics: [
      "tech-review-blog: Top-performing content identified and scaled",
      "fixie.run: User retention improved by 25%",
      "seobiz.be: First enterprise customer secured",
      "brainhealth-mushrooms: Biohacker segment conversion increased",
      "affinitylove.eu: Premium tier conversion optimized",
      "puffs-store.com: Compliance audit completed"
    ],
    timeline: "Complete by Day 56"
  }
];
var IMPLEMENTATION_TASKS = [
  // Critical Priority Tasks (Complete by Day 30)
  {
    id: "tech-review-blog-articles",
    domainId: "tech-review-blog",
    priority: "CRITICAL",
    title: "Publish 5 High-Commission Affiliate Articles",
    description: "Focus on ChatGPT vs Claude, VPN comparisons, Midjourney vs DALL-E, Project Management Tools, Web Hosting",
    effort: 40,
    dependencies: [],
    deadline: "2025-01-07",
    status: "pending"
  },
  {
    id: "antonylambi-case-studies",
    domainId: "antonylambi.be",
    priority: "CRITICAL",
    title: "Create 2 Case Studies",
    description: "Showcase consulting wins and thought leadership",
    effort: 16,
    dependencies: [],
    deadline: "2025-01-07",
    status: "pending"
  },
  {
    id: "fixie-run-vip-tier",
    domainId: "fixie.run",
    priority: "CRITICAL",
    title: "MVP Launch with VIP Tier Mechanics",
    description: "iOS/Android app with premium NFT pricing ($400-800) and retention features",
    effort: 80,
    dependencies: [],
    deadline: "2025-01-07",
    status: "pending"
  },
  {
    id: "seobiz-enterprise-pitch",
    domainId: "seobiz.be",
    priority: "CRITICAL",
    title: "Enterprise Sales Pitch Deck",
    description: "Create comprehensive ROI calculations and demo pipeline",
    effort: 24,
    dependencies: [],
    deadline: "2025-01-07",
    status: "pending"
  },
  {
    id: "adaptogenic-product-pages",
    domainId: "adaptogenic-mushrooms",
    priority: "CRITICAL",
    title: "Optimize Top 3 Product Pages",
    description: "Reishi, Lion's Mane, Cordyceps landing page optimization",
    effort: 20,
    dependencies: [],
    deadline: "2025-01-07",
    status: "pending"
  },
  // High Priority Tasks (Complete by Day 60)
  {
    id: "tech-review-blog-batch",
    domainId: "tech-review-blog",
    priority: "HIGH",
    title: "15 Comparison Articles Batch",
    description: "Automate content generation pipeline for affiliate comparisons",
    effort: 60,
    dependencies: ["tech-review-blog-articles"],
    deadline: "2025-01-21",
    status: "pending"
  },
  {
    id: "antonylambi-linkedin",
    domainId: "antonylambi.be",
    priority: "HIGH",
    title: "Speaking Inquiries & Consulting Retainer",
    description: "Develop speaking pipeline and high-value client acquisition",
    effort: 32,
    dependencies: ["antonylambi-case-studies"],
    deadline: "2025-01-21",
    status: "pending"
  },
  {
    id: "fixie-run-marketplace",
    domainId: "fixie.run",
    priority: "HIGH",
    title: "NFT Marketplace Launch",
    description: "Live marketplace with 5k beta users",
    effort: 120,
    dependencies: ["fixie-run-vip-tier"],
    deadline: "2025-01-21",
    status: "pending"
  },
  {
    id: "aiftw-newsletter",
    domainId: "aiftw.be",
    priority: "HIGH",
    title: "Newsletter Launch",
    description: "5k subscriber target with AI content focus",
    effort: 40,
    dependencies: [],
    deadline: "2025-01-21",
    status: "pending"
  },
  {
    id: "seobiz-enterprise-customers",
    domainId: "seobiz.be",
    priority: "HIGH",
    title: "First 2 Enterprise Customers",
    description: "Secure enterprise SaaS contracts",
    effort: 80,
    dependencies: ["seobiz-enterprise-pitch"],
    deadline: "2025-01-21",
    status: "pending"
  }
];
var SUCCESS_METRICS = {
  revenue: {
    target: 25e5,
    // €2.5M Year 1 conservative
    current: 0,
    breakdown: {
      "tech-review-blog": { target: 485e3, current: 0 },
      "antonylambi.be": { target: 53e4, current: 0 },
      "fixie.run": { target: 312e3, current: 0 },
      "seobiz.be": { target: 224e3, current: 0 },
      "adaptogenic-mushrooms": { target: 296e3, current: 0 },
      "aiftw.be": { target: 205e3, current: 0 }
    }
  },
  traffic: {
    "tech-review-blog": { target: 12e5, current: 0 },
    "fixie.run": { target: 75e3, current: 0 },
    "adaptogenic-mushrooms": { target: 15e4, current: 0 }
  },
  users: {
    "fixie.run": { target: 12e3, current: 0 },
    "affinitylove.eu": { target: 45e3, current: 0 },
    "rhymechain.win": { target: 3200, current: 0 }
  },
  subscribers: {
    "aiftw.be": { target: 5e3, current: 0 },
    "brainhealth-mushrooms": { target: 1e4, current: 0 },
    "healthful-mushrooms": { target: 2500, current: 0 }
  }
};
var RISK_MITIGATION = {
  marketCompetition: {
    risk: "Affiliate program changes, competitor pressure",
    mitigation: "Diversify revenue streams, build direct relationships",
    owner: "Anthony"
  },
  regulatoryChanges: {
    risk: "Crypto regulations, cannabis legalization delays",
    mitigation: "Compliance-first approach, legal monitoring",
    owner: "Legal Team"
  },
  implementationDelays: {
    risk: "Technical challenges, resource constraints",
    mitigation: "Agile development, weekly progress reviews",
    owner: "Tech Team"
  },
  marketTiming: {
    risk: "Economic downturn, market saturation",
    mitigation: "Conservative forecasting, diversified portfolio",
    owner: "Strategy Team"
  }
};
function calculateImplementationProgress() {
  const totalTasks = IMPLEMENTATION_TASKS.length;
  const completedTasks = IMPLEMENTATION_TASKS.filter((t) => t.status === "completed").length;
  const overall = completedTasks / totalTasks * 100;
  const domainProgress = {};
  const domains = [...new Set(IMPLEMENTATION_TASKS.map((t) => t.domainId))];
  domains.forEach((domain) => {
    const domainTasks = IMPLEMENTATION_TASKS.filter((t) => t.domainId === domain);
    const completed = domainTasks.filter((t) => t.status === "completed").length;
    domainProgress[domain] = completed / domainTasks.length * 100;
  });
  const phaseProgress = {};
  Q1_2025_ROADMAP.forEach((phase) => {
    const phaseTasks = IMPLEMENTATION_TASKS.filter(
      (t) => phase.domains.includes(t.domainId)
    );
    const completed = phaseTasks.filter((t) => t.status === "completed").length;
    phaseProgress[phase.phase] = phaseTasks.length > 0 ? completed / phaseTasks.length * 100 : 0;
  });
  const risks = [];
  const recommendations = [];
  if (overall < 25) {
    risks.push("Implementation behind schedule - Foundation phase at risk");
    recommendations.push("Prioritize critical path tasks and allocate additional resources");
  }
  if (domainProgress["fixie.run"] < 50) {
    risks.push("Fixie.run MVP delay impacts Q1 revenue projections");
    recommendations.push("Accelerate development team or reduce scope");
  }
  return {
    overall,
    byDomain: domainProgress,
    byPhase: phaseProgress,
    risks,
    recommendations
  };
}
function getNextPriorityTasks(limit = 5) {
  return IMPLEMENTATION_TASKS.filter((task) => task.status !== "completed").sort((a, b) => {
    const priorityOrder = { CRITICAL: 4, HIGH: 3, MEDIUM: 2, LOW: 1 };
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    }
    return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
  }).slice(0, limit);
}
function updateTaskStatus(taskId, status) {
  const task = IMPLEMENTATION_TASKS.find((t) => t.id === taskId);
  if (task) {
    task.status = status;
    return true;
  }
  return false;
}

// src/index.ts
function createParetoOptimization() {
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
function validateParetoCompliance(domains) {
  const engine = new ParetoOptimizationEngine(domains);
  const metrics = engine.calculatePortfolioMetrics();
  const isCompliant = metrics.revenueConcentration.paretoRatio;
  const score = metrics.revenueConcentration.top5Percentage;
  const recommendations = [];
  if (!isCompliant) {
    recommendations.push("Focus more effort on top 5 domains to achieve 80/20 ratio");
    recommendations.push("Reallocate resources from low-ROI domains to high-ROI domains");
    recommendations.push("Implement stricter prioritization based on revenue impact");
  }
  return { isCompliant, score, recommendations };
}
function generateParetoReport() {
  const { engine, analyticsEngine } = createParetoOptimization();
  const rankings = engine.calculateParetoRanking();
  const metrics = engine.calculatePortfolioMetrics();
  const analytics = analyticsEngine.generateAnalyticsDashboard();
  return `
\u{1F3AF} PARETO OPTIMIZATION REPORT
=============================

\u{1F4CA} PORTFOLIO METRICS
- Total Revenue: \u20AC${analytics.summary.totalRevenue.toLocaleString()}
- Total Domains: ${analytics.summary.totalDomains}
- Average ROI: ${analytics.summary.averageROI.toFixed(1)}%
- Pareto Ratio: ${analytics.summary.paretoRatio}%
- Efficiency Score: ${analytics.summary.efficiencyScore.toFixed(2)}

\u{1F3C6} TOP 5 DOMAINS (80% Revenue)
${rankings.slice(0, 5).map(
    (r, i) => `${i + 1}. ${r.domainId}: \u20AC${r.revenueImpact.toLocaleString()} revenue impact`
  ).join("\n")}

\u26A0\uFE0F  ALERTS
${analytics.alerts.map((alert) => `- ${alert.type.toUpperCase()}: ${alert.message}`).join("\n")}

\u{1F4A1} RECOMMENDATIONS
${analytics.alerts.length === 0 ? "- Portfolio performing optimally under Pareto principles" : "- Address critical alerts to maintain Pareto efficiency"}

Generated on ${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}
`;
}
export {
  AllocationUtils,
  AnalyticsUtils,
  EffortAllocator,
  ForecastingUtils,
  IMPLEMENTATION_TASKS,
  PARETO_DOMAINS,
  ParetoAnalyticsEngine,
  ParetoOptimizationEngine,
  ParetoUtils,
  Q1_2025_ROADMAP,
  RISK_MITIGATION,
  RevenueForecastEngine,
  SUCCESS_METRICS,
  calculateImplementationProgress,
  createParetoOptimization,
  generateParetoReport,
  getNextPriorityTasks,
  updateTaskStatus,
  validateParetoCompliance
};
