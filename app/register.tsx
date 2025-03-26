import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import BoutonRetour from "@/components/BoutonRetour";
import { BASE_URL } from "@/config";
import Header from "@/components/header";
import Colors from "@/constants/Colors";
import { useTranslation } from 'react-i18next';
import Partenariat from "@/components/Partenariat";
import RGPDModal from "@/components/RGPDModal";

const LoginScreen = () => {
    const { t } = useTranslation();
    const navigation = useNavigation();
    const [email, setEmail] = useState('');
    const [pseudonyme, setPseudo] = useState('');
    const [password, setPassword] = useState('');
    const [re_password, setRePassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);

    const handleRegister = async () => {
        if (!email || !password || !pseudonyme || !re_password) {
            Alert.alert(t('error'), t('error_fill_fields'));
            return;
        }
        if (password !== re_password) {
            Alert.alert(t('error'), t('error_password_match'));
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch(`${BASE_URL}/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, pseudonyme }),
            });

            const data = await response.json();

            if (!response.ok) throw new Error(data.message || "Erreur lors de l'inscription.");

            Alert.alert(t('success'), t('register_success'));
            // @ts-ignore
            navigation.navigate('login');
        } catch (error) {
            // @ts-ignore
            Alert.alert(t('error'), error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Header />
            <BoutonRetour />
            <ScrollView contentContainerStyle={styles.scroll}>
                <Text style={styles.title}>{t('registration_title')}</Text>
                <TextInput
                    style={styles.input}
                    placeholder={t('email_placeholder')}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    placeholderTextColor="#888"
                />
                <TextInput
                    style={styles.input}
                    placeholder={t('username_placeholder')}
                    value={pseudonyme}
                    onChangeText={setPseudo}
                    autoCapitalize="none"
                    placeholderTextColor="#888"
                />
                <TextInput
                    style={styles.input}
                    placeholder={t('password_placeholder')}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    placeholderTextColor="#888"
                />
                <TextInput
                    style={styles.input}
                    placeholder={t('confirm_password_placeholder')}
                    value={re_password}
                    onChangeText={setRePassword}
                    secureTextEntry
                    placeholderTextColor="#888"
                />
                <TouchableOpacity
                    style={[styles.button, isLoading && styles.buttonDisabled]}
                    onPress={handleRegister}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <Text style={styles.buttonText}>{t('registering_button')}</Text>
                    ) : (
                        <Text style={styles.buttonText}>{t('register_button')}</Text>
                    )}
                </TouchableOpacity>

                <TouchableOpacity onPress={() => setModalVisible(true)}>
                    <Text style={styles.rgpdLinkText}>
                        {t('privacy_policy_text')}
                    </Text>
                </TouchableOpacity>
                <Partenariat/>
            </ScrollView>

            {/* Modal for RGPD Text */}
           <RGPDModal modalVisible={modalVisible} onClose={() => setModalVisible(false)}/>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#F9FAFB',
    },
    scroll: {
        flexGrow: 1,
        alignItems: 'center',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 24,
    },
    input: {
        height: 50,
        width: '100%',
        borderColor: '#DDD',
        borderWidth: 1,
        borderRadius: 12,
        marginVertical: 10,
        paddingHorizontal: 16,
        backgroundColor: '#FFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    button: {
        height: 50,
        width: '100%',
        backgroundColor: Colors.primary_dark.background,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    buttonDisabled: {
        backgroundColor: '#A9A9A9',
    },
    buttonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    rgpdLinkText: {
        fontSize: 12,
        color: Colors.primary_dark.background,
        textAlign: 'center',
        textDecorationLine: 'underline',
        marginTop: 20,
    },

});

export default LoginScreen;
