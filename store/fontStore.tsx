import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

type FontStore = {
    fontSizePetit: number;
    fontSize: number;
    fontSizeSousTitre: number;
    fontSizeTitre: number;
    increaseFontSize: () => void;
    decreaseFontSize: () => void;
    loadFontSize: () => Promise<void>;
};

const useFontStore = create<FontStore>((set) => ({
    fontSizePetit: 14,
    fontSize: 16, // Taille par défaut
    fontSizeSousTitre: 18,
    fontSizeTitre: 22, // Taille par défaut des titres

    increaseFontSize: () => {
        set((state) => {
            const newSizePetit = Math.min(state.fontSizePetit + 2, 20);
            const newSize = Math.min(state.fontSize + 2, 24);
            const newSizeSousTitre = Math.min(state.fontSizeSousTitre + 2, 28);
            const newSizeTitre = Math.min(state.fontSizeTitre + 2, 32);

            AsyncStorage.setItem("fontSizePetit", newSizePetit.toString());
            AsyncStorage.setItem("fontSize", newSize.toString());
            AsyncStorage.setItem("fontSizeSousTitre", newSizeSousTitre.toString());
            AsyncStorage.setItem("fontSizeTitre", newSizeTitre.toString());

            return { fontSizePetit: newSizePetit, fontSize: newSize, fontSizeSousTitre: newSizeSousTitre, fontSizeTitre: newSizeTitre };
        });
    },

    decreaseFontSize: () => {
        set((state) => {
            const newSizePetit = Math.max(state.fontSizePetit - 2, 10);
            const newSize = Math.max(state.fontSize - 2, 12);
            const newSizeSousTitre = Math.max(state.fontSizeSousTitre - 2, 14);
            const newSizeTitre = Math.max(state.fontSizeTitre - 2, 18);

            AsyncStorage.setItem("fontSizePetit", newSizePetit.toString());
            AsyncStorage.setItem("fontSize", newSize.toString());
            AsyncStorage.setItem("fontSizeSousTitre", newSizeSousTitre.toString());
            AsyncStorage.setItem("fontSizeTitre", newSizeTitre.toString());

            return { fontSizePetit: newSizePetit, fontSize: newSize, fontSizeSousTitre: newSizeSousTitre, fontSizeTitre: newSizeTitre };
        });
    },

    loadFontSize: async () => {
        const storedSizePetit = await AsyncStorage.getItem("fontSizePetit");
        const storedSize = await AsyncStorage.getItem("fontSize");
        const storedSizeSousTitre = await AsyncStorage.getItem("fontSizeSousTitre");
        const storedSizeTitre = await AsyncStorage.getItem("fontSizeTitre");

        set({
            fontSizePetit: storedSizePetit ? parseInt(storedSizePetit) : 14,
            fontSize: storedSize ? parseInt(storedSize) : 16,
            fontSizeSousTitre: storedSizeSousTitre ? parseInt(storedSizeSousTitre) : 18,
            fontSizeTitre: storedSizeTitre ? parseInt(storedSizeTitre) : 22,
        });
    },
}));

export default useFontStore;
