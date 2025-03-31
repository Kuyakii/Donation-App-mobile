const tintColorLight = '#2f95dc';
const tintColorDark = '#BB86FC'; // mieux qu’un blanc pur
const primarydark = '#9e25d5';
const primarylight = '#E5B6FA';

export default {
    light: {
        text: '#000',
        background: '#fff',
        tint: tintColorLight,
        tabIconDefault: '#f3f2f2',
        tabIconSelected: tintColorLight,

        primary_lighter: {
            text: '#000',
            background: '#0268b3',
        },
    },

    container_light: {
        backgroundColor: '#f2e9f7', // plus clair et plus propre que l’opacité hex (#9E25D51A)
    },

    dark: {
        text: '#F5F5F5',
        background: '#121212',
        tint: tintColorDark,
        tabIconDefault: '#888',
        tabIconSelected: tintColorDark,

        primary_darker: {
            text: '#F5F5F5',
            background: '#eac0fb',
        },
        container_dark: {
            backgroundColor: '#1e1e1e',
        },
    },

    primary_dark: {
        text: '#fff',
        background: primarydark,
    },

    daltonien: {
        text: '#000',
        background: '#FFFFFF',
        tint: '#FF6600',
        tabIconDefault: '#FF6600',
        tabIconSelected: '#0066FF',
        primary_lighter: {
            text: '#fff',
            background: '#0066FF',
        },
        container_daltonien: {
            backgroundColor: '#F5F5F5',
        },
    },

    primary_light: {
        text: '#fff',
        background: primarylight,
    },

    primary_lighter: {
        text: '#fff',
        background: '#eac0fb',
    },
}

export type ColorTheme = 'light' | 'dark' | 'daltonien';
