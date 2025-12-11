import React, { useState } from 'react';
import { UrbanHeader } from './UrbanHeader';
import { UrbanOverview } from './UrbanOverview';
import { UrbanAnalytics } from './UrbanAnalytics';
import { UrbanPerformance } from './UrbanPerformance';
import { EcologicalImpact } from './EcologicalImpact';
import type { UrbanTab } from './UrbanHeader';

export const UrbanDashboard: React.FC = () => {
    const [activeTab, setActiveTab] = useState<UrbanTab>('Vue d\'ensemble');

    const renderContent = () => {
        switch (activeTab) {
            case 'Vue d\'ensemble':
                return <UrbanOverview />;
            case 'Analytiques':
                return <UrbanAnalytics />;
            case 'Performance Urbaine':
                return <UrbanPerformance />;
            case 'Impact Écologique':
                return <EcologicalImpact />;
            default:
                return <UrbanOverview />;
        }
    };

    return (
        <div className="bg-brand-surface rounded-xl border border-gray-700/50 shadow-lg p-4 sm:p-6 space-y-6">
            <UrbanHeader activeTab={activeTab} setActiveTab={setActiveTab} />
            <div className="mt-4">
                {renderContent()}
            </div>
        </div>
    );
};
