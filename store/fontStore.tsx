import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

type FontStore = {
    fontSizeTresPetit: number;
    fontSizePetit: number;
    fontSize: number;
    fontSizeSousTitre: number;
    fontSizeTitre: number;
    fontSizeGrosTitre: number;
    increaseFontSize: () => void;
    decreaseFontSize: () => void;
    loadFontSize: () => Promise<void>;
};

const useFontStore = create<FontStore>((set) => ({
    fontSizeTresPetit: 12,
    fontSizePetit: 14,
    fontSize: 16, // Taille par défaut
    fontSizeSousTitre: 18,
    fontSizeTitre: 22, // Taille par défaut des titres
    fontSizeGrosTitre: 24, // Taille par défaut des titres

    increaseFontSize: () => {
        set((state) => {
            const newSizeTresPetit = Math.min(state.fontSizeTresPetit + 2, 15);
            const newSizePetit = Math.min(state.fontSizePetit + 2, 20);
            const newSize = Math.min(state.fontSize + 2, 24);
            const newSizeSousTitre = Math.min(state.fontSizeSousTitre + 2, 28);
            const newSizeTitre = Math.min(state.fontSizeTitre + 2, 32);
            const newSizeGrosTitre = Math.min(state.fontSizeGrosTitre + 2, 32);

            AsyncStorage.setItem("fontSizeTresPetit", newSizeTresPetit.toString());
            AsyncStorage.setItem("fontSizePetit", newSizePetit.toString());
            AsyncStorage.setItem("fontSize", newSize.toString());
            AsyncStorage.setItem("fontSizeSousTitre", newSizeSousTitre.toString());
            AsyncStorage.setItem("fontSizeTitre", newSizeTitre.toString());
            AsyncStorage.setItem("fontSizeGrosTitre", newSizeGrosTitre.toString());

            return {fontSizeTresPetit: newSizeTresPetit ,fontSizePetit: newSizePetit, fontSize: newSize, fontSizeSousTitre: newSizeSousTitre, fontSizeTitre: newSizeTitre,fontSizeGrosTitre: newSizeGrosTitre };
        });
    },

    decreaseFontSize: () => {
        set((state) => {
            const newSizeTresPetit = Math.max(state.fontSizeTresPetit - 2, 10);
            const newSizePetit = Math.max(state.fontSizePetit - 2, 12);
            const newSize = Math.max(state.fontSize - 2, 14);
            const newSizeSousTitre = Math.max(state.fontSizeSousTitre - 2, 16);
            const newSizeTitre = Math.max(state.fontSizeTitre - 2, 18);
            const newSizeGrosTitre = Math.max(state.fontSizeGrosTitre - 2, 20);

            AsyncStorage.setItem("fontSizeTresPetit", newSizeTresPetit.toString());
            AsyncStorage.setItem("fontSizePetit", newSizePetit.toString());
            AsyncStorage.setItem("fontSize", newSize.toString());
            AsyncStorage.setItem("fontSizeSousTitre", newSizeSousTitre.toString());
            AsyncStorage.setItem("fontSizeTitre", newSizeTitre.toString());
            AsyncStorage.setItem("fontSizeGrosTitre", newSizeGrosTitre.toString());

            return {fontSizeTresPetit: newSizeTresPetit ,fontSizePetit: newSizePetit, fontSize: newSize, fontSizeSousTitre: newSizeSousTitre, fontSizeTitre: newSizeTitre,fontSizeGrosTitre: newSizeGrosTitre };
        });
    },

    loadFontSize: async () => {
        const storedSizeTresPetit = await AsyncStorage.getItem("fontSizeTresPetit");
        const storedSizePetit = await AsyncStorage.getItem("fontSizePetit");
        const storedSize = await AsyncStorage.getItem("fontSize");
        const storedSizeSousTitre = await AsyncStorage.getItem("fontSizeSousTitre");
        const storedSizeTitre = await AsyncStorage.getItem("fontSizeTitre");
        const storedSizeGrosTitre = await AsyncStorage.getItem("fontSizeGrosTitre");

        set({
            fontSizeTresPetit: storedSizeTresPetit ? parseInt(storedSizeTresPetit) : 12,
            fontSizePetit: storedSizePetit ? parseInt(storedSizePetit) : 14,
            fontSize: storedSize ? parseInt(storedSize) : 16,
            fontSizeSousTitre: storedSizeSousTitre ? parseInt(storedSizeSousTitre) : 18,
            fontSizeTitre: storedSizeTitre ? parseInt(storedSizeTitre) : 22,
            fontSizeGrosTitre: storedSizeGrosTitre ? parseInt(storedSizeGrosTitre) : 24,
        });
    },
}));

export default useFontStore;
