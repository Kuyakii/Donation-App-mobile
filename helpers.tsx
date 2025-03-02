import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { IUtilisateur } from "@/backend/interfaces/IUtilisateur";

export function getUtilisateurConectee() {
    const navigation = useNavigation();
    const [user, setUser] = useState<IUtilisateur | null>(null);

    useEffect(() => {
        const checkUser = async () => {
            try {
                const utilisateurString = await AsyncStorage.getItem('utilisateur');
                if (utilisateurString) {
                    const utilisateur: IUtilisateur = JSON.parse(utilisateurString);
                    console.log("Utilisateur récupéré :", utilisateur);
                    setUser(utilisateur);
                }
            } catch (error) {
                console.error("Erreur lors de la récupération de l'utilisateur:", error);
                // @ts-ignore
                navigation.navigate('login');
            }
        };

        checkUser();
    }, [navigation]);

    return user;
}

export function checkLogin(){
    const navigation = useNavigation();
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        const checkToken = async () => {
            try {
                // Attendre la résolution de la promesse AsyncStorage
                const storedToken = await AsyncStorage.getItem('token');
                console.log('Token récupéré:', storedToken); // Afficher le token récupéré

                if (!storedToken) {
                    // Si pas de token, rediriger vers la page de connexion
                    // @ts-ignore
                    navigation.navigate('login');
                } else {
                    setToken(storedToken); // Mettre à jour l'état avec le token
                }
            } catch (error) {
                console.error('Erreur lors de la récupération du token:', error);
                // @ts-ignore
                navigation.navigate('login');
            }
        };

        checkToken(); // Exécuter la fonction lors du montage du composant
    }, [navigation]);
}


