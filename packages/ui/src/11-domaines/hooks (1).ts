/**
 * @fileoverview Hooks React optimisés avec memoization et type-safety
 * @description Hooks personnalisés pour FixieRun avec useCallback, memoization et cleanup
 * @author FixieRun Development Team
 * @version 1.0.0
 * @license MIT
 */

import {
  useState,
  useEffect,
  useCallback,
  useRef,
  Dispatch,
  SetStateAction,
  DependencyList
} from 'react';

import type {
  ActiveTab,
  AsyncState,
  AsyncResult,
  GeoLocation,
  TrackingSession,
  NFTMetadata,
  EquippedNFT,
  FilterOptions,
  Notification,
  NotificationType,
  UserProfile,
  NFTFilterRarity,
  NFTFilterTerrain,
  NFTSortBy
} from './types';

import {
  NOTIFICATION_DURATIONS,
  isActiveTab,
  isEthereumAddress
} from './types';

/**
 * ═══════════════════════════════════════════════════════════════
 * 1. HOOKS DE TRACKING GPS
 * ═══════════════════════════════════════════════════════════════
 */

/**
 * Hook pour gérer le suivi GPS avec cleanup automatique
 * @param enabled - Active/désactive le suivi
 * @returns Position actuelle et erreurs
 */
export const useGeoTracking = (enabled: boolean) => {
  const [location, setLocation] = useState<GeoLocation | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const watchIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled || !('geolocation' in navigator)) {
      setError(new Error('Geolocation not available'));
      return;
    }

    // Démarrer le suivi GPS
    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          altitude: position.coords.altitude,
          timestamp: new Date(position.timestamp)
        });
        setError(null);
      },
      (err) => {
        setError(new Error(`Geolocation error: ${err.message}`));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );

    // Cleanup: arrêter le suivi
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, [enabled]);

  return { location, error };
};

/**
 * Hook pour calculer distance et vitesse avec memoization
 * @param locations - Liste des positions
 * @returns Métriques de distance, vitesse, etc.
 */
export const useTrackingMetrics = (locations: GeoLocation[]) => {
  return useCallback(() => {
    if (locations.length < 2) {
      return {
        totalDistance: 0,
        averageSpeed: 0,
        maxSpeed: 0,
        elevation: 0
      };
    }

    let totalDistance = 0;
    let maxSpeed = 0;
    let totalTime = 0;

    for (let i = 1; i < locations.length; i++) {
      const prev = locations[i - 1];
      const curr = locations[i];

      // Haversine formula pour distance
      const R = 6371; // km
      const dLat = ((curr.latitude - prev.latitude) * Math.PI) / 180;
      const dLon = ((curr.longitude - prev.longitude) * Math.PI) / 180;

      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((prev.latitude * Math.PI) / 180) *
          Math.cos((curr.latitude * Math.PI) / 180) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);

      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = R * c;

      totalDistance += distance;

      // Calculer vitesse
      const timeMs = curr.timestamp.getTime() - prev.timestamp.getTime();
      if (timeMs > 0) {
        const speedKmh = (distance / timeMs) * 3600000;
        maxSpeed = Math.max(maxSpeed, speedKmh);
        totalTime += timeMs;
      }
    }

    const averageSpeed = totalTime > 0 ? (totalDistance / totalTime) * 3600000 : 0;

    return {
      totalDistance: Math.round(totalDistance * 100) / 100,
      averageSpeed: Math.round(averageSpeed * 100) / 100,
      maxSpeed: Math.round(maxSpeed * 100) / 100,
      elevation: 0 // À implémenter avec API externe
    };
  }, [locations]);
};

/**
 * ═══════════════════════════════════════════════════════════════
 * 2. HOOKS DE GESTION D'ÉTAT ASYNC
 * ═══════════════════════════════════════════════════════════════
 */

/**
 * Hook pour gérer les opérations async avec état chargement
 * @template T - Type de donnée
 * @param asyncFn - Fonction async à exécuter
 * @param deps - Dépendances
 * @returns Données, état chargement, erreur
 */
export const useAsync = <T,>(
  asyncFn: () => Promise<T>,
  deps: DependencyList
): AsyncResult<T> => {
  const [data, setData] = useState<T | null>(null);
  const [state, setState] = useState<AsyncState>('idle');
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setState('loading');
        const result = await asyncFn();
        if (mounted) {
          setData(result);
          setState('success');
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err : new Error(String(err)));
          setState('error');
        }
      }
    })();

    return () => {
      mounted = false;
    };
  }, deps);

  return {
    state,
    data,
    error,
    isLoading: state === 'loading'
  };
};

/**
 * ═══════════════════════════════════════════════════════════════
 * 3. HOOKS DE GESTION NFT
 * ═══════════════════════════════════════════════════════════════
 */

/**
 * Hook pour gérer l'équipement NFT avec validation
 * @param nfts - Liste des NFTs
 * @returns Fonctions d'équipement
 */
export const useNFTEquipment = (nfts: NFTMetadata[], onEquip?: (nftId: string) => Promise<void>) => {
  const equipNFT = useCallback(
    async (nftId: string) => {
      // Validation
      if (!nfts.some((nft) => nft.id === nftId)) {
        throw new Error(`NFT ${nftId} not found`);
      }

      if (onEquip) {
        await onEquip(nftId);
      }
    },
    [nfts, onEquip]
  );

  const unequipNFT = useCallback(async () => {
    if (onEquip) {
      await onEquip('');
    }
  }, [onEquip]);

  return { equipNFT, unequipNFT };
};

