import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Colors from "@/constants/Colors";
import {getSeuils} from "@/helpers";

// @ts-ignore
export default function  DonationCard ({montantDon}){
    const seuils = getSeuils();
    let max = seuils[0];
    for (let i = 0; i < seuils.length; i++) {
        if (seuils[i] >= Number(montantDon)) {
            max = seuils[i];
            break;
        }
    }
    const pourcentage = (montantDon/max)*100;
    const progressWidth = `${Math.min(pourcentage, 100)}%`; // Évite que ça dépasse 100%

    return (
        <View style={styles.donationCard}>
            <Text style={styles.donationTitle}>Vous avez déjà donné {montantDon}€ !</Text>

            <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { width: progressWidth }]} />
                </View>
                <Text style={styles.progressText}>{max}€</Text>
            </View>

            <Text style={styles.badgesTitle}>Vos badges :</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    donationCard: {
        borderWidth: 0.5,
        borderColor: 'black',
        backgroundColor: Colors.container_light.backgroundColor,
        borderRadius: 12,
        padding: 16,
        marginBottom: 20,
    },
    donationTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    progressContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    progressBar: {
        flex: 1,
        height: 20,
        backgroundColor: '#f2f2f2',
        borderRadius: 10,
        borderWidth: 1,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#7CCC6C',
        borderRadius: 10,
        borderWidth: 0.5,
    },
    progressText: {
        marginLeft: 8,
        fontSize: 14,
        fontWeight: 'bold',
    },
    badgesTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 12,
    },
});
