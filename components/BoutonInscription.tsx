import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {router} from "expo-router";
import Colors from "@/constants/Colors";
import {useTranslation} from "react-i18next";
const BoutonInscription= () => {
    const { t } = useTranslation();
    const redirect =  () => {
        // @ts-ignore
        router.replace('/register');
    };

    return (
        <View>
            <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText} onPress={redirect}>{t('noAccountSignUp')}</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    button: {
        height: 40,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    buttonText: {
        color: Colors.primary_dark.background,
        fontSize: 16,
        fontWeight: 'bold',
    },
});
export default BoutonInscription;