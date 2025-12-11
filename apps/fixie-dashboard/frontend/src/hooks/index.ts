// Exporte tous les hooks personnalisés pour faciliter les imports
export { useGeolocation } from './useGeolocation';
export { useAIWeather } from './useAIWeather';
export { useRideAnalysis } from './useRideAnalysis';
export { useRideStats } from './useRideStats';

// Types pour l'export
export type { 
  Position as GeolocationPosition,
  UseGeolocationReturn,
  WeatherData as WeatherDataType,
  UseAIWeatherReturn,
  UseRideAnalysisReturn,
  UseRideStatsReturn
};