import React from 'react';
// FIX: Import Variants type from framer-motion to resolve type errors.
import { motion, Variants } from 'framer-motion';
import { useTranslation } from '../context/LanguageContext';

export const Hero: React.FC = () => {
  const { t } = useTranslation();
  const title1 = t('hero.title1').split(" ");
  const title2 = t('hero.title2').split(" ");

  // FIX: Explicitly type animation variants to help TypeScript resolve prop types.
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  // FIX: Explicitly type animation variants to help TypeScript resolve prop types.
  const wordVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 15,
        stiffness: 100,
      },
    },
  };

  return (
    <div className="text-center py-16 sm:py-24 overflow-hidden">
      <motion.h1
        className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-tight"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <span className="block">
          {title1.map((word, index) => (
            <motion.span key={index} variants={wordVariants} className="inline-block mr-2 sm:mr-4">
              {word}
            </motion.span>
          ))}
        </span>
        <span className="block bg-clip-text text-transparent bg-gradient-to-r from-brand-cyan to-brand-purple mt-2">
          {title2.map((word, index) => (
            <motion.span key={index} variants={wordVariants} className="inline-block mr-2 sm:mr-4">
              {word}
            </motion.span>
          ))}
        </span>
      </motion.h1>
      <p className="mt-6 max-w-2xl mx-auto text-lg sm:text-xl text-brand-muted">
        {t('hero.description')}
      </p>
      <div className="mt-8 flex justify-center gap-4">
        <a href="#dashboard" className="bg-brand-cyan hover:bg-opacity-80 text-brand-bg font-bold py-3 px-8 rounded-lg transition-transform hover:scale-105">
          {t('hero.cta.dashboard')}
        </a>
        <a href="#" className="bg-brand-surface hover:bg-gray-700/50 text-white font-bold py-3 px-8 rounded-lg border border-gray-700 transition-colors">
          {t('hero.cta.learnMore')}
        </a>
      </div>
    </div>
  );
};