/**
 * @fileoverview Système de types exhaustif pour FixieRun
 * @description Types strictes avec validation compile-time et runtime
 * @author FixieRun Development Team
 * @version 1.0.0
 * @license MIT
 */

/**
 * ═══════════════════════════════════════════════════════════════
 * 1. NAVIGATION & UI TYPES
 * ═══════════════════════════════════════════════════════════════
 */

/** Onglets disponibles dans l'application mobile */
export type ActiveTab = 'dashboard' | 'track' | 'nft' | 'profile' as const;

/** Configuration des onglets de navigation */
export interface TabConfig {
  readonly id: ActiveTab;
  readonly name: string;
  readonly icon: string;
  readonly ariaLabel: string;
}

/** État de notification utilisateur */
export type NotificationType = 'success' | 'info' | 'warning' | 'error' as const;

/** Notification avec typage strict */
export interface Notification {
  readonly id: string;
  readonly type: NotificationType;
  readonly message: string;
  readonly duration: number; // milliseconds
  readonly timestamp: Date;
  readonly dismissible: boolean;
}

/**
 * ═══════════════════════════════════════════════════════════════
 * 2. NFT & FILTERING TYPES
 * ═══════════════════════════════════════════════════════════════
 */

/** Raretés des NFTs */
export type NFTRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' as const;

/** Filtres de raretés */
export type NFTFilterRarity = NFTRarity | 'all' as const;

/** Terrains disponibles */
export type NFTTerrain = 'urban' | 'mountain' | 'road' | 'trail' as const;

/** Filtres de terrains */
export type NFTFilterTerrain = NFTTerrain | 'all' as const;

/** Critères de tri */
export type NFTSortBy = 'name' | 'rarity' | 'equipped' | 'recent' as const;

/** Métadonnées NFT complet */
export interface NFTMetadata {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly rarity: NFTRarity;
  readonly terrain: NFTTerrain;
  readonly image: string;
  readonly ipfsHash: string; // CID pour IPFS
  readonly equipped: boolean;
  readonly bonus: {
    readonly speed: number; // %
    readonly endurance: number; // %
    readonly distance: number; // km
  };
  readonly mintedAt: Date;
  readonly contractAddress: `0x${string}`;
  readonly tokenId: bigint;
}

/** NFT avec état d'équipement */
export interface EquippedNFT extends NFTMetadata {
  readonly equipped: true;
  readonly equippedSince: Date;
}

/**
 * ═══════════════════════════════════════════════════════════════
 * 3. TRACKING & GEOLOCATION TYPES
 * ═══════════════════════════════════════════════════════════════
 */

/** Coordonnées GPS avec précision */
export interface GeoLocation {
  readonly latitude: number;
  readonly longitude: number;
  readonly accuracy: number; // mètres
  readonly altitude: number | null;
  readonly timestamp: Date;
}

/** Segment de trajet */
export interface TrackingSegment {
  readonly id: string;
  readonly startLocation: GeoLocation;
  readonly endLocation: GeoLocation;
  readonly distance: number; // km
  readonly duration: number; // secondes
  readonly averageSpeed: number; // km/h
  readonly maxSpeed: number; // km/h
  readonly elevation: number; // mètres
}

/** Session de tracking complète */
export interface TrackingSession {
  readonly id: string;
  readonly userId: string;
  readonly startTime: Date;
  readonly endTime: Date | null;
  readonly segments: TrackingSegment[];
  readonly totalDistance: number; // km
  readonly totalDuration: number; // secondes
  readonly averageSpeed: number; // km/h
  readonly maxSpeed: number; // km/h
  readonly caloriesBurned: number;
  readonly equippedNFT: EquippedNFT | null;
  readonly weatherConditions: WeatherData | null;
  readonly isActive: boolean;
}

/** Données météo pour le tracking */
export interface WeatherData {
  readonly temperature: number; // °C
  readonly humidity: number; // %
  readonly windSpeed: number; // km/h
  readonly condition: 'clear' | 'cloudy' | 'rainy' | 'snowy';
  readonly timestamp: Date;
}

/**
 * ═══════════════════════════════════════════════════════════════
 * 4. USER & PROFILE TYPES
 * ═══════════════════════════════════════════════════════════════
 */

/** Préférences utilisateur */
export interface UserPreferences {
  readonly theme: 'light' | 'dark' | 'auto';
  readonly language: 'en' | 'fr' | 'es' | 'de';
  readonly notifications: {
    readonly achievements: boolean;
    readonly milestones: boolean;
    readonly marketing: boolean;
  };
  readonly privacy: {
    readonly profileVisible: boolean;
    readonly statsPublic: boolean;
    readonly leaderboardOptIn: boolean;
  };
}

/** Profil utilisateur */
export interface UserProfile {
  readonly id: string;
  readonly walletAddress: `0x${string}`;
  readonly username: string;
  readonly email: string;
  readonly avatar: string;
  readonly bio: string;
  readonly preferences: UserPreferences;
  readonly stats: {
    readonly totalDistance: number;
    readonly totalRides: number;
    readonly longestRide: number;
    readonly joinedAt: Date;
    readonly totalNFTs: number;
  };
  readonly verified: boolean;
}

