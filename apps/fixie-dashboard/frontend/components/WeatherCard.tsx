import React from 'react';
import { SunIcon, CloudIcon, CloudDrizzleIcon, SnowIcon, WindIcon, ZapIcon } from './icons/Icons';
import { useTranslation } from '../context/LanguageContext';

export type WeatherCondition = 'Sunny' | 'Cloudy' | 'Rain' | 'Snow' | 'Windy' | 'Thunderstorm';

interface WeatherData {
    condition: WeatherCondition;
    temperature: number;
    forecast: string;
}

interface WeatherCardProps {
    weather: WeatherData | null;
    isFetching: boolean;
    error: string | null;
}

export const WeatherCard: React.FC<WeatherCardProps> = ({ weather, isFetching, error }) => {
    const { t } = useTranslation();
    
    const renderContent = () => {
        if (isFetching) {
            return (
                <div className="flex flex-col items-center justify-center h-full">
                    <svg className="animate-spin h-8 w-8 text-brand-cyan" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="mt-2 text-brand-muted">{t('weather.fetching')}...</p>
                </div>
            );
        }

        if (error && !weather) { // Only show error if there's no fallback weather
            return (
                <div className="flex flex-col items-center justify-center h-full text-center">
                    <p className="text-red-400 font-semibold">{t('weather.unavailable')}</p>
                    <p className="text-xs text-brand-muted mt-1">{error}</p>
                </div>
            );
        }

        if (weather) {
            const weatherIcons: Record<WeatherCondition, React.ReactNode> = {
                Sunny: <SunIcon className="w-12 h-12 text-yellow-400" />,
                Cloudy: <CloudIcon className="w-12 h-12 text-gray-400" />,
                Rain: <CloudDrizzleIcon className="w-12 h-12 text-cyan-400" />,
                Snow: <SnowIcon className="w-12 h-12 text-white" />,
                Windy: <WindIcon className="w-12 h-12 text-gray-300" />,
                Thunderstorm: <ZapIcon className="w-12 h-12 text-amber-400" />,
            };
            return (
                <div className="flex flex-col h-full">
                    <div className="flex items-center gap-4">
                        {weatherIcons[weather.condition]}
                        <div>
                            <p className="text-4xl font-bold">{weather.temperature}°C</p>
                            <p className="font-semibold text-brand-muted">{t(`weather.conditions.${weather.condition.toLowerCase()}`)}</p>
                        </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-700/50 flex-grow flex items-center">
                        <p className="text-gray-300 text-center text-sm italic">"{weather.forecast}"</p>
                    </div>
                </div>
            );
        }

        return null;
    }

    return (
        <div className="bg-brand-surface rounded-xl border border-gray-700/50 shadow-lg p-6 h-full min-h-[150px]">
            <h3 className="text-xl font-bold mb-4">{t('weather.title')}</h3>
            {renderContent()}
        </div>
    );
};