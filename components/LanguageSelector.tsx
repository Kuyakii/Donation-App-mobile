import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal, FlatList } from "react-native";
import { useTranslation } from "react-i18next";

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

    const LanguageItem = ({ item }) => (
        <TouchableOpacity
            style={styles.languageItem}
            onPress={() => changeLanguage(item.code)}
        >
            <Text style={styles.languageText}>{item.name}</Text>
        </TouchableOpacity>
    );

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
                                {t('cancel')}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: 'auto',
    },
    selectButton: {
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 5,
        padding: 10,
    },
    selectedLanguageText: {
        fontSize: 16,
        color: 'black',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        width: '80%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        maxHeight: '70%',
    },
    languageItem: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    languageText: {
        fontSize: 16,
        textAlign: 'center',
    },
    cancelButton: {
        marginTop: 15,
        padding: 15,
        backgroundColor: '#f0f0f0',
        borderRadius: 5,
    },
    cancelButtonText: {
        textAlign: 'center',
        fontSize: 16,
        color: 'black',
    },
});
