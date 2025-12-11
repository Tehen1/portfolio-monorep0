import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

type Locale = 'en' | 'fr' | 'es' | 'ru' | 'nl';
type Translations = { [key: string]: any };

interface LanguageContextType {
  locale: Locale;
  translations: Translations;
  t: (key: string, options?: any) => string;
  changeLanguage: (locale: Locale) => void;
  formatDate: (date: Date) => string;
  formatNumber: (number: number) => string;
  languageName: string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const getNestedTranslation = (translations: Translations, key: string): string | undefined => {
    return key.split('.').reduce((obj, k) => (obj && obj[k] !== 'undefined') ? obj[k] : undefined, translations);
}

const localeToLanguageName: Record<Locale, string> = {
    en: 'English',
    fr: 'French',
    es: 'Spanish',
    ru: 'Russian',
    nl: 'Dutch'
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [locale, setLocale] = useState<Locale>('en');
  const [translations, setTranslations] = useState<Translations>({});

  useEffect(() => {
    const fetchTranslations = async () => {
      try {
        const response = await fetch(`/locales/${locale}.json`);
        if (!response.ok) {
          throw new Error(`Could not load ${locale}.json`);
        }
        const data = await response.json();
        setTranslations(data);
      } catch (error) {
        console.error("Failed to fetch translations:", error);
        // Fallback to English if the selected language file fails
        if (locale !== 'en') {
            const fallbackResponse = await fetch(`/locales/en.json`);
            const fallbackData = await fallbackResponse.json();
            setTranslations(fallbackData);
        }
      }
    };
    fetchTranslations();
  }, [locale]);

  const changeLanguage = (newLocale: Locale) => {
    setLocale(newLocale);
  };
  
  const t = (key: string, options: any = {}): string => {
    let translation = getNestedTranslation(translations, key);
    if (!translation) {
      console.warn(`Translation key not found: ${key}`);
      return key;
    }
    
    // Simple placeholder replacement
    Object.keys(options).forEach(optionKey => {
        const regex = new RegExp(`{{${optionKey}}}`, 'g');
        translation = translation.replace(regex, options[optionKey]);
    });

    return translation;
  };

  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat(locale, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(date);
  };
  
  const formatNumber = (number: number): string => {
      return new Intl.NumberFormat(locale).format(number);
  }

  const languageName = localeToLanguageName[locale] || 'English';

  return (
    <LanguageContext.Provider value={{ locale, translations, t, changeLanguage, formatDate, formatNumber, languageName }}>
      {Object.keys(translations).length > 0 ? children : <div>Loading translations...</div>}
    </LanguageContext.Provider>
  );
};

export const useTranslation = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
};