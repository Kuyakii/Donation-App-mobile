import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import BoutonAccueil from "@/components/BoutonAccueil";
import { BASE_URL } from "@/config";
import Header from "@/components/header";
import Colors from "@/constants/Colors";

const LoginScreen = () => {
    const navigation = useNavigation();
    const [email, setEmail] = useState('');
    const [pseudonyme, setPseudo] = useState('');
    const [password, setPassword] = useState('');
    const [re_password, setRePassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);

    const handleRegister = async () => {
        if (!email || !password || !pseudonyme || !re_password) {
            Alert.alert('Erreur', 'Veuillez remplir tous les champs.');
            return;
        }
        if (password !== re_password) {
            Alert.alert('Erreur', 'Les mots de passe sont différents.');
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

            Alert.alert('Succès', 'Inscription réussie !');
            // @ts-ignore
            navigation.navigate('login');
        } catch (error) {
            // @ts-ignore
            Alert.alert('Erreur', error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Header />
            <BoutonAccueil />
            <ScrollView contentContainerStyle={styles.scroll}>
                <Text style={styles.title}>Inscription</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    placeholderTextColor="#888"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Pseudonyme"
                    value={pseudonyme}
                    onChangeText={setPseudo}
                    autoCapitalize="none"
                    placeholderTextColor="#888"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Mot de passe"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    placeholderTextColor="#888"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Confirmer votre mot de passe"
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
                        <Text style={styles.buttonText}>Inscription...</Text>
                    ) : (
                        <Text style={styles.buttonText}>S'inscrire</Text>
                    )}
                </TouchableOpacity>

                <TouchableOpacity onPress={() => setModalVisible(true)}>
                    <Text style={styles.rgpdLinkText}>
                        En vous inscrivant, vous acceptez notre politique de confidentialité.
                    </Text>
                </TouchableOpacity>
            </ScrollView>

            {/* Modal for RGPD Text */}
            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalText}>
                            En vous inscrivant, vous acceptez que nous recueillions et traitions vos données personnelles, telles que votre nom, adresse e-mail, et autres informations nécessaires à la création de votre compte. Ces données sont utilisées uniquement pour la gestion de votre compte et la fourniture de nos services.
                            {'\n\n'}
                            Nous nous engageons à protéger vos informations personnelles conformément au Règlement Général sur la Protection des Données (RGPD). Vos données ne seront jamais partagées avec des tiers sans votre consentement, à moins que cela ne soit requis par la loi.
                            {'\n\n'}
                            Vous avez le droit d'accéder à vos données, de les rectifier, de les supprimer, ou de vous opposer à leur traitement, conformément à la réglementation en vigueur. Pour exercer vos droits ou pour toute question concernant la protection de vos données, vous pouvez nous contacter à contact@soteria.fr.
                            {'\n\n'}
                            Pour plus d'informations, consultez notre{' '}
                            <Text style={styles.linkText}>Politique de Confidentialité</Text>.
                        </Text>

                        <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
                            <Text style={styles.closeButtonText}>Fermer</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
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
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '80%',
        padding: 20,
        backgroundColor: '#FFF',
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    modalText: {
        fontSize: 16,
        color: '#333',
        lineHeight: 22,
        marginBottom: 20,
    },
    closeButton: {
        backgroundColor: Colors.primary_dark.background,
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: 'center',
    },
    closeButtonText: {
        color: '#FFF',
        fontSize: 16,
    },
    linkText: {
        color: Colors.primary_dark.background,
        textDecorationLine: 'underline',
    },
});

export default LoginScreen;
