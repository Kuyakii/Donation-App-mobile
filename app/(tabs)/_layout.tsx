import React from 'react';
import { Tabs } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

// Fonction pour générer les icônes de la barre de navigation
// @ts-ignore
function TabBarIcon({ name, color }) {
    return <Feather name={name} size={22} color={color} />;
}

export default function TabLayout() {
    const colorScheme = useColorScheme();

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
                tabBarInactiveTintColor: 'gray',
                tabBarStyle: {
                    backgroundColor: '#f2f2f2',
                    height: 60,
                    paddingBottom: 10,
                    paddingTop: 10,
                },
                headerShown: false,
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
                name="dons"
                options={{
                    title: '',
                    tabBarIcon: ({ color }) => <TabBarIcon name="credit-card" color={color} />,
                }}
            />
            <Tabs.Screen
                name="index"
                options={{
                    title: '',
                    tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
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
                    tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} />,
                }}
            />
        </Tabs>
    );
}
