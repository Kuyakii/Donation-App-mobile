import React from 'react';
import { Tabs, usePathname } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { Image, StyleSheet } from "react-native";
import { images } from "@/config";
import { I18nextProvider } from 'react-i18next';
import { i18n } from '../../i18n';

// Fonction pour générer les icônes de la barre de navigation
// @ts-ignore
function TabBarIcon({ name, color }) {
    return <Feather name={name} size={22} color={color} />;
}

export default function TabLayout() {
    const pathname = usePathname();

    // Déterminer si nous sommes sur la page admin
    const isAdminRoute = pathname.includes('AdminAssoScreen');

    return (
        <I18nextProvider i18n={i18n}>
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: Colors.primary_dark.background,
                tabBarInactiveTintColor: 'gray',
                tabBarStyle: {
                    backgroundColor: '#f2f2f2',
                    height: 60,
                    paddingTop: 10,
                    marginBottom: 10,
                    marginHorizontal: 20,
                    borderRadius: 16,
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
                    tabBarIcon: ({ color }) => <TabBarIcon name="credit-card" color={color} />,
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
                    tabBarIcon: ({ color }) => <TabBarIcon name="user" color={isAdminRoute ? Colors.primary_dark.background : color} />,
                }}
            />
            <Tabs.Screen
                name="AdminAssoScreen"
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
