// FIX: Create MarketplaceBikeCard.tsx component to render individual bikes in the marketplace, resolving import errors.
import React from 'react';
import { Link } from 'react-router-dom';
import type { NftBike, Rarity } from '../types';
import { useTranslation } from '../context/LanguageContext';

interface MarketplaceBikeCardProps {
  bike: NftBike;
}

const rarityStyles: Record<Rarity, { bg: string; text: string; border: string; borderTop: string; }> = {
  Common: { bg: 'bg-gray-500/20', text: 'text-gray-300', border: 'border-gray-700/50', borderTop: 'border-t-gray-500' },
  Uncommon: { bg: 'bg-green-500/20', text: 'text-green-400', border: 'border-green-600/50', borderTop: 'border-t-green-500' },
  Rare: { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-600/50', borderTop: 'border-t-blue-500' },
  Epic: { bg: 'bg-purple-500/20', text: 'text-purple-400', border: 'border-purple-600/50', borderTop: 'border-t-purple-500' },
};

export const MarketplaceBikeCard: React.FC<MarketplaceBikeCardProps> = ({ bike }) => {
  const { t } = useTranslation();
  const rarity = bike.rarity || 'Common';
  const styles = rarityStyles[rarity];

  return (
    <Link to={`/marketplace/${bike.id}`} className="block h-full group">
      <div className={`bg-brand-surface rounded-xl border ${styles.border} border-t-2 ${styles.borderTop} shadow-lg overflow-hidden h-full flex flex-col transition-all duration-300 group-hover:shadow-cyan-500/20 group-hover:border-cyan-500/50 group-hover:-translate-y-1`}>
        <div className="relative">
          <img src={bike.imageUrl} alt={bike.name} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" />
          <div className={`absolute top-2 right-2 text-xs font-semibold px-2 py-0.5 rounded-full ${styles.bg} ${styles.text}`}>
            {t(`rarity.${rarity.toLowerCase()}`)}
          </div>
        </div>
        <div className="p-4 flex flex-col flex-grow">
          <div className="flex justify-between items-start">
              <h3 className="text-lg font-bold truncate">{bike.name}</h3>
              <span className="bg-brand-purple text-white text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ml-2">
                  {t('nftCard.levelAbbr')} {bike.level}
              </span>
          </div>
          <div className="mt-auto pt-4 flex justify-between items-center">
              <div>
                  <p className="text-xs text-brand-muted">{t('marketplace.price')}</p>
                  <p className="font-bold text-white">{bike.price?.toFixed(2)} ETH</p>
              </div>
              <div className="bg-brand-cyan text-brand-bg font-bold py-1 px-4 rounded-lg text-sm transition-colors group-hover:bg-opacity-80">
                  {t('marketplace.buy')}
              </div>
          </div>
        </div>
      </div>
    </Link>
  );
};