import React from 'react';
import { getUrbanAnalyticsData } from '../../urbanConstants';
import { UrbanStatCard, TitledSection } from './UrbanSharedComponents';
import { AnnualPerformanceChart, TokenEconomicsChart } from './UrbanCharts';
import { useTranslation } from '../../context/LanguageContext';

export const UrbanOverview: React.FC = () => {
    const { t } = useTranslation();
    const data = getUrbanAnalyticsData(t);

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <UrbanStatCard 
                    label={t('urban.overview.totalRides')} 
                    value={data.overviewMetrics.totalRides.value.toLocaleString()} 
                    icon={data.overviewMetrics.totalRides.icon}
                />
                 <UrbanStatCard 
                    label={t('urban.overview.totalDistance')} 
                    value={data.overviewMetrics.totalDistance.value.toLocaleString()} 
                    icon={data.overviewMetrics.totalDistance.icon}
                />
                 <UrbanStatCard 
                    label={t('urban.overview.totalHours')} 
                    value={data.overviewMetrics.totalHours.value.toLocaleString()} 
                    icon={data.overviewMetrics.totalHours.icon}
                />
                 <div className="bg-brand-bg/50 p-4 rounded-lg">
                    <p className="text-2xl sm:text-3xl font-bold text-white">{data.overviewMetrics.avgDistance.value} km</p>
                    <p className="text-sm text-brand-muted">{t('urban.overview.avgDistance')}</p>
                    <p className="text-green-400 font-semibold text-sm mt-1">+{data.overviewMetrics.avgDistance.change}%</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <TitledSection title={t('urban.overview.annualPerformance.title')}>
                    <p className="text-sm text-brand-muted -mt-4 mb-4">{t('urban.overview.annualPerformance.subtitle')}</p>
                    <AnnualPerformanceChart data={data.annualPerformance} />
                </TitledSection>
                 <TitledSection title={t('urban.overview.tokenomics.title')}>
                     <p className="text-sm text-brand-muted -mt-4 mb-4">{t('urban.overview.tokenomics.subtitle')}</p>
                    <div className="flex justify-around text-center mb-4">
                        <div>
                            <p className="text-xl font-bold text-brand-purple">{data.tokenMetrics.totalEarned.toLocaleString()}</p>
                            <p className="text-xs text-brand-muted">{t('urban.overview.tokenomics.tokensEarned')}</p>
                            <p className="text-xs text-green-400">+{data.tokenMetrics.earnedThisWeek} {t('urban.overview.tokenomics.thisWeek')}</p>
                        </div>
                        <div>
                            <p className="text-xl font-bold">{data.tokenMetrics.avgTokensPerKm}</p>
                            <p className="text-xs text-brand-muted">{t('urban.overview.tokenomics.avgTokens')}</p>
                        </div>
                         <div>
                            <p className="text-xl font-bold text-brand-cyan">{data.tokenMetrics.urbanGrade}</p>
                            <p className="text-xs text-brand-muted">{t('urban.overview.tokenomics.urbanGrade')}</p>
                        </div>
                    </div>
                    <TokenEconomicsChart data={data.tokenEconomics} />
                </TitledSection>
            </div>
        </div>
    );
};