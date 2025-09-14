import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Localization from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enTranslation from '../locales/en/translation.json';
import frTranslation from '../locales/fr/translation.json';

const resources = {
    fr: {
        translation: frTranslation,
    },
    en: {
        translation: enTranslation,
    },
};

// Get device language or default to French
const getDeviceLanguage = (): string => {
    try {
        const locales = Localization.getLocales();
        const locale = locales[0]?.languageCode || 'fr';
        const deviceLanguage = locale.split('-')[0];
        return resources[deviceLanguage as keyof typeof resources] ? deviceLanguage : 'fr';
    } catch (error) {
        console.warn('Error getting device language, defaulting to French:', error);
        return 'fr';
    }
};

// Load saved language from AsyncStorage or fallback to device language
const getInitialLanguage = async (): Promise<string> => {
    try {
        const savedLanguage = await AsyncStorage.getItem('language');
        if (savedLanguage && resources[savedLanguage as keyof typeof resources]) {
            return savedLanguage;
        }
        return getDeviceLanguage();
    } catch (error) {
        console.warn('Error loading saved language, using device language:', error);
        return getDeviceLanguage();
    }
};

// Initialize i18n with the correct language
const initializeI18n = async () => {
    const initialLanguage = await getInitialLanguage();

    return i18n
        .use(initReactI18next)
        .init({
            resources,
            lng: initialLanguage,
            fallbackLng: 'fr',
            debug: __DEV__,
            interpolation: {
                escapeValue: false,
            },
            react: {
                useSuspense: false,
            },
        })
        .catch((error) => {
            console.error('i18n initialization error:', error);
        });
};

// Export the initialization promise
export const i18nReady = initializeI18n();

export default i18n;
