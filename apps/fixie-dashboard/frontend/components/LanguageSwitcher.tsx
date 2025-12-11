import React, { useState } from 'react';
import { useTranslation } from '../context/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';

const languages = {
  en: { name: 'English', flag: '🇺🇸' },
  fr: { name: 'Français', flag: '🇫🇷' },
  es: { name: 'Español', flag: '🇪🇸' },
  ru: { name: 'Русский', flag: '🇷🇺' },
  nl: { name: 'Nederlands', flag: '🇳🇱' },
};

type Locale = keyof typeof languages;

export const LanguageSwitcher: React.FC = () => {
  const { locale, changeLanguage } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const handleLanguageChange = (newLocale: Locale) => {
    changeLanguage(newLocale);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center bg-brand-surface hover:bg-gray-700/50 text-white font-semibold py-2 px-3 rounded-lg border border-gray-700 transition-colors"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <span className="text-lg">{languages[locale].flag}</span>
        <svg className={`w-4 h-4 ml-2 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-40 bg-brand-surface rounded-lg shadow-lg border border-gray-700/50 z-50"
            role="menu"
            aria-orientation="vertical"
          >
            <ul className="p-1">
              {(Object.keys(languages) as Locale[]).map((lang) => (
                <li key={lang}>
                  <button
                    onClick={() => handleLanguageChange(lang)}
                    className="w-full text-left flex items-center px-3 py-2 text-sm text-white hover:bg-brand-purple rounded-md transition-colors"
                    role="menuitem"
                  >
                    <span className="text-lg mr-3">{languages[lang].flag}</span>
                    <span>{languages[lang].name}</span>
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};