export type UrbanRankLevel = 'Débutant' | 'Avancé' | 'Expert';

export interface OverviewMetrics {
  totalRides: { value: number; icon: 'bicycle' };
  totalDistance: { value: number; icon: 'route' };
  totalHours: { value: number; icon: 'clock' };
  avgDistance: { value: number; change: number };
}

export interface AnnualPerformanceDataPoint {
  year: number;
  rides: number;
}

export interface TokenEconomicsDataPoint {
  year: number;
  tokens: number;
}

export interface TokenMetrics {
  totalEarned: number;
  earnedThisWeek: number;
  avgTokensPerKm: number;
  urbanGrade: string;
}

export interface PersonalRecord {
  label: string;
  subLabel: string;
  value: string;
  icon: 'run' | 'zap' | 'flame' | 'power' | 'cadence'; // 'power' and 'cadence' might need new icons
}

export interface UrbanAchievement {
  label: string;
  value: string | number;
  icon: 'neighborhood' | 'traffic-light' | 'zap' | 'route' | 'commute' | 'explore';
  // FIX: Add optional subLabel property to align with data in urbanConstants.ts
  subLabel?: string;
  goal?: number;
}

export interface FixieRidingStyle {
  avgCadence: { value: number; unit: string };
  urbanResistance: { value: number; unit: string };
  energyEfficiency: { value: number; unit: string };
  aggressiveStyle: { value: number; unit: string };
}

export interface DetailedSession {
    totalSessions: { value: number; change: number; };
    commutes: { value: number; subLabel: string; avgDuration: number; };
    explorations: { value: number; subLabel: string; };
}

export interface SpeedZone {
    name: string;
    value: number;
    color: string;
}

export interface WeeklyHeatmapData {
    day: string;
    // Hour of the day (0-23) -> intensity (0-1)
    hours: { [hour: number]: number };
}

export interface UrbanRanking {
    name: string;
    value: number;
    level: UrbanRankLevel;
}

export interface MasteredChallenge {
    name: string;
    value: number;
    icon: 'traffic-light' | 'car' | 'mountain' | 'intersection' | 'weather' | 'shield'; // 'intersection' might need new icon
}

export interface PerformanceByPeriod {
    period: string;
    rides: number;
    efficiency: number;
}

export interface PerformanceByZone {
    name: string;
    subLabel: string;
    efficiency: number;
}

export interface EcologicalImpact {
    co2Saved: { value: number; subLabel: string; dailyImpact: number; };
    treeEquivalent: { value: number; subLabel: string; monthlyChange: number; };
    fuelSaved: { value: number; subLabel: string; monthlySavings: number; };
}

export interface UrbanData {
  overviewMetrics: OverviewMetrics;
  annualPerformance: AnnualPerformanceDataPoint[];
  tokenEconomics: TokenEconomicsDataPoint[];
  tokenMetrics: TokenMetrics;
  personalRecords: PersonalRecord[];
  urbanAchievements: UrbanAchievement[];
  ridingStyle: FixieRidingStyle;
  detailedSession: DetailedSession;
  distanceEvolution: { average: number; max: number; total: number; data: { day: string; value: number }[]; trend: number; regularity: number; };
  speedAnalysis: { average: number; peak: number; cardioPercent: number; data: { day: string; value: number }[]; };
  speedZones: SpeedZone[];
  weeklyHeatmap: WeeklyHeatmapData[];
  urbanRanking: UrbanRanking[];
  masteredChallenges: MasteredChallenge[];
  performanceByPeriod: PerformanceByPeriod[];
  performanceByZone: PerformanceByZone[];
  ecologicalImpact: EcologicalImpact;
}