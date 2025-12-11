import React from 'react';
import { CoinsIcon, LevelUpIcon, AiSparklesIcon, ZapIcon, CommunityIcon, WalletIcon } from './icons/Icons';
import { useTranslation } from '../context/LanguageContext';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => (
  <div className="bg-brand-surface p-6 rounded-xl border border-gray-700/50 transform transition-transform duration-300 hover:-translate-y-1">
    <div className="flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center bg-brand-bg mb-4">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
    <p className="text-brand-muted">{description}</p>
  </div>
);

export const Features: React.FC = () => {
  const { t } = useTranslation();

  const features = [
    {
      icon: <CoinsIcon className="w-7 h-7 text-brand-cyan" />,
      title: t('features.m2e.title'),
      description: t('features.m2e.description')
    },
    {
      icon: <LevelUpIcon className="w-7 h-7 text-brand-cyan" />,
      title: t('features.evolvingNfts.title'),
      description: t('features.evolvingNfts.description')
    },
    {
      icon: <AiSparklesIcon className="w-7 h-7 text-brand-cyan" />,
      title: t('features.aiAnalytics.title'),
      description: t('features.aiAnalytics.description')
    },
    {
      icon: <ZapIcon className="w-7 h-7 text-brand-cyan" />,
      title: t('features.zkEvm.title'),
      description: t('features.zkEvm.description')
    },
    {
      icon: <CommunityIcon className="w-7 h-7 text-brand-cyan" />,
      title: t('features.socialChallenges.title'),
      description: t('features.socialChallenges.description')
    },
    {
      icon: <WalletIcon className="w-7 h-7 text-brand-cyan" />,
      title: t('features.assetOwnership.title'),
      description: t('features.assetOwnership.description')
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {features.map((feature, index) => (
        <FeatureCard key={index} {...feature} />
      ))}
    </div>
  );
};