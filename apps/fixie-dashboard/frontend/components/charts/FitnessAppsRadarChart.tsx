import React from 'react';
import { Radar, RadarChart, PolarGrid, Legend, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { getFitnessAppsRadarData } from '../../constants';
import { useTranslation } from '../../context/LanguageContext';

export const FitnessAppsRadarChart: React.FC = () => {
  const { t } = useTranslation();
  const data = getFitnessAppsRadarData(t);
  
  return (
    <div style={{ width: '100%', height: 400 }}>
      <ResponsiveContainer>
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid stroke="#4A4B5E" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: '#FFFFFF' }} fontSize={12} />
          <PolarRadiusAxis angle={30} domain={[0, 5]} tick={{ fill: '#8A8B9E' }} fontSize={12} />
          <Tooltip 
             contentStyle={{ 
                backgroundColor: '#1A1B29', 
                border: '1px solid #4A4B5E',
                borderRadius: '0.5rem'
            }}
            labelStyle={{ color: '#FFFFFF' }}
          />
          <Legend wrapperStyle={{ color: '#8A8B9E', paddingTop: '20px' }} />
          <Radar name="Traditional" dataKey="Traditional" stroke="#FFFFFF" fill="#FFFFFF" fillOpacity={0.6} />
          <Radar name="M2E" dataKey="M2E" stroke="#6E00FF" fill="#6E00FF" fillOpacity={0.6} />
          <Radar name="FixieRun (zkEVM)" dataKey="FixieRun (zkEVM)" stroke="#00F6FF" fill="#00F6FF" fillOpacity={0.5} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};