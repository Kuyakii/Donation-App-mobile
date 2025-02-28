import React, { useState } from 'react';
import {View, Text, TextInput, Button, StyleSheet, Alert, ScrollView} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import BoutonAccueil from "@/components/BoutonAccueil";

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
            const response = await fetch('http://192.168.1.90:3000/register', {
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
            <Text style={styles.title}>Connexion</Text>
            <BoutonAccueil></BoutonAccueil>
                <Text>Email</Text>
                <TextInput
                    style={styles.input}
                    aria-label={'Email'}
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
                <Text>Pseudonyme</Text>
                <TextInput
                    style={styles.input}
                    aria-label={'Pseudonyme'}
                    placeholder="Pseudonyme"
                    value={pseudonyme}
                    onChangeText={setPseudo}
                    keyboardType="default"
                    autoCapitalize="none"
                />
                <Text>Mot de passe</Text>
                <TextInput
                    style={styles.input}
                    aria-label={'Mot de passe'}
                    placeholder="Mot de passe"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />
                <Text>Confirmer votre mot de passe</Text>
                <TextInput
                    style={styles.input}
                    aria-label={'Confirmer votre mot de passe'}
                    placeholder="Confirmer votre mot de passe"
                    value={re_password}
                    onChangeText={setRePassword}
                    secureTextEntry
                />
            <Button title={isLoading ? "Inscription..." : "S'inscrire"} onPress={handleRegister} disabled={isLoading} />
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 16,
        backgroundColor: 'white',
    },
    title: {
        fontSize: 24,
        marginBottom: 16,
        textAlign: 'center',
    },
    input: {
        height: 40,
        width: '100%',
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 12,
        paddingHorizontal: 8,
    }, scroll: {
        flexGrow: 1,  // Permet de prendre tout l'espace vertical disponible
        justifyContent: 'center',  // Centre les éléments verticalement
        alignItems: 'center',  // Centre les éléments horizontalement
        paddingHorizontal: 16,  // Ajoute un peu de marge sur les côtés
    }

});

export default LoginScreen;
