import React from 'react';
import type { Metric } from '../../types';
import { ArrowUpIcon, ArrowDownIcon } from '../icons/Icons';
import { useTranslation } from '../../context/LanguageContext';

interface MetricCardProps {
    title: string;
    metric: Metric;
    icon?: React.ReactNode;
}

export const MetricCard: React.FC<MetricCardProps> = ({ title, metric, icon }) => {
    const { t } = useTranslation();
    const isPositive = metric.change >= 0;

    return (
        <div className="bg-brand-surface p-5 rounded-xl border border-gray-700/50">
            <p className="text-brand-muted text-sm font-medium">{title}</p>
            <div className="mt-2 flex items-baseline gap-2">
                {icon}
                <p className="text-3xl font-bold text-white">{metric.value}</p>
            </div>
            <div className={`mt-2 flex items-center text-sm ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                {isPositive ? <ArrowUpIcon className="w-4 h-4" /> : <ArrowDownIcon className="w-4 h-4" />}
                <span className="font-semibold ml-1">{Math.abs(metric.change)}%</span>
                <span className="text-brand-muted ml-1.5">{t('analytics.metrics.comparison')}</span>
            </div>
        </div>
    );
};