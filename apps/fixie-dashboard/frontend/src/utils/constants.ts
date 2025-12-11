// Constantes de configuration centralisées pour l'application
export const APP_CONFIG = {
  // API
  API: {
    BASE_URL: process.env.VITE_API_BASE_URL || 'https://api.example.com',
    TIMEOUT: 10000,
  },
  
  // Géolocalisation
  GEOLOCATION: {
    HIGH_ACCURACY: true,
    TIMEOUT: 10000,
    MAXIMUM_AGE: 0,
  },
  
  // Analyse de trajet
  TRACK_ANALYSIS: {
    MINIMUM_TRACK_POINTS: 2,
    MAX_TRACK_POINTS_FOR_AI: 100,
  },
  
  // Niveaux de difficulté
  DIFFICULTY_LEVELS: {
    Easy: { multiplier: 1.0, bonusChance: 0 },
    Medium: { multiplier: 1.15, bonusChance: 5 },
    Hard: { multiplier: 1.35, bonusChance: 10 },
  },
  
  // Métabolisme
  METABOLISM: {
    DEFAULT_BODY_WEIGHT: 75, // kg
    CYCLING_MET: 8.0,
    BASAL_METABOLIC_RATE: 1.2, // kcal/min
  },
  
  // Token économie
  TOKEN_ECONOMY: {
    DISTANCE_RATE: 0.8, // FRN par km de base
    UPGRADE_COST_BASE: 50,
  },
  
  // Loot Box
  LOOT_BOX: {
    DISTANCE_BONUS_RATE: 0.01, // 1% par 10km
    DISTANCE_BONUS_UNIT: 10, // km
  },
  
  // Interface utilisateur
  UI: {
    ITEMS_PER_PAGE: 10,
    ANIMATION_DURATION: 200,
  },
  
  // Images
  IMAGES: {
    BASE_URL: 'https://storage.googleapis.com/aistudio-hosting/workspace-dev/uno-d6-2/1721061908381',
  },
} as const;

// Types pour les configurations
export type DifficultyLevel = keyof typeof APP_CONFIG.DIFFICULTY_LEVELS;
export type AppConfig = typeof APP_CONFIG;