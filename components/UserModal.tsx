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

// @ts-ignore
export default function UserModal({visible, onClose ,user}) {
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
                <View style={styles.modalText}>
                   <Text> Mon pseudonyme : {user.pseudonyme}</Text>
                    <Text> Mon adresse mail : {user.email}</Text>
                </View>
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
const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
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
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    modalText: {
        fontSize: 16,
        color: '#333',
        lineHeight: 22,
        marginBottom: 10,
    },
    closeButton: {
        backgroundColor: Colors.primary_dark.background,
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: 'center',
    },
    closeButtonText: {
        color: '#FFF',
        fontSize: 16,
    },
    rgpdLinkText: {
        fontSize: 12,
        color: Colors.primary_dark.background,
        textAlign: 'center',
        textDecorationLine: 'underline',
        margin: 10,
    },
});

