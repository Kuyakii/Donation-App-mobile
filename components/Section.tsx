import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import useFontStore from '@/store/fontStore';

// @ts-ignore
export default function Section({ title, icon, children, onSeeAllPress }) {
    const {fontSizeTresPetit ,fontSizePetit, fontSize, fontSizeSousTitre,fontSizeTitre,fontSizeGrosTitre, increaseFontSize, decreaseFontSize } = useFontStore();

    return (
        <View style={styles.section}>
            <View style={styles.sectionHeader}>
                <View style={styles.sectionTitleContainer}>
                    <MaterialIcons name={icon} size={20} color="black" />
                    <Text style={[styles.sectionTitle, {fontSize : fontSizeSousTitre}]}>{title}</Text>
                </View>
                {onSeeAllPress && (
                    <TouchableOpacity onPress={onSeeAllPress}>
                        <Text style={[styles.seeAllText, {fontSize : fontSizePetit}]}>Voir tout</Text>
                    </TouchableOpacity>
                )}
            </View>
            {children}
        </View>
    );
}

const styles = StyleSheet.create({
    section: {
        paddingHorizontal: 16,
        marginBottom: 20,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    sectionTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    sectionTitle: {
     //   fontSize: 18,
        fontWeight: '500',
        marginLeft: 8,
    },
    seeAllText: {
   //     fontSize: 14,
        color: '#777',
    },
});
