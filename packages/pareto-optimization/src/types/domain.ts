import { z } from 'zod';

// Core domain types based on Pareto analysis
export const DomainPrioritySchema = z.enum(['CRITICAL', 'HIGH', 'SUPPORTING', 'EMERGING']);
export type DomainPriority = z.infer<typeof DomainPrioritySchema>;

export const EffortLevelSchema = z.enum(['LOW', 'MEDIUM', 'HIGH']);
export type EffortLevel = z.infer<typeof EffortLevelSchema>;

export const RevenueTypeSchema = z.enum([
  'AFFILIATE', 'SUBSCRIPTION', 'E_COMMERCE', 'CONSULTING',
  'NFT_SALES', 'STAKING_FEES', 'SAAS', 'CONTENT', 'SPONSORSHIP'
]);
export type RevenueType = z.infer<typeof RevenueTypeSchema>;

// Domain configuration from Pareto analysis
export interface ParetoDomain {
  id: string;
  name: string;
  url: string;
  priority: DomainPriority;
  effortLevel: EffortLevel;
  y1Revenue: number; // Year 1 projected revenue
  roi: number; // Return on investment percentage
  revenueTypes: RevenueType[];
  keyMetrics: {
    monthlyTraffic?: number;
    conversionRate?: number;
    avgOrderValue?: number;
    customerLifetimeValue?: number;
  };
  paretoInsights: {
    revenueConcentration: string; // 80/20 revenue insights
    effortDistribution: string; // How effort should be allocated
    optimizationStrategy: string; // Specific 80/20 strategy
  };
  weeklyHours: number; // Recommended weekly effort allocation
  focus: string; // Key focus area
}

