import Colors, { ColorTheme } from './Colors';

export type ThemeColorsType = {
    text: string;
    background: string;
    tint: string;
    tabIconDefault: string;
    tabIconSelected: string;
    input: {
        placeholderTextColor: string;
        backgroundColor: string;
    }
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

    shadowColor: string;

    admin_section: {
        background: string;
    }

    grey: string;
};

// 🔹 Mapping des thèmes disponibles
export const ThemeColors: Record<ColorTheme, ThemeColorsType> = {
    light: {
        card: {
            background: Colors.container_light.backgroundColor,
            border: Colors.dark.tint,
        },
        text: Colors.light.text,
        background: Colors.light.background,
        tint: Colors.light.tint,
        tabIconDefault: Colors.light.tabIconDefault,
        tabIconSelected: Colors.light.tabIconSelected,
        input: {
            backgroundColor: Colors.light.background,
            placeholderTextColor: Colors.light.text,
        },
        container: {
            backgroundColor: Colors.container_light.backgroundColor,
        },
        primary: {
            text: Colors.primary_dark.text,
            background: Colors.primary_dark.background,
        },
        primaryAlt: {
            text: Colors.primary_lighter.text,
            background: Colors.dark.primary_darker.background,
        },

        shadowColor: Colors.light.text,

        admin_section: {
            background: Colors.light.tabIconDefault
        },

        grey: Colors.grey,
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
        input: {
            backgroundColor: Colors.container_light.backgroundColor,
            placeholderTextColor: Colors.light.text,
        },
        container: {
            backgroundColor: Colors.dark.container_dark.backgroundColor,
        },
        primary: {
            text: Colors.primary_light.text,
            background: Colors.primary_light.background,
        },
        primaryAlt: {
            text: Colors.dark.primary_darker.text,
            background: Colors.light.primary_lighter.background,
        },

        shadowColor: Colors.dark.text,
        admin_section: {
            background: Colors.dark.background,
        },
        grey: Colors.grey,
    },

    daltonien: {
        text: Colors.daltonien.text,
        card: {
            background: '#FFF',
            border: Colors.daltonien.tabIconSelected,
        },
        background: Colors.daltonien.background,
        tint: Colors.daltonien.tint,
        tabIconDefault: Colors.daltonien.tabIconDefault,
        tabIconSelected: Colors.daltonien.tabIconSelected,
        input: {
            backgroundColor: Colors.daltonien.background,
            placeholderTextColor: Colors.daltonien.text,
        },
        container: {
            backgroundColor: Colors.daltonien.container_daltonien.backgroundColor,
        },
        primary: {
            text: '#fff',
            background: Colors.daltonien.tabIconSelected,
        },
        primaryAlt: {
            text: '#fff',
            background: Colors.daltonien.tint,
        },
        shadowColor: Colors.daltonien.tabIconSelected,
        admin_section: {
            background: Colors.daltonien.container_daltonien.backgroundColor,
        },
        grey: Colors.grey,
    }

};
