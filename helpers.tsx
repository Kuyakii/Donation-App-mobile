import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { IUtilisateur } from "@/backend/interfaces/IUtilisateur";
import {BASE_URL} from "@/config";
import {Alert} from "react-native";
import {IAssociation} from "@/backend/interfaces/IAssociation";

export function getUtilisateurConnecte() {
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
    }, [idAssociation]);

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
export function getAssociationsByType(idType: number) {
    const [associations, setAssociations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchAssociationsByType = async () => {
            try {
                setLoading(true);
                // Récupérer d'abord toutes les associations
                const response = await fetch(`${BASE_URL}/associations`);
                const allAssociations = await response.json();

                // Filtrer les associations par l'idType spécifié
                const filteredAssociations = allAssociations.filter(
                    (association: any) => Number(association.idType) === Number(idType)
                );

                setAssociations(filteredAssociations);
                setLoading(false);
            } catch (error) {
                console.error('Erreur lors de la récupération des associations par type:', error);
                setError('Impossible de charger les associations');
                setLoading(false);
            }
        };

        fetchAssociationsByType();
    }, [idType]);

    return { associations, loading, error };
}

export function estConnecte() {
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


export async function checkFavorite(idUtilisateur: number, idAssociation: number) {
    try {
        const response = await fetch(`${BASE_URL}/favorites/${idUtilisateur}`);
        if (!response.ok) throw new Error('Erreur lors de la récupération des favoris.');
        const favorites = await response.json();
        return favorites.some((asso: any) => Number(asso.idAssociation) === Number(idAssociation));
    } catch (error) {
        console.error('Erreur checkFavorite:', error);
        return false;
    }
}

export function getAllDons(){
    const [dons, setDons] = useState([]);
    useEffect(() => {
        fetchDons();
    }, []);
    const fetchDons = async () => {
        try {
            const response = await fetch(`${BASE_URL}/getDons`);
            const data = await response.json();
            setDons(data);
        } catch (error) {
            console.error('Erreur lors de la récupération des dons', error);
        }
    };
    return dons;
}

export function getSeuils(){
    let seuils = [10, 20, 50, 100, 150, 300, 500, 1000, 5000, 10000];
    /*for(let i = 10; i < 10000; i+= 50) {
        seuils.push(i);
    }*/
    return seuils;
}

export function getBadgeColor (seuil : number){
    if (seuil < 100) return '#D3D3D3'; // Gris pour les petits montants
    if (seuil < 500) return '#ADD8E6'; // Bleu clair
    if (seuil < 1000) return '#32CD32'; // Vert
    if (seuil < 5000) return '#FFA500'; // Orange
    return '#FFD700'; // Or pour les gros montants
};

export function getAssosPopulaires() {
    const [assosPopulaires, setassosPopulaires] = useState([]);

    useEffect(() => {
        getAssociationPopulaire();
    }, []);

        const getAssociationPopulaire = async () => {
            try {
                const response = await fetch(`${BASE_URL}/assosPopulaires`);
                const data = await response.json();
                console.log(data);
                setassosPopulaires(data);
            } catch (error) {
                console.error('Erreur lors de la récupération des associations populaires', error);
            }
        };
    return assosPopulaires;
}
