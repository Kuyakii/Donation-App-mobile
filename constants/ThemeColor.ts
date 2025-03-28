import Colors, { ColorTheme } from './Colors';

export type ThemeColorsType = {
    text: string;
    background: string;
    tint: string;
    tabIconDefault: string;
    tabIconSelected: string;
    card: {
        background: string;
        border: string;
    };
    container: {
        backgroundColor: string;
    };
    primary: {
        text: string;
        background: string;
    };
    primaryAlt?: {
        text: string;
        background: string;
    };
};

// 🔹 Mapping des thèmes disponibles
export const ThemeColors: Record<ColorTheme, ThemeColorsType> = {
    light: {
        card: {
            background: Colors.container_light.backgroundColor,
            border: Colors.light.tint,
        },
        text: Colors.light.text,
        background: Colors.light.background,
        tint: Colors.light.tint,
        tabIconDefault: Colors.light.tabIconDefault,
        tabIconSelected: Colors.light.tabIconSelected,
        container: {
            backgroundColor: Colors.dark.container_dark.backgroundColor,
        },
        primary: {
            text: Colors.primary_light.text,
            background: Colors.primary_light.background,
        },
        primaryAlt: {
            text: Colors.primary_lighter.text,
            background: Colors.primary_lighter.background,
        },
    },
    dark: {
        text: Colors.dark.text,
        card: {
            background: Colors.dark.container_dark.backgroundColor,
            border: Colors.light.tint,
        },
        background: Colors.dark.background,
        tint: Colors.dark.tint,
        tabIconDefault: Colors.dark.tabIconDefault,
        tabIconSelected: Colors.dark.tabIconSelected,
        container: {
            backgroundColor: Colors.dark.container_dark.backgroundColor,
        },
        primary: {
            text: Colors.primary_dark.text,
            background: Colors.primary_dark.background,
        },
        primaryAlt: {
            text: Colors.dark.primary_darker.text,
            background: Colors.dark.primary_darker.background,
        },
    },
};