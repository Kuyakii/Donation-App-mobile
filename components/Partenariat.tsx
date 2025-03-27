import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import {images} from "@/config";
import {t} from "i18next";
import useFontStore from "@/store/fontStore";

// @ts-ignore
export default function Partenariat() {
    const {fontSizeTresPetit ,fontSizePetit, fontSize, fontSizeSousTitre,fontSizeTitre,fontSizeGrosTitre, increaseFontSize, decreaseFontSize } = useFontStore();

    return (
        <View style={styles.partnershipContainer}>
            <Image
                style={styles.partnershipLogo}
                source={images['france-asso.png']}
            />
            <Text style={[styles.partnershipText, {fontSize : fontSizeTresPetit}]}>
                {t('partenariat')}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    partnershipContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
        padding: 10,
        backgroundColor: '#F0F0F0',
        borderRadius: 10,
    },
    partnershipLogo: {
        width: 50,
        height: 50,
        marginRight: 10,
        resizeMode: 'contain',
    },
    partnershipText: {
        flex: 1,
     //   fontSize: 12,
        color: 'black',
        textAlign: 'left',
    },
});
