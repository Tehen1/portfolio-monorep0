import { useState, useEffect, useRef } from 'react';
import type { GeoPoint } from '../../types';

export interface UseRideStatsReturn {
  isTracking: boolean;
  track: GeoPoint[];
  laps: number[];
  isSupported: boolean;
  error: string | null;
  startTracking: () => void;
  stopTracking: () => Promise<void>;
  markLap: () => void;
  clearTrack: () => void;
}

export const useRideStats = (
  onTrackComplete?: (track: GeoPoint[], laps: number[]) => void
): UseRideStatsReturn => {
  const [isTracking, setIsTracking] = useState(false);
  const [track, setTrack] = useState<GeoPoint[]>([]);
  const [laps, setLaps] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);
  const watchIdRef = useRef<number | null>(null);

  const isSupported = 'geolocation' in navigator;

  const startTracking = () => {
    setError(null);
    
    if (!isSupported) {
      setError("La géolocalisation n'est pas supportée par votre navigateur.");
      return;
    }

    setIsTracking(true);
    setTrack([]);
    setLaps([]);
    
    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        const newPoint: GeoPoint = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          timestamp: position.timestamp,
        };
        setTrack(prevTrack => [...prevTrack, newPoint]);
      },
      (err) => {
        const errorMessage = getGeoErrorMessage(err);
        setError(errorMessage);
        setIsTracking(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const stopTracking = async (): Promise<void> => {
    setIsTracking(false);
    
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }

    if (track.length < 2) {
      setError("Pas assez de données de piste pour analyser le trajet.");
      return;
    }

    if (onTrackComplete) {
      onTrackComplete(track, laps);
    }
  };

  const markLap = () => {
    if (track.length > 0) {
      setLaps(prev => [...prev, Date.now()]);
    }
  };

  const clearTrack = () => {
    setTrack([]);
    setLaps([]);
    setError(null);
  };

  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  return {
    isTracking,
    track,
    laps,
    isSupported,
    error,
    startTracking,
    stopTracking,
    markLap,
    clearTrack,
  };
};

const getGeoErrorMessage = (err: GeolocationPositionError): string => {
  switch (err.code) {
    case err.PERMISSION_DENIED:
      return "L'accès à la géolocalisation a été refusé.";
    case err.POSITION_UNAVAILABLE:
      return "La position géographique n'est pas disponible.";
    case err.TIMEOUT:
      return "Le délai d'attente pour obtenir la position a expiré.";
    default:
      return "Une erreur de géolocalisation s'est produite.";
  }
};