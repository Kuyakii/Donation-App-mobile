import React, { createContext, useState, useContext, ReactNode } from 'react';
import { ColorTheme } from '../constants/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ThemeContextType {
    theme: ColorTheme;
    toggleTheme: () => void;
    setTheme: (theme: ColorTheme) => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [theme, setThemeState] = useState<ColorTheme>('light');

    React.useEffect(() => {
        // Charger le thème sauvegardé au démarrage
        const loadTheme = async () => {
            try {
                const savedTheme = await AsyncStorage.getItem('app_theme');
                if (savedTheme) {
                    setThemeState(savedTheme as ColorTheme);
                }
            } catch (error) {
                console.error('Erreur de chargement du thème', error);
            }
        };
        loadTheme();
    }, []);

    const setTheme = async (newTheme: ColorTheme) => {
        try {
            await AsyncStorage.setItem('app_theme', newTheme);
            setThemeState(newTheme);
        } catch (error) {
            console.error('Erreur de sauvegarde du thème', error);
        }
    };

    const toggleTheme = async () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        await setTheme(newTheme);
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};