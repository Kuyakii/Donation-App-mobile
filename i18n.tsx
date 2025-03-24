import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import en from './strings/en.json';
import fr from './strings/fr.json';

i18n
    .use(initReactI18next)
    .init({
        fallbackLng: 'fr',
        lng: 'fr',
        resources: {
            en: {
                translation: en,
            },
            fr: {
                translation: fr,
            },
        },
        interpolation: {
            escapeValue: false,
        },
        react: {
            useSuspense: false,
        },
    });

const setLanguage = async (language: string) => {
    await i18n.changeLanguage(language);
    await AsyncStorage.setItem('language', language);
};

const getSavedLanguage = async () => {
    const savedLanguage = await AsyncStorage.getItem('language');
    if (savedLanguage) {
        i18n.changeLanguage(savedLanguage);
    }
};

getSavedLanguage();

export { i18n, setLanguage };
