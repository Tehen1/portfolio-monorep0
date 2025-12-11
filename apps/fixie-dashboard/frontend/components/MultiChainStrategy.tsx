import React from 'react';
import { useTranslation } from '../context/LanguageContext';
import { ZkSyncIcon, ScrollIcon, PolygonIcon, SolanaIcon } from './icons/ChainIcons';
import { ChainCard } from './ChainCard';
import { motion } from 'framer-motion';

export const MultiChainStrategy: React.FC = () => {
    const { t } = useTranslation();

    const chains = [
        {
            name: 'zkSync Era',
            icon: <ZkSyncIcon className="w-10 h-10" />,
            role: t('multiChain.zksync.role'),
            features: t('multiChain.zksync.features') as unknown as string[],
            color: 'text-blue-400'
        },
        {
            name: 'Scroll zkEVM',
            icon: <ScrollIcon className="w-10 h-10" />,
            role: t('multiChain.scroll.role'),
            features: t('multiChain.scroll.features') as unknown as string[],
            color: 'text-amber-400'
        },
        {
            name: 'Polygon CDK',
            icon: <PolygonIcon className="w-10 h-10" />,
            role: t('multiChain.polygon.role'),
            features: t('multiChain.polygon.features') as unknown as string[],
            color: 'text-purple-400'
        },
        {
            name: 'Solana',
            icon: <SolanaIcon className="w-10 h-10" />,
            role: t('multiChain.solana.role'),
            features: t('multiChain.solana.features') as unknown as string[],
            color: 'text-green-400'
        }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };
    
    return (
        <div>
            <p className="text-center max-w-3xl mx-auto text-brand-muted -mt-6 mb-12">
                {t('multiChain.subtitle')}
            </p>
            <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
            >
                {chains.map((chain) => (
                    <ChainCard key={chain.name} {...chain} />
                ))}
            </motion.div>
        </div>
    );
};