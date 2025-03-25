import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import en from './strings/en.json';
import fr from './strings/fr.json';
import es from './strings/es.json';
import ja from './strings/ja.json';
import zh from './strings/zh.json';
import pt from './strings/pt.json';
import ko from './strings/ko.json';
import it from './strings/it.json';

i18n
    .use(initReactI18next)
    .init({
        fallbackLng: 'fr',
        lng: 'fr',
        resources: {
            en: { translation: en },
            fr: { translation: fr },
            es: { translation: es },
            ja: { translation: ja },
            zh: { translation: zh },
            pt: { translation: pt },
            ko: { translation: ko },
            it: { translation: it },
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