// The 11 domains from detailed Pareto analysis
export const PARETO_DOMAINS: ParetoDomain[] = [
  {
    id: 'tech-review-blog',
    name: 'Tech Review Blog',
    url: 'tech-review-blog.com',
    priority: 'CRITICAL',
    effortLevel: 'LOW',
    y1Revenue: 608000,
    roi: 340,
    revenueTypes: ['AFFILIATE', 'CONTENT'],
    keyMetrics: {
      monthlyTraffic: 1200000,
      conversionRate: 0.03,
      avgOrderValue: 150
    },
    paretoInsights: {
      revenueConcentration: '80% revenue from 20% of content (160 out of 800 articles)',
      effortDistribution: '40% time: 5 high-commission reviews/week, 35% time: 10 comparison articles/week, 15% time: Email campaigns, link building, 10% time: Analytics & optimization',
      optimizationStrategy: 'High-ROI Articles: ChatGPT Plus vs Claude Pro vs Gemini (€1,200-1,500/article), Best VPN 2025 NordVPN vs ExpressVPN (€800-1,000/article), Midjourney vs DALL-E vs Stable Diffusion (€900-1,200/article), Project Management Tools Ranked (€600-800/article), Best Web Hosting for Beginners (€700-900/article)'
    },
    weeklyHours: 8,
    focus: '5 high-comm articles'
  },
  {
    id: 'antonylambi',
    name: 'Anthony Lambi Personal',
    url: 'antonylambi.be',
    priority: 'CRITICAL',
    effortLevel: 'MEDIUM',
    y1Revenue: 662000,
    roi: 260,
    revenueTypes: ['CONSULTING', 'CONTENT', 'SPONSORSHIP'],
    keyMetrics: {
      monthlyTraffic: 50000,
      conversionRate: 0.08,
      customerLifetimeValue: 5000
    },
    paretoInsights: {
      revenueConcentration: '80% from consulting services (41%) + project revenue (57%)',
      effortDistribution: '80% on consulting delivery + personal brand authority, 15% on speaking engagements, 5% on passive income',
      optimizationStrategy: 'Focus on high-value consulting (2-3 clients = $120k/year), leverage Fixie.run, RhymeChain, SEOBiz ownership'
    },
    weeklyHours: 6,
    focus: 'Consulting + speaking'
  },
  {
    id: 'adaptogenic-mushrooms',
    name: 'Adaptogenic Mushrooms',
    url: 'adaptogenic-mushrooms.com',
    priority: 'CRITICAL',
    effortLevel: 'MEDIUM',
    y1Revenue: 370000,
    roi: 185,
    revenueTypes: ['E_COMMERCE', 'AFFILIATE', 'SUBSCRIPTION'],
    keyMetrics: {
      monthlyTraffic: 150000,
      conversionRate: 0.025,
      avgOrderValue: 85
    },
    paretoInsights: {
      revenueConcentration: '80% from top 2 streams: Private Label Products + Affiliate',
      effortDistribution: '80% on 3 core products (reishi, lion\'s mane, cordyceps), 60% budget on Google Ads + affiliate',
      optimizationStrategy: 'Optimize landing pages, drive affiliate traffic, stock 6-12 months, focus on premium positioning'
    },
    weeklyHours: 5,
    focus: 'Product optimization'
  },
  {
    id: 'fixie-run',
    name: 'Fixie Run',
    url: 'fixie.run',
    priority: 'HIGH',
    effortLevel: 'HIGH',
    y1Revenue: 390000,
    roi: 156,
    revenueTypes: ['NFT_SALES', 'STAKING_FEES', 'E_COMMERCE'],
    keyMetrics: {
      monthlyTraffic: 75000,
      conversionRate: 0.02,
      avgOrderValue: 400
    },
    paretoInsights: {
      revenueConcentration: '80% from NFT Bike Sales + Staking Fees',
      effortDistribution: '70% on hardcore cyclist retention, 20% on regular rider engagement, 10% on experimentation',
      optimizationStrategy: 'Focus NFT bike sales to 20% of users (high-value buyers), premium bike pricing $400-800'
    },
    weeklyHours: 5,
    focus: 'VIP retention'
  },
  {
    id: 'seobiz',
    name: 'SEOBiz SaaS',
    url: 'seobiz.be',
    priority: 'HIGH',
    effortLevel: 'MEDIUM',
    y1Revenue: 280000,
    roi: 145,
    revenueTypes: ['SAAS', 'SUBSCRIPTION'],
    keyMetrics: {
      monthlyTraffic: 25000,
      conversionRate: 0.05,
      customerLifetimeValue: 1200
    },
    paretoInsights: {
      revenueConcentration: '80% revenue from 20% of customers (Enterprise + Scale plans)',
      effortDistribution: '80% on Enterprise + Scale Tier Sales (50 target customers), account-based marketing',
      optimizationStrategy: 'Focus keyword clustering automation, AI content generation templates, custom implementation'
    },
    weeklyHours: 4,
    focus: 'Enterprise sales'
  },
  {
    id: 'rhymechain',
    name: 'RhymeChain',
    url: 'rhymechain.win',
    priority: 'SUPPORTING',
    effortLevel: 'HIGH',
    y1Revenue: 315000,
    roi: 126,
    revenueTypes: ['NFT_SALES', 'CONTENT'],
    keyMetrics: {
      monthlyTraffic: 100000,
      conversionRate: 0.015,
      avgOrderValue: 75
    },
    paretoInsights: {
      revenueConcentration: '80% revenue from 20% of users (top 5% creators generate 60% of battle volume)',
      effortDistribution: '70% on creator partnerships, 20% on community events, 10% on mass marketing',
      optimizationStrategy: 'Revenue share model for top 400 creators, exclusive events & tournaments, NFT recognition'
    },
    weeklyHours: 2,
    focus: 'Creator partnerships'
  },
  {
    id: 'affinitylove',
    name: 'AffinityLove',
    url: 'affinitylove.eu',
    priority: 'SUPPORTING',
    effortLevel: 'HIGH',
    y1Revenue: 313000,
    roi: 104,
    revenueTypes: ['SUBSCRIPTION', 'E_COMMERCE'],
    keyMetrics: {
      monthlyTraffic: 200000,
      conversionRate: 0.025,
      customerLifetimeValue: 480
    },
    paretoInsights: {
      revenueConcentration: '80% revenue from 20% of users (Premium + Elite subscribers)',
      effortDistribution: '70% on premium conversion, 20% on Elite tier positioning, 10% on discovery',
      optimizationStrategy: 'Freemium base, premium tier 8.5% conversion, elite tier 2% conversion, profile strength scores'
    },
    weeklyHours: 2,
    focus: 'Premium conversion'
  },
  {
    id: 'brainhealth-mushrooms',
    name: 'BrainHealth Mushrooms',
    url: 'brainhealthmushrooms.com',
    priority: 'SUPPORTING',
    effortLevel: 'MEDIUM',
    y1Revenue: 280000,
    roi: 112,
    revenueTypes: ['E_COMMERCE', 'AFFILIATE', 'SUBSCRIPTION'],
    keyMetrics: {
      monthlyTraffic: 80000,
      conversionRate: 0.028,
      avgOrderValue: 120
    },
    paretoInsights: {
      revenueConcentration: '80% from premium nootropic stacks + high-ticket affiliate',
      effortDistribution: '80% on biohacker/performance segment, neuroscience research content, premium stacks',
      optimizationStrategy: 'Target 20% biohackers (high-value), lifetime value $4,000+, clinical studies focus'
    },
    weeklyHours: 2,
    focus: 'Biohacker targeting'
  },
  {
    id: 'aiftw',
    name: 'AIFTW Affiliate',
    url: 'aiftw.be',
    priority: 'SUPPORTING',
    effortLevel: 'LOW',
    y1Revenue: 293000,
    roi: 146,
    revenueTypes: ['AFFILIATE', 'CONTENT'],
    keyMetrics: {
      monthlyTraffic: 300000,
      conversionRate: 0.035,
      avgOrderValue: 85
    },
    paretoInsights: {
      revenueConcentration: '80% from top 5 programs: ChatGPT, Claude, Midjourney, NordVPN, Vercel',
      effortDistribution: '60% on high-commission comparisons, 30% on roundup content, 10% on tutorials',
      optimizationStrategy: '4-5 in-depth comparison articles/month, target $3,000-4,000 per article, newsletter launch'
    },
    weeklyHours: 3,
    focus: 'High-comm content'
  },
  {
    id: 'healthful-mushrooms',
    name: 'Healthful Mushrooms',
    url: 'healthfulmushrooms.com',
    priority: 'EMERGING',
    effortLevel: 'MEDIUM',
    y1Revenue: 220000,
    roi: 88,
    revenueTypes: ['SUBSCRIPTION', 'AFFILIATE'],
    keyMetrics: {
      monthlyTraffic: 120000,
      conversionRate: 0.022,
      customerLifetimeValue: 1170
    },
    paretoInsights: {
      revenueConcentration: '80% from subscription box + volume affiliate',
      effortDistribution: '80% on high-LTV subscriber retention, quality assurance, educational content',
      optimizationStrategy: 'Focus on 15% high-LTV subscribers (3+ months), $1,755 lifetime value, personalized recommendations'
    },
    weeklyHours: 2,
    focus: 'Retention focus'
  },
  {
    id: 'puffs-store',
    name: 'Puffs Store',
    url: 'puffs-store.com',
    priority: 'EMERGING',
    effortLevel: 'HIGH',
    y1Revenue: 267000,
    roi: 107,
    revenueTypes: ['E_COMMERCE'],
    keyMetrics: {
      monthlyTraffic: 45000,
      conversionRate: 0.018,
      avgOrderValue: 95
    },
    paretoInsights: {
      revenueConcentration: '80% from 2 compliant states (CA, CO), regulatory compliance = 40% of effort',
      effortDistribution: '40% on compliance, 60% on revenue optimization, risk management focus',
      optimizationStrategy: 'Year 1: CA + CO focus, Year 2: OR + WA expansion, age verification, Metrc tracking integration'
    },
    weeklyHours: 1,
    focus: 'Compliance check'
  }
];

// Pareto optimization results
export interface ParetoOptimizationResult {
  domainId: string;
  currentPriority: DomainPriority;
  recommendedPriority: DomainPriority;
  revenueImpact: number;
  effortReduction: number;
  roiImprovement: number;
  optimizationActions: string[];
  timeframe: string; // Q1, Q2, etc.
}

// Effort allocation matrix
export interface EffortAllocation {
  domainId: string;
  weeklyHours: number;
  focus: string;
  roiPerHour: number;
  totalWeeklyEffort: number; // percentage of total effort
}

// Revenue forecasting
export interface RevenueForecast {
  domainId: string;
  conservative: number;
  aggressive: number;
  growthFactor: number;
  confidence: number; // 0-1
  keyDrivers: string[];
  risks: string[];
}
