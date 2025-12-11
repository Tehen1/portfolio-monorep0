import React from 'react';
import { motion } from 'framer-motion';

interface ChainCardProps {
    icon: React.ReactNode;
    name: string;
    role: string;
    features: string[];
    color: string;
}

export const ChainCard: React.FC<ChainCardProps> = ({ icon, name, role, features, color }) => {
    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
    };

    return (
        <motion.div 
            className="bg-brand-surface/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700/50 flex flex-col h-full"
            variants={cardVariants}
        >
            <div className="flex items-center gap-4">
                {icon}
                <h3 className={`text-2xl font-bold ${color}`}>{name}</h3>
            </div>
            <p className="text-sm font-semibold text-brand-muted mt-2 mb-4 h-10">{role}</p>
            <div className="border-t border-gray-700/50 mt-auto pt-4">
                <ul className="space-y-2 text-sm text-gray-300">
                    {features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                            <svg className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0 text-brand-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>{feature}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </motion.div>
    );
};