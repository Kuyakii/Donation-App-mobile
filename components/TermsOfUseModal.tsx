import React from 'react';
import {
    Modal,
    View,
    Text,
    StyleSheet,
    TouchableOpacity, ScrollView,
} from 'react-native';

import Colors from '@/constants/Colors';
import {boolean} from "yup";
import {useTranslation} from "react-i18next";
import useFontStore from '@/store/fontStore';


// @ts-ignore
export default function RGPDModal({modalVisible, onClose}) {
    const {fontSizeTresPetit ,fontSizePetit, fontSize, fontSizeSousTitre,fontSizeTitre,fontSizeGrosTitre, increaseFontSize, decreaseFontSize } = useFontStore();

    const { t } = useTranslation();
    return (
        <Modal
            visible={modalVisible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <View style={styles.modalContainer}>
                <ScrollView style={styles.modalContent}>
                    <Text style={[styles.modalText, {fontSize : fontSize}]}>
                        {t('terms_of_use_text')}
                    </Text>

                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <Text style={[styles.closeButtonText, {fontSize : fontSize}]}>{t('close_button')}</Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>
        </Modal>
    )
}
const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        paddingVertical:50,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '80%',
        padding: 20,
        backgroundColor: '#FFF',
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    modalText: {
     //   fontSize: 16,
        color: '#333',
        lineHeight: 22,
        marginBottom: 20,
    },
    closeButton: {
        backgroundColor: Colors.primary_dark.background,
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: 'center',
    },
    closeButtonText: {
        color: '#FFF',
     //   fontSize: 16,
    },
    linkText: {
        color: Colors.primary_dark.background,
        textDecorationLine: 'underline',
    },
});

