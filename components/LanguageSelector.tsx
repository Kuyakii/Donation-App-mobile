import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal, FlatList } from "react-native";
import { useTranslation } from "react-i18next";
import useFontStore from "@/store/fontStore";
import { useTheme } from "@/context/ThemeContext";
import { ThemeColors } from "@/constants/ThemeColor";

export default function LanguageSelector() {
    const { t, i18n } = useTranslation();
    const [selectedLanguage, setSelectedLanguage] = useState(i18n.language);
    const [modalVisible, setModalVisible] = useState(false);

    const languages = [
        { code: 'fr', name: t('fr') },
        { code: 'en', name: t('en') },
        { code: 'es', name: t('es') },
        { code: 'ja', name: t('ja') },
        { code: 'zh', name: t('zh') },
        { code: 'pt', name: t('pt') },
        { code: 'ko', name: t('ko') },
        { code: 'it', name: t('it') },
    ];

    const changeLanguage = (lang: string) => {
        i18n.changeLanguage(lang);
        setSelectedLanguage(lang);
        setModalVisible(false);
    };

    // @ts-ignore
    const LanguageItem = ({ item  }) => (
        <TouchableOpacity
            style={styles.languageItem}
            onPress={() => changeLanguage(item.code)}
        >
            <Text style={styles.languageText}>{item.name}</Text>
        </TouchableOpacity>
    );
    const {fontSizeTresPetit ,fontSizePetit, fontSize, fontSizeSousTitre,fontSizeTitre,fontSizeGrosTitre, increaseFontSize, decreaseFontSize } = useFontStore();
    const { theme } = useTheme();
    const themeColors = ThemeColors[theme];

    const styles = getStyles(themeColors, {
        fontSizeTresPetit,
        fontSizePetit,
        fontSize,
        fontSizeSousTitre,
        fontSizeTitre,
    });
    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.selectButton}
                onPress={() => setModalVisible(true)}
            >
                <Text style={styles.selectedLanguageText}>
                    {languages.find(lang => lang.code === selectedLanguage)?.name}
                </Text>
            </TouchableOpacity>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <FlatList
                            data={languages}
                            renderItem={LanguageItem}
                            keyExtractor={(item) => item.code}
                        />
                        <TouchableOpacity
                            style={styles.cancelButton}
                            onPress={() => setModalVisible(false)}
                        >
                            <Text style={styles.cancelButtonText}>
                                {t("cancel_button")}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const getStyles = (themeColors: any, fontSizes: any) => StyleSheet.create({
    container: {
        width: 'auto',
    },
    selectButton: {
        borderWidth: 1,
        borderColor: themeColors.text,
        borderRadius: 5,
        padding: 10,
    },
    selectedLanguageText: {
        fontSize: fontSizes.fontSize,
        color: themeColors.text,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        width: '80%',
        backgroundColor: themeColors.background,
        borderRadius: 10,
        padding: 20,
        maxHeight: '70%',
        borderWidth: 1,
        borderColor: themeColors.card.border,
    },
    languageItem: {
        padding: 15,
        borderBottomWidth: 0.7,
        borderBottomColor: themeColors.card.border,
    },
    languageText: {
        fontSize: fontSizes.fontSize,
        textAlign: 'center',
        color: themeColors.text,
    },
    cancelButton: {
        marginTop: 15,
        padding: 15,
        backgroundColor: themeColors.backgroundColor,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: themeColors.card.border,
    },
    cancelButtonText: {
        textAlign: 'center',
        fontSize: fontSizes.fontSize,
        color: themeColors.text,
    },
});