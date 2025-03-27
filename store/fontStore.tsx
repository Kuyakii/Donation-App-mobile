import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

type FontStore = {
    fontSize: number;
    increaseFontSize: () => void;
    decreaseFontSize: () => void;
    loadFontSize: () => Promise<void>;
};

const useFontStore = create<FontStore>((set) => ({
    fontSize: 16, // Taille par défaut
    increaseFontSize: () => {
        set((state) => {
            const newSize = state.fontSize + 2;
            AsyncStorage.setItem("fontSize", newSize.toString());
            return { fontSize: newSize };
        });
    },
    decreaseFontSize: () => {
        set((state) => {
            const newSize = state.fontSize - 2;
            AsyncStorage.setItem("fontSize", newSize.toString());
            return { fontSize: newSize };
        });
    },
    loadFontSize: async () => {
        const storedSize = await AsyncStorage.getItem("fontSize");
        if (storedSize) {
            set({ fontSize: parseInt(storedSize) });
        }
    },
}));

export default useFontStore;
