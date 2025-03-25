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



// @ts-ignore
export default function RGPDModal({modalVisible, onClose}) {
    return (
        <Modal
            visible={modalVisible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <View style={styles.modalContainer}>
                <ScrollView style={styles.modalContent}>
                    <Text style={styles.modalText}>
                        En vous inscrivant, vous acceptez que nous recueillions et traitions vos données personnelles,
                        telles que votre nom, adresse e-mail, et autres informations nécessaires à la création de votre
                        compte. Ces données sont utilisées uniquement pour la gestion de votre compte et la fourniture
                        de nos services.
                        {'\n\n'}
                        Nous nous engageons à protéger vos informations personnelles conformément au Règlement Général
                        sur la Protection des Données (RGPD). Vos données ne seront jamais partagées avec des tiers sans
                        votre consentement, à moins que cela ne soit requis par la loi.
                        {'\n\n'}
                        Vous avez le droit d'accéder à vos données, de les rectifier, de les supprimer, ou de vous
                        opposer à leur traitement, conformément à la réglementation en vigueur. Pour exercer vos droits
                        ou pour toute question concernant la protection de vos données, vous pouvez nous contacter à
                        contact@soteria.fr.
                        {'\n\n'}
                        Si un jour vous choisissez de nous quitter et de supprimer votre compte, vos données seront
                        supprimées et vos dons anonymisés.
                        {'\n\n'}
                        Pour plus d'informations, consultez notre{' '}
                        <Text style={styles.linkText}>Politique de Confidentialité</Text>.
                    </Text>

                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <Text style={styles.closeButtonText}>Fermer</Text>
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
        fontSize: 16,
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
        fontSize: 16,
    },
    linkText: {
        color: Colors.primary_dark.background,
        textDecorationLine: 'underline',
    },
});

