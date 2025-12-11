// FIX: Create Marketplace.tsx component to display a grid of NFT bikes for sale, resolving import errors.
import React from 'react';
import { getMarketplaceBikes } from '../constants';
import { MarketplaceBikeCard } from './MarketplaceBikeCard';
import { useTranslation } from '../context/LanguageContext';

export const Marketplace: React.FC = () => {
    const { t } = useTranslation();
    const marketplaceBikes = getMarketplaceBikes(t);

    return (
        <div>
            <p className="text-center max-w-2xl mx-auto text-brand-muted mb-12">
                {t('marketplace.description')}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {marketplaceBikes.map(bike => (
                    <MarketplaceBikeCard key={bike.id} bike={bike} />
                ))}
            </div>
        </div>
    );
};