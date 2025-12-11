import React from 'react';
import { BicycleIcon } from './icons/Icons';
import { IpfsStatus } from './IpfsStatus';
import { useTranslation } from '../context/LanguageContext';


export const Footer: React.FC = () => {
  const { t } = useTranslation();
  return (
    <footer className="bg-brand-surface border-t border-gray-700/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <IpfsStatus />

        <div className="flex flex-col md:flex-row justify-between items-center mt-8 pt-8 border-t border-gray-700/50">
          <div className="flex items-center mb-4 md:mb-0">
            <BicycleIcon className="h-7 w-7 text-brand-cyan" />
            <span className="ml-2 text-xl font-bold">FixieRun</span>
          </div>
          <p className="text-brand-muted text-sm">{t('footer.copyright', { year: new Date().getFullYear() })}</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            {/* Replace with actual social links */}
            <a href="#whitepaper" className="text-brand-muted hover:text-brand-cyan transition-colors">{t('footer.roadmap')}</a>
            <a href="#" className="text-brand-muted hover:text-brand-cyan transition-colors">{t('footer.social.twitter')}</a>
            <a href="#" className="text-brand-muted hover:text-brand-cyan transition-colors">{t('footer.social.discord')}</a>
            <a href="#" className="text-brand-muted hover:text-brand-cyan transition-colors">{t('footer.social.telegram')}</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
