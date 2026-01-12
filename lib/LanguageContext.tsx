"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { translations, Language } from './translations';

type LanguageContextType = {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: typeof translations['en'];
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
    const [language, setLanguage] = useState<Language>('en');

    useEffect(() => {
        // Load language from localStorage
        const savedLang = localStorage.getItem('language') as Language;
        if (savedLang && (savedLang === 'en' || savedLang === 'de')) {
            setLanguage(savedLang);
        } else {
            // Detect browser language
            const browserLang = navigator.language.startsWith('de') ? 'de' : 'en';
            setLanguage(browserLang);
        }
    }, []);

    const updateLanguage = (lang: Language) => {
        setLanguage(lang);
        localStorage.setItem('language', lang);
        // Dispatch storage event in case we want to sync cross-tab/components explicitly (optional)
        window.dispatchEvent(new Event('storage'));
    };

    const t = translations[language];

    return (
        <LanguageContext.Provider value={{ language, setLanguage: updateLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};
