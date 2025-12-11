import React from 'react';
import type { RideHistoryEntry } from '../types';
import { RideHistoryItem } from './RideHistoryItem';
import { RunIcon } from './icons/Icons';
import { useTranslation } from '../context/LanguageContext';

interface RideDetailsProps {
    history: RideHistoryEntry[];
    totalHistoryCount: number;
    onLoadMore: () => void;
}

export const RideDetails: React.FC<RideDetailsProps> = ({ history, totalHistoryCount, onLoadMore }) => {
    const { t } = useTranslation();
    return (
        <div className="bg-brand-surface rounded-xl border border-gray-700/50 shadow-lg p-6 h-full flex flex-col">
            <h3 className="text-xl font-bold mb-4">{t('rideHistory.title')}</h3>
            {history.length > 0 ? (
                 <>
                    <div className="space-y-4 max-h-[540px] overflow-y-auto pr-2 flex-grow">
                        {history.map(item => (
                            <RideHistoryItem key={item.id} item={item} />
                        ))}
                    </div>
                    {history.length < totalHistoryCount && (
                        <div className="mt-4 pt-4 border-t border-gray-700/50">
                            <button
                                onClick={onLoadMore}
                                className="w-full bg-brand-purple/50 hover:bg-brand-purple/80 text-white font-semibold py-2 rounded-lg transition-colors"
                            >
                                {t('rideHistory.loadMore')}
                            </button>
                        </div>
                    )}
                </>
            ) : (
                <div className="flex flex-col items-center justify-center h-full text-center text-brand-muted py-8">
                    <RunIcon className="w-12 h-12 mb-4" />
                    <p className="font-semibold">{t('rideHistory.noRides')}</p>
                    <p className="text-sm">{t('rideHistory.noRidesHint')}</p>
                </div>
            )}
        </div>
    );
};