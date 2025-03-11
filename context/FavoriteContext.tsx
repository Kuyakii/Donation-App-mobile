import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import {BASE_URL} from "@/config";
import {IAssociation} from "@/backend/interfaces/IAssociation";

interface FavoriteContextType {
    associationsFavorites: Array<IAssociation>;
    loading: boolean;
    fetchFavorites: (userId: string) => Promise<void>;
    updateFavorites: (newFavorites: Array<any>) => void;
}

const FavoriteContext = createContext<FavoriteContextType | undefined>(undefined);

export const FavoriteProvider = ({ children }: { children: ReactNode }) => {
    const [associationsFavorites, setAssociationsFavorites] = useState<Array<any>>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const fetchFavorites = useCallback(async (userId: number) => {
        try {
            const response = await fetch(`${BASE_URL}/favorites/${userId}`);
            const data = await response.json();
            if (!response.ok) {
                console.error("Erreur API :", data.message);
            }
            setAssociationsFavorites(data);
        } catch (error) {
            console.error("Erreur récupération favoris :", error);
        } finally {
            setLoading(false);
        }
    }, []);

    const updateFavorites = (newFavorites: Array<any>) => {
        setAssociationsFavorites(newFavorites);
    };

    return (
        <FavoriteContext.Provider value={{ associationsFavorites, loading, fetchFavorites, updateFavorites }}>
            {children}
        </FavoriteContext.Provider>
    );
};

// Hook pour accéder au contexte
export const useFavorites = (): FavoriteContextType => {
    const context = useContext(FavoriteContext);
    if (!context) {
        throw new Error('useFavorites must be used within a FavoriteProvider');
    }
    return context;
};
