import React from 'react';
import { getUrbanAnalyticsData } from '../../urbanConstants';
import { getIcon } from './UrbanSharedComponents';
import { useTranslation } from '../../context/LanguageContext';

const ImpactCard: React.FC<{
    icon: 'tree' | 'fuel';
    value: string;
    label: string;
    subLabel: string;
    changeLabel: string;
    iconColor: string;
}> = ({ icon, value, label, subLabel, changeLabel, iconColor }) => (
    <div className="bg-brand-bg/50 rounded-xl p-6 text-center flex flex-col items-center">
        {getIcon(icon, `w-16 h-16 ${iconColor}`)}
        <p className="text-4xl font-black text-white mt-4">{value}</p>
        <p className="text-lg font-semibold text-brand-muted">{label}</p>
        <p className="text-sm text-gray-400 mt-2">{subLabel}</p>
        <p className="text-sm font-semibold text-green-400 mt-1">{changeLabel}</p>
    </div>
);

export const EcologicalImpact: React.FC = () => {
    const { t } = useTranslation();
    const data = getUrbanAnalyticsData(t).ecologicalImpact;

    return (
        <div className="space-y-6">
            <div className="text-center">
                 <h3 className="text-2xl font-bold">{t('urban.impact.title')}</h3>
                 <p className="text-brand-muted">{t('urban.impact.subtitle')}</p>
            </div>

            <div className="bg-brand-bg/50 rounded-xl p-6 text-center flex flex-col items-center">
                {getIcon('tree', 'w-20 h-20 text-green-400 opacity-50 absolute -z-1')}
                <p className="text-6xl font-black text-white">{data.co2Saved.value.toLocaleString()}<span className="text-3xl text-brand-muted align-top">kg</span></p>
                <p className="text-xl font-bold text-green-400 mt-2">{t('urban.impact.co2.label')}</p>
                <p className="text-base text-brand-muted">{data.co2Saved.subLabel}</p>
                <div className="mt-4 bg-brand-surface/50 px-4 py-1 rounded-full text-sm">
                    {t('urban.impact.co2.dailyImpact')}: <span className="font-bold text-white">{data.co2Saved.dailyImpact} kg CO₂</span>
                </div>
            </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ImpactCard 
                    icon="tree"
                    value={data.treeEquivalent.value.toString()}
                    label={t('urban.impact.trees.label')}
                    subLabel={data.treeEquivalent.subLabel}
                    changeLabel={`+${data.treeEquivalent.monthlyChange} ${t('urban.impact.trees.changeLabel')}`}
                    iconColor="text-green-500"
                />
                 <ImpactCard 
                    icon="fuel"
                    value={`${data.fuelSaved.value.toLocaleString()} L`}
                    label={t('urban.impact.fuel.label')}
                    subLabel={data.fuelSaved.subLabel}
                    changeLabel={`${t('urban.impact.fuel.changeLabel')}: ${data.fuelSaved.monthlySavings} L`}
                    iconColor="text-amber-500"
                />
            </div>
        </div>
    );
};