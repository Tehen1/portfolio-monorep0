
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getFeeComparisonData } from '../../constants';
import { useTranslation } from '../../context/LanguageContext';

export const FeeComparisonChart: React.FC = () => {
  const { t } = useTranslation();
  const data = getFeeComparisonData(t);
  
  return (
    <div style={{ width: '100%', height: 350 }}>
      <ResponsiveContainer>
        <BarChart
          layout="vertical"
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#4A4B5E" />
          <XAxis type="number" domain={[0, 'dataMax + 1']} tick={{ fill: '#8A8B9E' }} fontSize={12} tickFormatter={(tick) => `$${tick}`} />
          <YAxis type="category" dataKey="name" tick={{ fill: '#8A8B9E' }} fontSize={12} width={100} />
          <Tooltip 
             contentStyle={{ 
                backgroundColor: '#1A1B29', 
                border: '1px solid #4A4B5E',
                borderRadius: '0.5rem'
            }}
            labelStyle={{ color: '#FFFFFF' }}
            formatter={(value: number) => `$${value.toFixed(3)}`}
          />
          <Bar dataKey="fee" fill="#00F6FF" barSize={20} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};