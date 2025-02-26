import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function  DonationCard (){
    return (
        <View style={styles.donationCard}>
            <Text style={styles.donationTitle}>Vous avez déjà donné 25€ !</Text>

            <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { width: '50%' }]} />
                </View>
                <Text style={styles.progressText}>50€</Text>
            </View>

            <Text style={styles.badgesTitle}>Vos badges :</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    donationCard: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 12,
        padding: 16,
        marginBottom: 20,
    },
    donationTitle: {
        fontSize: 16,
        fontWeight: '500',
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
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#7CCC6C',
        borderRadius: 10,
    },
    progressText: {
        marginLeft: 8,
        fontSize: 14,
    },
    badgesTitle: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 12,
    },
});
