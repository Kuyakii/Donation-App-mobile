/*import React, {useState} from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import setCurrentScreen from '../app/(tabs)/index';
import UserProfileScreen from "@/app/(tabs)/userPage";

// @ts-ignore
export default function NavigationBar({ onNavigate }) {

    return (
            <View style={styles.navigationBar}>
                <TouchableOpacity style={styles.navItem}>
                    <Feather name="map" size={22} color="black" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem}>
                    <Feather name="credit-card" size={22} color="black" />
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.navItem}
                    onPress={() => setCurrentScreen('home')}>
                    <Feather name="home" size={22} color="black" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem}>
                    <Feather name="maximize" size={22} color="black" />
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.navItem}
                    onPress={() => setCurrentScreen('user')}>
                    <Feather name="user" size={22} color="black" />
                </TouchableOpacity>
            </View>
    );
}

const styles = StyleSheet.create({
    navigationBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#f2f2f2',
        borderRadius: 30,
        paddingVertical: 8,
        paddingHorizontal: 12,
    },
    navItem: {
        padding: 8,
    },
});*/
