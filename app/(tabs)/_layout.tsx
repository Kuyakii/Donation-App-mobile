import React from 'react';
import { Tabs } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import {Image, StyleSheet} from "react-native";
import {images} from "@/config";

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
                    paddingTop: 10,
                    marginBottom: 10, // Ajoute un espace en bas
                    marginHorizontal: 20, // Optionnel: crée un effet "flottant" horizontal
                    borderRadius: 16, // Optionnel: arrondit les coins pour un effet flottant
                    position: 'absolute', // Rend la barre flottante
                    bottom: 10, // Position par rapport au bas
                    left: 0,
                    right: 0,
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                    elevation: 5,
                },
                // S'assurer que le contenu de l'écran n'est pas caché par la barre
                tabBarItemStyle: {
                    paddingBottom: 5,
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
                    tabBarIcon: ({ color }) => <Image  style={styles.logoImage}
                                                       source={images["logo-petit.png"]}/>,
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
const styles = StyleSheet.create({
    logoImage: {
        width: 80,
        height: 40,
        margin: 12,
        resizeMode: 'contain', // Ajuste l'image

    }
});