/**
 * Hook pour filtrer et trier les NFTs
 * @param nfts - Liste des NFTs
 * @param filters - Options de filtrage
 * @returns NFTs filtrés et triés
 */
export const useNFTFiltering = (nfts: NFTMetadata[], filters: FilterOptions) => {
  return useCallback(() => {
    let filtered = [...nfts];

    // Filtrer par rareté
    if (filters.rarity !== 'all') {
      filtered = filtered.filter((nft) => nft.rarity === filters.rarity);
    }

    // Filtrer par terrain
    if (filters.terrain !== 'all') {
      filtered = filtered.filter((nft) => nft.terrain === filters.terrain);
    }

    // Trier
    switch (filters.sortBy) {
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'rarity':
        const rarityOrder: Record<string, number> = {
          legendary: 5,
          epic: 4,
          rare: 3,
          uncommon: 2,
          common: 1
        };
        filtered.sort((a, b) => (rarityOrder[b.rarity] || 0) - (rarityOrder[a.rarity] || 0));
        break;
      case 'equipped':
        filtered.sort((a, b) => (b.equipped ? 1 : 0) - (a.equipped ? 1 : 0));
        break;
      case 'recent':
        filtered.sort((a, b) => b.mintedAt.getTime() - a.mintedAt.getTime());
        break;
    }

    return filtered;
  }, [nfts, filters]);
};

/**
 * ═══════════════════════════════════════════════════════════════
 * 4. HOOKS DE NOTIFICATIONS
 * ═══════════════════════════════════════════════════════════════
 */

/**
 * Hook pour gérer les notifications avec auto-dismiss
 * @returns Notifications et fonctions
 */
export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const timeoutsRef = useRef<Map<string, NodeJS.Timeout>>(new Map());

  const addNotification = useCallback(
    (type: NotificationType, message: string, duration?: number) => {
      const id = `${Date.now()}-${Math.random()}`;
      const finalDuration = duration || NOTIFICATION_DURATIONS[type.toUpperCase() as keyof typeof NOTIFICATION_DURATIONS];

      const notification: Notification = {
        id,
        type,
        message,
        duration: finalDuration,
        timestamp: new Date(),
        dismissible: true
      };

      setNotifications((prev) => [...prev, notification]);

      // Auto-dismiss
      const timeout = setTimeout(() => {
        dismissNotification(id);
      }, finalDuration);

      timeoutsRef.current.set(id, timeout);
    },
    []
  );

  const dismissNotification = useCallback((id: string) => {
    const timeout = timeoutsRef.current.get(id);
    if (timeout) {
      clearTimeout(timeout);
      timeoutsRef.current.delete(id);
    }
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  // Cleanup all timeouts on unmount
  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach((timeout) => clearTimeout(timeout));
      timeoutsRef.current.clear();
    };
  }, []);

  return { notifications, addNotification, dismissNotification };
};

/**
 * ═══════════════════════════════════════════════════════════════
 * 5. HOOKS DE NAVIGATION
 * ═══════════════════════════════════════════════════════════════
 */

/**
 * Hook pour gérer l'onglet actif avec validation
 * @param initialTab - Onglet initial
 * @returns Onglet actif et setter
 */
export const useActiveTab = (
  initialTab: ActiveTab = 'dashboard'
): [ActiveTab, (tab: ActiveTab) => void] => {
  const [activeTab, setActiveTab] = useState<ActiveTab>(initialTab);

  const setTabSafely = useCallback((tab: unknown) => {
    if (isActiveTab(tab)) {
      setActiveTab(tab);
    } else {
      console.warn(`Invalid tab: ${tab}`);
    }
  }, []);

  return [activeTab, setTabSafely];
};

/**
 * ═══════════════════════════════════════════════════════════════
 * 6. HOOKS DE LOCALSTORAGE
 * ═══════════════════════════════════════════════════════════════
 */

/**
 * Hook pour persister l'état en localStorage
 * @template T - Type de donnée
 * @param key - Clé localStorage
 * @param initialValue - Valeur initiale
 * @returns Valeur et setter
 */
export const useLocalStorage = <T,>(
  key: string,
  initialValue: T
): [T, Dispatch<SetStateAction<T>>] => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = typeof window !== 'undefined' ? window.localStorage.getItem(key) : null;
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: SetStateAction<T>) => {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }
      } catch (err) {
        console.error(`Error saving to localStorage [${key}]:`, err);
      }
    },
    [key, storedValue]
  );

  return [storedValue, setValue];
};

/**
 * ═══════════════════════════════════════════════════════════════
 * 7. HOOKS DE DEBOUNCE
 * ═══════════════════════════════════════════════════════════════
 */

/**
 * Hook pour debouncer une valeur
 * @template T - Type de donnée
 * @param value - Valeur à debouncer
 * @param delay - Délai en ms
 * @returns Valeur debounced
 */
export const useDebounce = <T,>(value: T, delay: number = 500): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};

/**
 * ═══════════════════════════════════════════════════════════════
 * 8. HOOKS DE VALIDATION
 * ═══════════════════════════════════════════════════════════════
 */

/**
 * Hook pour valider une adresse Ethereum
 * @param address - Adresse à valider
 * @returns Booléen de validité
 */
export const useValidateEthAddress = (address: string) => {
  return useCallback(() => {
    return isEthereumAddress(address as `0x${string}`);
  }, [address]);
};
