import React from 'react';

interface ChartCardProps {
    title: string;
    children: React.ReactNode;
    className?: string;
}

export const ChartCard: React.FC<ChartCardProps> = ({ title, children, className = '' }) => {
    return (
        <div className={`bg-brand-surface p-6 rounded-xl border border-gray-700/50 h-full ${className}`}>
            <h4 className="text-lg font-bold text-white mb-4">{title}</h4>
            {children}
        </div>
    );
};