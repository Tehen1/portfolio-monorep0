// FIX: Create types.ts to define shared data structures and resolve import errors.
export type Rarity = 'Common' | 'Uncommon' | 'Rare' | 'Epic';
export type ActivityType = 'cycling' | 'running' | 'walking';
export type RideDifficulty = 'Easy' | 'Medium' | 'Hard';

export interface NftBike {
  id: number;
  name: string;
  level: number;
  imageUrl: string;
  attributes: {
    efficiency: number;
    resistance: number;
    chance: number;
    speed?: number;
    boost?: number;
  };
  rarity?: Rarity;
  price?: number;
}

export interface RideSplit {
    lap: number;
    distance: number;
    duration: string; // e.g., "10:23"
    avgSpeed: number;
}

export interface RideAnalysisResult {
  summary: string;
  distanceGained: number;
  earningsGained: number;
  lootBox: {
    found: boolean;
    name?: string;
    rarity?: Rarity;
  };
  splits: RideSplit[];
}

export interface GeoPoint {
    lat: number;
    lng: number;
    timestamp: number;
}

export interface RideHistoryEntry extends RideAnalysisResult {
  id: string;
  date: string;
  description: string; // This will now be the AI-generated summary
  track: GeoPoint[];
  duration: number; // Total duration in seconds
  elevationGain: number;
  avgSpeed: number;
  activeCalories: number;
  totalCalories: number;
}

// Analytics Dashboard Types
export interface Metric {
  value: string;
  change: number;
}

export interface ChartDataPoint {
  name: string;
  value: number;
}

export interface DistanceDataPoint {
    day: string;
    distance: number;
}

export interface SpeedDataPoint {
    day: string;
    speed: number;
}

export interface CadencePowerDataPoint {
    cadence: number;
    power: number;
}

export interface ElevationDataPoint {
    distance: number;
    elevation: number;
}

export interface HeartRateZone {
    name: string;
    value: number;
}

export interface CityRoute {
    name: string;
    distance: number;
    elevation: number;
    isFavorite?: boolean;
    isChallenge?: boolean;
}

export interface AnalyticsData {
  totalDistance: Metric;
  avgSpeed: Metric;
  totalCalories: Metric;
  tokensEarned: Metric;
  distanceOverTime: {
    average: number;
    max: number;
    total: number;
    data: DistanceDataPoint[];
  };
  speedTrend: {
    average: number;
    peak: number;
    cardioZonePercent: number;
    data: SpeedDataPoint[];
  };
  cadenceVsPower: {
    avgCadence: number;
    avgPower: number;
    efficiency: number;
    data: CadencePowerDataPoint[];
  };
  elevationProfile: {
    gain: number;
    peak: number;
    avgGrade: number;
    data: ElevationDataPoint[];
  };
  heartRateZones: {
    average: number;
    zones: HeartRateZone[];
  };
  urbanFitness: {
    cyclingScore: number;
    runningScore: number;
  };
  weeklyProgress: {
    distance: number;
    improvement: number;
    tokens: number;
  };
  runningPaceZones: {
    avgPace: string;
    best5k: string;
    spm: number;
  };
  urbanObstacles: {
    redLights: number;
    intersections: number;
    stopTime: string;
  };
  weatherImpact: {
    conditions: string;
    adaptation: string;
  };
  cityRoutes: CityRoute[];
  socialPerformance: {
    rank: number;
    friendsBeaten: number;
    challengesWon: number;
  };
  personalRecords: {
    longestDistance: number;
    fastestSpeed: number;
    mostCalories: number;
    maxPower: number;
    bestCadence: number;
  };
  activityBreakdown: {
    totalWorkouts: number;
    cyclingSessions: number;
    runningSessions: number;
    avgDuration: number;
    avgHeartRate: number;
  };
}