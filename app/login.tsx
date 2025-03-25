import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ScrollView,
    ActivityIndicator,
    Image
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import BoutonAccueil from '@/components/BoutonAccueil';
import BoutonInscription from '@/components/BoutonInscription';
import {BASE_URL, images} from '@/config';
import Colors from "@/constants/Colors";
import Header from "@/components/header";
import Partenariat from "@/components/Partenariat";

const LoginScreen = () => {
    const navigation = useNavigation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Erreur', 'Veuillez remplir tous les champs.');
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch(`${BASE_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Erreur lors de la connexion.');

            await AsyncStorage.setItem('token', data.token);
            console.log(data.user);
            await AsyncStorage.setItem('utilisateur', JSON.stringify(data.user));
            await AsyncStorage.setItem('role', JSON.stringify(data.role));

            Alert.alert('Succès', 'Connexion réussie !');
            // @ts-ignore
            navigation.navigate('(tabs)', {
                screen: 'userPage',
            });
        } catch (error) {
            // @ts-ignore
            Alert.alert('Erreur', error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (

        <View style={styles.container}>
            <Header/>
            <BoutonAccueil />
            <ScrollView contentContainerStyle={styles.scroll}>
                <Text style={styles.title}>Connexion</Text>

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
                    placeholder="Mot de passe"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    placeholderTextColor="#888"
                />
                <TouchableOpacity
                    style={[styles.button, isLoading && styles.buttonDisabled]}
                    onPress={handleLogin}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <ActivityIndicator size="small" color="#FFF" />
                    ) : (
                        <Text style={styles.buttonText}>Se connecter</Text>
                    )}
                </TouchableOpacity>
                <BoutonInscription />
                {/* New Partnership Section */}
                <Partenariat/>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        backgroundColor: '#F9FAFB',
    },
    scroll: {
        flexGrow: 1,
        paddingTop: 40,
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
        backgroundColor:  Colors.primary_dark.background,
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
