
import React from 'react';
import { ExclamationTriangleIcon } from './icons/Icons';
import { useTranslation } from '../context/LanguageContext';

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: 'cyan' | 'purple' | 'amber';
}

const colorClasses = {
    cyan: 'bg-cyan-500/10 text-cyan-400',
    purple: 'bg-purple-500/10 text-purple-400',
    amber: 'bg-amber-500/10 text-amber-400',
}

export const StatCard: React.FC<StatCardProps> = ({ icon, label, value, color }) => {
  return (
    <div className="bg-brand-surface p-4 rounded-lg flex items-center border border-gray-700/50">
      <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${colorClasses[color]}`}>
        {icon}
      </div>
      <div className="ml-4">
        <p className="text-sm text-brand-muted">{label}</p>
        <p className="text-xl font-bold text-white">{value}</p>
      </div>
    </div>
  );
};

interface ErrorMessageProps {
  message: string | null;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  const { t } = useTranslation();
  if (!message) return null;
  return (
    <div className="bg-red-900/50 border border-red-500 text-red-300 p-4 rounded-lg flex items-start gap-3">
      <ExclamationTriangleIcon className="w-6 h-6 flex-shrink-0 mt-0.5" />
      <div>
        <p className="font-bold">{t('errors.title')}</p>
        <p className="text-sm">{message}</p>
      </div>
    </div>
  );
};