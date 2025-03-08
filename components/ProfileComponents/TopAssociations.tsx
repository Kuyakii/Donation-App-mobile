import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function TopAssociations() {
    return (
        <View style={styles.topAssociationsCard}>
            <Text style={styles.topAssociationsTitle}>Top 3 associations</Text>
            <Text style={styles.topAssociationsSubtitle}>
                Les trois associations pour lesquelles vous avez donné le plus donné.
            </Text>

            <View style={styles.associationItem}>
                <Text style={styles.rankingNumber}>1.</Text>
                <View style={styles.associationLogo}></View>
                <Text style={styles.associationName}>Asso top 1</Text>
            </View>

            <View style={styles.associationItem}>
                <Text style={styles.rankingNumber}>2.</Text>
                <View style={styles.associationLogo}></View>
                <Text style={styles.associationName}>Asso top 2</Text>
            </View>

            <View style={styles.associationItem}>
                <Text style={styles.rankingNumber}>3.</Text>
                <View style={styles.associationLogo}></View>
                <Text style={styles.associationName}>Asso top 3</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    topAssociationsCard: {
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 12,
        padding: 16,
        backgroundColor: '#EADEF4',
        marginBottom: 20,
    },
    topAssociationsTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    topAssociationsSubtitle: {
        fontSize: 14,
        color: '#666',
        marginBottom: 16,
        fontWeight: '500',
    },
    associationItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    rankingNumber: {
        fontSize: 16,
        fontWeight: 'bold',
        marginRight: 10,
    },
    associationLogo: {
        width: 50,
        height: 50,
        backgroundColor: '#f2f2f2',
        marginRight: 16,
    },
    associationName: {
        fontSize: 16,
    },
});
