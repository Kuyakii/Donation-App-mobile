import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from "@/context/ThemeContext";
import { ThemeColors } from "@/constants/ThemeColor";

const BoutonAccueil = () => {
    const navigation = useNavigation();
    const redirect = () => {
        // @ts-ignore
        navigation.navigate('(tabs)', {
            screen: 'index',
        });
    }
    const { theme } = useTheme();
    const themeColors = ThemeColors[theme];

    const styles = getStyles(themeColors);

    return (
        <View>
            <TouchableOpacity style={styles.button} onPress={redirect}>
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

export default BoutonAccueil;
