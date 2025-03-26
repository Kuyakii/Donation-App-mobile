import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Image,
    Linking
} from 'react-native';
import Colors from "@/constants/Colors";
import { router } from "expo-router";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import Header from "@/components/header";
import { images } from "@/config";

export default function APropos() {
    const { t } = useTranslation();
    const navigation = useNavigation();

    useEffect(() => {
        navigation.setOptions({
            headerShown: false,
            title: '',
        });
    }, [navigation]);

    const handleGoBack = () => {
        router.back();
    };

    const openFranceAssosSanteWebsite = () => {
        Linking.openURL("https://www.france-assos-sante.org");
    };

    return (
        <View style={styles.container}>
            <Header />
            <View style={styles.titleContainer}>
                <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
                    <Text style={styles.backButtonText}>←</Text>
                </TouchableOpacity>
                <Text style={styles.pageTitle}>{t('info')}</Text>
            </View>
            <ScrollView style={styles.scrollView}>
                <View style={styles.logoContainer}>
                    <Image source={images["logo.png"]} style={styles.soteriaLogo} resizeMode="contain" />
                    <Image source={images["france-asso.png"]} style={styles.franceSanteLogo} resizeMode="contain" />
                </View>

                <Text style={styles.modalText}>
                    {t('a_propos_text1')}
                    {'\n\n'}
                    {t('a_propos_text2')}
                    {'\n\n'}
                    {t('a_propos_text3')}
                </Text>

                {/* Bouton vers le site de France Assos Santé */}
                <TouchableOpacity style={styles.websiteButton} onPress={openFranceAssosSanteWebsite}>
                    <Text style={styles.websiteButtonText}> {t('button_france_asso')}</Text>
                </TouchableOpacity>

                {/* Section sur les créateurs */}
                <View style={styles.creatorsSection}>
                    <Text style={styles.sectionTitle}>{t('createur_title')}</Text>
                    <Text style={styles.modalText}>
                        {t('createurs_text')}
                        {'\n\n'}
                        <Text style={styles.NomText}>
                            {t('mipam_name')}
                            {'\n\n'}
                            {t('rosalie_name')}
                            {'\n\n'}
                            {t('willien_name')}
                            {'\n\n'}
                            {t('juliette_name')}
                            {'\n\n'}
                            {t('alicia_name')}
                        </Text>
                    </Text>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f7f7f7',
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        marginBottom: 15,
        position: 'relative',
    },
    backButton: {
        position: 'absolute',
        left: 15,
        padding: 5,
    },
    backButtonText: {
        fontSize: 30,
        color: Colors.primary_dark.background,
    },
    pageTitle: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#000',
        textAlign: 'center',
    },
    scrollView: {
        flex: 1,
        paddingHorizontal: 20,
    },
    logoContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginVertical: 30,
    },
    soteriaLogo: {
        width: 200,
        height: 125,
    },
    franceSanteLogo: {
        width: 200,
        height: 125,
    },
    modalText: {
        textAlign: 'center',
        color: '#333',
        fontSize: 14,
        marginBottom: 20,
        lineHeight: 20,
    },
    websiteButton: {
        backgroundColor: Colors.primary_dark.background,
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginVertical: 10,
    },
    websiteButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },
    creatorsSection: {
        marginTop: 30,
        marginBottom: 50,
        padding: 15,
        backgroundColor: '#fff',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 2,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: Colors.primary_dark.background,
        textAlign: 'center',
        marginBottom: 10,
    },
    NomText: {
        textAlign: 'left',
        fontWeight: 'bold',
    }

});
