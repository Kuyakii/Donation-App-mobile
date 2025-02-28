import React from 'react';
import { View, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import {router} from "expo-router";

const BoutonInscription= () => {
    const navigation = useNavigation();

    const redirect =  () => {
        // @ts-ignore
        router.replace('/register');
    };

    return (
        <View>
            <Button title="Pas de compte ? s'inscrire !" onPress={redirect} />
        </View>
    );
};

export default BoutonInscription;
