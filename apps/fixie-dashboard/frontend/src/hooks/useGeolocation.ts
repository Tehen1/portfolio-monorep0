import { useState, useEffect, useRef } from 'react';

export interface Position {
  latitude: number;
  longitude: number;
}

export interface UseGeolocationReturn {
  position: Position | null;
  isSupported: boolean;
  error: string | null;
  isLoading: boolean;
  getCurrentPosition: () => void;
}

export const useGeolocation = (): UseGeolocationReturn => {
  const [position, setPosition] = useState<Position | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const watchIdRef = useRef<number | null>(null);

  const isSupported = 'geolocation' in navigator;

  const getCurrentPosition = () => {
    if (!isSupported) {
      setError("La géolocalisation n'est pas supportée par votre navigateur.");
      return;
    }

    setIsLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setPosition({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setIsLoading(false);
      },
      (err) => {
        const errorMessage = getErrorMessage(err);
        setError(errorMessage);
        setIsLoading(false);
      }
    );
  };

  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  return {
    position,
    isSupported,
    error,
    isLoading,
    getCurrentPosition,
  };
};

const getErrorMessage = (err: GeolocationPositionError): string => {
  switch (err.code) {
    case err.PERMISSION_DENIED:
      return "L'accès à la géolocalisation a été refusé.";
    case err.POSITION_UNAVAILABLE:
      return "La position géographique n'est pas disponible.";
    case err.TIMEOUT:
      return "Le délai d'attente pour obtenir la position a expiré.";
    default:
      return "Une erreur inconnue s'est produite.";
  }
};