/**
 * ═══════════════════════════════════════════════════════════════
 * 5. STATE MANAGEMENT TYPES
 * ═══════════════════════════════════════════════════════════════
 */

/** État de chargement async */
export type AsyncState = 'idle' | 'loading' | 'success' | 'error' as const;

/** Résultat d'une opération async */
export interface AsyncResult<T> {
  readonly state: AsyncState;
  readonly data: T | null;
  readonly error: Error | null;
  readonly isLoading: boolean;
}

/** État global du dashboard */
export interface DashboardState {
  readonly activeTab: ActiveTab;
  readonly notifications: Notification[];
  readonly isTracking: boolean;
  readonly currentLocation: GeoLocation | null;
  readonly currentSession: TrackingSession | null;
  readonly nfts: NFTMetadata[];
  readonly equippedNFT: EquippedNFT | null;
  readonly userProfile: UserProfile | null;
  readonly loadingState: AsyncState;
}

/**
 * ═══════════════════════════════════════════════════════════════
 * 6. EVENT HANDLER TYPES
 * ═══════════════════════════════════════════════════════════════
 */

/** Handlers de callback */
export interface EventHandlers {
  readonly onTabChange: (tab: ActiveTab) => void;
  readonly onStartTracking: () => Promise<void>;
  readonly onStopTracking: () => Promise<void>;
  readonly onEquipNFT: (nftId: string) => Promise<void>;
  readonly onFilterChange: (filter: Partial<FilterOptions>) => void;
  readonly onNotificationDismiss: (id: string) => void;
}

/** Options de filtrage */
export interface FilterOptions {
  readonly rarity: NFTFilterRarity;
  readonly terrain: NFTFilterTerrain;
  readonly sortBy: NFTSortBy;
}

/**
 * ═══════════════════════════════════════════════════════════════
 * 7. TYPE GUARDS & VALIDATORS
 * ═══════════════════════════════════════════════════════════════
 */

/** Vérifie si la valeur est une ActiveTab valide */
export const isActiveTab = (value: unknown): value is ActiveTab => {
  return ['dashboard', 'track', 'nft', 'profile'].includes(String(value));
};

/** Vérifie si la valeur est une NFTRarity valide */
export const isNFTRarity = (value: unknown): value is NFTRarity => {
  return ['common', 'uncommon', 'rare', 'epic', 'legendary'].includes(String(value));
};

/** Vérifie si la valeur est une NotificationType valide */
export const isNotificationType = (value: unknown): value is NotificationType => {
  return ['success', 'info', 'warning', 'error'].includes(String(value));
};

/** Vérifie si c'est une adresse Ethereum valide */
export const isEthereumAddress = (value: unknown): value is `0x${string}` => {
  return typeof value === 'string' && /^0x[a-fA-F0-9]{40}$/.test(value);
};

/** Vérifie si l'objet est un TabConfig valide */
export const isTabConfig = (value: unknown): value is TabConfig => {
  if (typeof value !== 'object' || value === null) return false;
  const obj = value as Record<string, unknown>;
  return (
    isActiveTab(obj.id) &&
    typeof obj.name === 'string' &&
    typeof obj.icon === 'string' &&
    typeof obj.ariaLabel === 'string'
  );
};

/**
 * ═══════════════════════════════════════════════════════════════
 * 8. CONSTANTS - DONNÉES CONFIGURÉES
 * ═══════════════════════════════════════════════════════════════
 */

/** Configuration de navigation mobile */
export const MOBILE_TABS: readonly TabConfig[] = [
  {
    id: 'dashboard',
    name: 'Dashboard',
    icon: '🏠',
    ariaLabel: 'Dashboard overview'
  },
  {
    id: 'track',
    name: 'Track',
    icon: '🏃',
    ariaLabel: 'Start tracking ride'
  },
  {
    id: 'nft',
    name: 'NFTs',
    icon: '🎨',
    ariaLabel: 'View NFT collection'
  },
  {
    id: 'profile',
    name: 'Profile',
    icon: '👤',
    ariaLabel: 'User profile settings'
  }
] as const;

/** Raretés NFT avec poids */
export const NFT_RARITIES: Record<NFTRarity, { readonly weight: number; readonly color: string }> = {
  common: { weight: 0.5, color: '#808080' },
  uncommon: { weight: 0.25, color: '#2ecc71' },
  rare: { weight: 0.15, color: '#3498db' },
  epic: { weight: 0.08, color: '#9b59b6' },
  legendary: { weight: 0.02, color: '#f39c12' }
} as const;

/** Durations par défaut */
export const NOTIFICATION_DURATIONS = {
  SUCCESS: 3000,
  INFO: 4000,
  WARNING: 5000,
  ERROR: 6000
} as const;

export type NotificationDuration = typeof NOTIFICATION_DURATIONS[keyof typeof NOTIFICATION_DURATIONS];
