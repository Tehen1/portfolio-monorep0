import React from 'react';
import { BicycleIcon, ZapIcon, MountainIcon, TreeIcon } from '../icons/Icons';
import { useTranslation } from '../../context/LanguageContext';

export type UrbanTab = 'Vue d\'ensemble' | 'Analytiques' | 'Performance Urbaine' | 'Impact Écologique';

interface UrbanHeaderProps {
    activeTab: UrbanTab;
    setActiveTab: (tab: UrbanTab) => void;
}

export const UrbanHeader: React.FC<UrbanHeaderProps> = ({ activeTab, setActiveTab }) => {
    const { t } = useTranslation();

    const tabs: { name: UrbanTab; icon: React.ReactNode; label: string }[] = [
        { name: 'Vue d\'ensemble', icon: <BicycleIcon className="w-4 h-4 mr-2" />, label: t('urban.tabs.overview') },
        { name: 'Analytiques', icon: <ZapIcon className="w-4 h-4 mr-2" />, label: t('urban.tabs.analytics') },
        { name: 'Performance Urbaine', icon: <MountainIcon className="w-4 h-4 mr-2" />, label: t('urban.tabs.performance') },
        { name: 'Impact Écologique', icon: <TreeIcon className="w-4 h-4 mr-2" />, label: t('urban.tabs.impact') },
    ];
    
    return (
        <div className="overflow-x-auto">
            <div className="flex border-b border-gray-700/50 space-x-2 sm:space-x-4">
                {tabs.map(tab => (
                    <button
                        key={tab.name}
                        onClick={() => setActiveTab(tab.name)}
                        className={`flex-shrink-0 flex items-center px-3 sm:px-4 py-3 text-sm sm:text-base font-semibold transition-colors duration-200 ${
                            activeTab === tab.name
                                ? 'border-b-2 border-brand-cyan text-white'
                                : 'border-b-2 border-transparent text-brand-muted hover:text-white'
                        }`}
                    >
                        {tab.icon}
                        {tab.label}
                    </button>
                ))}
            </div>
        </div>
    );
};