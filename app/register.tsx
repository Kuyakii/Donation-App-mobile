import React, { useState } from 'react';
import {View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import BoutonAccueil from "@/components/BoutonAccueil";
import {BASE_URL} from "@/config";

const LoginScreen = () => {
    const navigation = useNavigation();
    const [email, setEmail] = useState('');
    const [pseudonyme, setPseudo] = useState('');
    const [password, setPassword] = useState('');
    const [re_password, setRePassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleRegister= async () => {
        if (!email || !password || !pseudonyme || !re_password ) {
            Alert.alert('Erreur', 'Veuillez remplir tous les champs.');
            return;
        }
        if (password !== re_password ) {
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
            navigation.navigate('login'
            );
        } catch (error) {
            // @ts-ignore
            Alert.alert('Erreur', error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scroll}>
                <Text style={styles.title}>Inscription</Text>
                <BoutonAccueil />
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
            </ScrollView>
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
        justifyContent: 'center',
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
        color: '#333',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    button: {
        height: 50,
        width: '100%',
        backgroundColor: '#2563EB',
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
});

export default LoginScreen;