import React from 'react';
import { View, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import {router} from "expo-router";

const BoutonAccueil= () => {
    const navigation = useNavigation();

    const redirect =  () => {
            router.replace('/(tabs)');
    };

    return (
        <View>
            <Button title="Retour" onPress={redirect} />
        </View>
    );
};

export default BoutonAccueil;
