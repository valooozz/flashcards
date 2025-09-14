import { useTranslation as useI18nTranslation } from 'react-i18next';

export const useTranslation = () => {
    const { t, i18n } = useI18nTranslation();

    const changeLanguage = (language: string) => {
        try {
            i18n.changeLanguage(language);
        } catch (error) {
            console.error('Error changing language:', error);
        }
    };

    const getCurrentLanguage = () => {
        try {
            return i18n.language || 'fr';
        } catch (error) {
            console.error('Error getting current language:', error);
            return 'fr';
        }
    };

    return {
        t,
        changeLanguage,
        getCurrentLanguage,
    };
};
