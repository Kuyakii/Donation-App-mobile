import React from 'react';
import { Tabs, usePathname } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { Image, StyleSheet } from "react-native";
import { images } from "@/config";
import { I18nextProvider } from 'react-i18next';
import { i18n } from '../../i18n';
import { useTheme } from "@/context/ThemeContext";
import { ThemeColors } from "@/constants/ThemeColor";
// Fonction pour générer les icônes de la barre de navigation
// @ts-ignore
function TabBarIcon({ name, color }) {
    return <Feather name={name} size={22} color={color} />;
}

export default function TabLayout() {
    const pathname = usePathname();
    const { theme } = useTheme();
    const themeColors = ThemeColors[theme];

    // Déterminer si nous sommes sur la page admin
    const isAdminRoute = pathname.includes('AdminAssoScreen');
    const isAdminRoute2 = pathname.includes('AdminAppScreen');

    return (
        <I18nextProvider i18n={i18n}>
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: Colors.primary_dark.background,
                tabBarInactiveTintColor: 'gray',
                tabBarStyle: {
                    backgroundColor: themeColors.background,
                    height: 60,
                    paddingTop: 10,
                    marginBottom: 10,
                    marginHorizontal: 20,
                    borderRadius: 16,
                    borderWidth: 1,
                    borderColor: theme == 'dark' ? themeColors.card.border : 'transparent',
                    position: 'absolute',
                    bottom: 10,
                    left: 0,
                    right: 0,
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                    elevation: 5,
                },
                tabBarItemStyle: {
                    paddingBottom: 5,
                },
            }}
        >
            <Tabs.Screen
                name="map"
                options={{
                    title: '',
                    tabBarIcon: ({ color }) => <TabBarIcon name="map" color={color} />,
                }}
            />
            <Tabs.Screen
                name="questionnaire"
                options={{
                    title: '',
                    tabBarIcon: ({ color }) => <TabBarIcon name="layers" color={color} />,
                }}
            />
            <Tabs.Screen
                name="index"
                options={{
                    title: '',
                    tabBarIcon: ({ color }) => <Image style={styles.logoImage} source={images["logo-petit.png"]}/>,
                }}
            />
            <Tabs.Screen
                name="qrcode"
                options={{
                    title: '',
                    tabBarIcon: ({ color }) => <TabBarIcon name="maximize" color={color} />,
                }}
            />
            <Tabs.Screen
                name="userPage"
                options={{
                    title: '',
                    tabBarIcon: ({ color }) => <TabBarIcon name="user" color={isAdminRoute || isAdminRoute2 ? Colors.primary_dark.background : color} />,
                }}
            />
            <Tabs.Screen
                name="AdminAssoScreen"
                options={{
                    title: '',
                    href: null,
                }}
            />
            <Tabs.Screen
                name="AdminAppScreen"
                options={{
                    title: '',
                    href: null,
                }}
            />
        </Tabs>
        </I18nextProvider>
    );
}

const styles = StyleSheet.create({
    logoImage: {
        width: 80,
        height: 40,
        margin: 12,
        resizeMode: 'contain',
    }
});
