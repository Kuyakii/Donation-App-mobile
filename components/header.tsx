import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Image, StatusBar} from 'react-native';
import {Feather} from '@expo/vector-icons';
import {images} from "@/config";
import Colors from "@/constants/Colors";
import {router, useRouter} from "expo-router";
import FontSizeButton from "@/components/ProfileComponents/FontSizeButton";

interface HeaderProps {
    title?: string
}

const redirect = () => {
   router.push('/settings');
};

export default function Header({title}: HeaderProps) {
    return (
        <>
            <StatusBar backgroundColor="#d8b4e2" barStyle="dark-content" />
            <View style={styles.purpleBackground} />
            <View style={styles.header}>
                <View style={styles.logoContainer}>
                    <Image
                        style={styles.logoImage}
                        source={images["logo.png"]}
                    />
                </View>
                <TouchableOpacity style={styles.settingsButton} onPress={redirect}>
                    <Feather name="settings" size={36} color="black"/>
                </TouchableOpacity>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    purpleBackground: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 130,
        backgroundColor: Colors.primary_light.background,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        marginTop: 40,
        marginBottom: 20,
        paddingHorizontal: 10,
    },
    logoContainer: {
        width: 200,
        height: 70,
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoImage: {
        width: 200,
        height: 80,
        margin: 12,
        resizeMode: 'contain',
    },
    settingsButton: {
        padding: 8,
        right: 0,
        position: 'absolute',
    },
    placeholder: {
        width: 40,
        height: 40,
    }
});
