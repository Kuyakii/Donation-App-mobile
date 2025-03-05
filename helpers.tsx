import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { IUtilisateur } from "@/backend/interfaces/IUtilisateur";
import {BASE_URL} from "@/config";
import {Alert} from "react-native";

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
                    navigation.navigate('/login');
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

export function getAllAssociation(){
    const [associations, setAssociations] = useState([]); // Stocke toutes les associations
    useEffect(() => {
        fetchAssociations();
    }, []);
    const fetchAssociations = async () => {
        try {
            const response = await fetch(`${BASE_URL}/associations`);
            const data = await response.json();
            setAssociations(data); // Stocke toutes les associations dans le state
        } catch (error) {
            console.error('Erreur lors de la récupération des associations', error);
        }
    };
    return associations;
}

export const getAssociation = async (idAssociation: string | number | string[]) => {
    idAssociation = Number(idAssociation);
    console.log("ID reçu au getAssociation :", idAssociation);
   /* const [association, setAssociation] = useState([]); // Stocke toutes les associations
    useEffect(() => {
        fetchAssociation();
    }, []);
    const fetchAssociation = async () => {
        try {*/
            const response = await fetch(`${BASE_URL}/associations/${idAssociation}`);
            const text = await response.text(); // On récupère la réponse en texte brut
            console.log("Réponse brute de l'API :", text); // Ajoute ce log

            const data = JSON.parse(text); // Essaie de parser en JSON
            console.log("Données parsées :", data);
           /* setAssociation(data);
        } catch (error) {
            console.error("Erreur lors de la récupération de l'associations", error);
        }
    };
    return association;*/ return data;
}
export function estConnecté() {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

    useEffect(() => {
        const checkUserLogin = async () => {
            try {
                const storedToken = await AsyncStorage.getItem('token');
                if (storedToken) {
                    setIsLoggedIn(true);
                } else {
                    setIsLoggedIn(false);
                }
            } catch (error) {
                console.error("Erreur lors de la vérification de la connexion :", error);
                setIsLoggedIn(false);
            }
        };

        checkUserLogin(); // Vérification du token lors du montage du composant
    }, []); // Ce useEffect ne se déclenche qu'une seule fois à l'initialisation du composant

    return isLoggedIn;
}
export function getIdUser() {
    const [id, setId] = useState<number>(0);

    useEffect(() => {
        const checkUserLogin = async () => {
            try {
                let user = await AsyncStorage.getItem('utilisateur');
                if (typeof user === "string") {
                    user = JSON.parse(user);
                }
                if (user) {
                    setId(user.idUtilisateur);
                } else {
                    setId(0);
                }
            } catch (error) {
                console.error("Erreur lors de la vérification de l'id :", error);
                setId(0);
            }
        };

        checkUserLogin(); // Vérification du token lors du montage du composant
    }, []); // Ce useEffect ne se déclenche qu'une seule fois à l'initialisation du composant

    return id;
}
