
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getMarketGrowthData } from '../../constants';
import { useTranslation } from '../../context/LanguageContext';

export const MarketGrowthChart: React.FC = () => {
  const { t } = useTranslation();
  const data = getMarketGrowthData(t);

  return (
    <div style={{ width: '100%', height: 350 }}>
      <ResponsiveContainer>
        <BarChart
          data={data}
          margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#4A4B5E" />
          <XAxis dataKey="name" tick={{ fill: '#8A8B9E' }} fontSize={12} />
          <YAxis tick={{ fill: '#8A8B9E' }} fontSize={12} />
          <Tooltip 
            contentStyle={{ 
                backgroundColor: '#1A1B29', 
                border: '1px solid #4A4B5E',
                borderRadius: '0.5rem'
            }}
            labelStyle={{ color: '#FFFFFF' }}
            formatter={(value: number) => `${value}B`}
           />
          <Legend wrapperStyle={{ color: '#8A8B9E' }} />
          <Bar dataKey="2024" fill="#6E00FF" />
          <Bar dataKey="2030" fill="#00F6FF" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};