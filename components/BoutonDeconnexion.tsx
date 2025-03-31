import React from 'react';
import {View, Button, StyleSheet, Text, TouchableOpacity} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {router} from "expo-router";
import Colors from "@/constants/Colors";
import {useTranslation} from "react-i18next";
import useFontStore from "@/store/fontStore";
import { useTheme } from "@/context/ThemeContext";
import { ThemeColors } from "@/constants/ThemeColor";

const BoutonDeconnexion = () => {
    const { t } = useTranslation();
    const { theme } = useTheme();
    const themeColors = ThemeColors[theme];

    const styles = getStyles(themeColors);

    const logout = async () => {
        try {
            // Supprimer le token de AsyncStorage
            await AsyncStorage.removeItem('token');
            await AsyncStorage.removeItem('utilisateur');
            // Rediriger vers la page de connexion après déconnexion
            // @ts-ignore
            router.replace('/login');
        } catch (error) {
            console.error('Erreur lors de la déconnexion:', error);
        }
    };
    const {fontSizeTresPetit ,fontSizePetit, fontSize, fontSizeSousTitre,fontSizeTitre, increaseFontSize, decreaseFontSize } = useFontStore();

    return (
        <View>
            <TouchableOpacity style={styles.button} onPress={logout}>
                <Text style={[styles.buttonText, {fontSize : fontSize}]}>{t('logout')}</Text>
            </TouchableOpacity>
        </View>
    );
};

export default BoutonDeconnexion;


const getStyles = (themeColors: any) => StyleSheet.create({
    button: {
        backgroundColor: themeColors.primary.background,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        width: 200,
        height: 45,
        marginBottom: 90,
    },
    buttonText: {
        color: themeColors.text,
        fontWeight: '500',
    }
})
