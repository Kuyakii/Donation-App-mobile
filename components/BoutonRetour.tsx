import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text, Alert } from 'react-native';
import { router } from "expo-router";
import { useTheme } from "@/context/ThemeContext";
import { ThemeColors } from "@/constants/ThemeColor";

const BoutonRetour = () => {
    const handleGoBack = () => {
            // Tentative directe de retour
            router.back();
    };
    const { theme } = useTheme();
    const themeColors = ThemeColors[theme];

    const styles = getStyles(themeColors);

    return (
        <View>
            <TouchableOpacity style={styles.button} onPress={handleGoBack}>
                <Text style={styles.buttonText}>‹</Text>
            </TouchableOpacity>
        </View>
    );
};

const getStyles = (themeColors: any) => StyleSheet.create({
    button: {
        height: 60,
        width: 30,
        shadowColor: themeColors.shadowColor,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.6,
        shadowRadius: 5,
        elevation: 3,
    },
    buttonText: {
        color: themeColors.primary.background,
        fontSize: 45,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default BoutonRetour;