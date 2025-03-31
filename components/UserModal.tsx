import React, {useState} from 'react';
import {
    Modal,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';

import Colors from '@/constants/Colors';
import RGPDModal from "@/components/RGPDModal";
import useFontStore from '@/store/fontStore';
import { useTheme } from "@/context/ThemeContext";
import { ThemeColors } from "@/constants/ThemeColor";

// @ts-ignore
export default function UserModal({visible, onClose ,user}) {
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
    const [modalVisible, setModalVisible] = useState(false);
    return (
    <Modal
        visible={visible}
        animationType="slide"
        transparent={true}
        onRequestClose={onClose}
    >
        <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
                   <Text style={styles.modalText}> Mon pseudonyme : {user.pseudonyme}</Text>
                    <Text style={styles.modalText}> Mon adresse mail : {user.email}</Text>
                <TouchableOpacity onPress={() => setModalVisible(true)}>
                    <Text style={styles.rgpdLinkText}>
                        En vous inscrivant, vous acceptez notre politique de confidentialité.
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                    <Text style={styles.closeButtonText}>Fermer</Text>
                </TouchableOpacity>
            </View>
        </View>
        <RGPDModal modalVisible={modalVisible} onClose={() => setModalVisible(false)}/>
    </Modal>
)
}
const getStyles = (themeColors: any, fontSizes: any) => StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '80%',
        padding: 20,
        backgroundColor: themeColors.background,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    modalText: {
        color: themeColors.text,
        lineHeight: 22,
        marginBottom: 10,
        fontSize: fontSizes.fontSize,
    },
    closeButton: {
        backgroundColor: themeColors.primary.background,
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: 'center',
    },
    closeButtonText: {
        color: themeColors.primary.text,
        fontWeight: 'bold',
    },
    rgpdLinkText: {
        color: themeColors.primary.background,
        textAlign: 'center',
        textDecorationLine: 'underline',
        margin: 10,
        fontSize: fontSizes.fontSizeTresPetit,
    },
});