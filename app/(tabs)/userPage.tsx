import React from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, SafeAreaView} from 'react-native';
import {Feather} from '@expo/vector-icons';



export default function UserProfileScreen() {
    return (
        <SafeAreaView style={styles.container}>
            {/* Header avec logo et paramètres */}
            <View style={styles.header}>
                <View style={styles.logoContainer}>
                    <Text style={styles.logoText}>Logo</Text>
                </View>
                <TouchableOpacity style={styles.settingsButton}>
                    <Feather name="settings" size={24} color="black"/>
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.scrollView}>
                {/* Titre de bienvenue */}
                <Text style={styles.welcomeTitle}>Bonjour, unNom</Text>

                {/* Boutons d'actions */}
                <View style={styles.actionsContainer}>
                    <TouchableOpacity style={styles.actionButton}>
                        <View style={styles.iconContainer}>
                            <Feather name="user" size={24} color="black"/>
                        </View>
                        <Text style={styles.actionText}>Profil</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.actionButton}>
                        <View style={styles.iconContainer}>
                            <Feather name="gift" size={24} color="black"/>
                        </View>
                        <Text style={styles.actionText}>Dons</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.actionButton}>
                        <View style={styles.iconContainer}>
                            <Feather name="star" size={24} color="#FFD700"/>
                        </View>
                        <Text style={styles.actionText}>Favoris</Text>
                    </TouchableOpacity>
                </View>

                {/* Section de progression des dons */}
                <View style={styles.donationCard}>
                    <Text style={styles.donationTitle}>Vous avez déjà donné 25€ !</Text>

                    <View style={styles.progressContainer}>
                        <View style={styles.progressBar}>
                            <View style={[styles.progressFill, {width: '50%'}]}/>
                        </View>
                        <Text style={styles.progressText}>50€</Text>
                    </View>

                    {/* Badges section */}
                    <Text style={styles.badgesTitle}>Vos badges :</Text>
                    {/*<View style={styles.badgesContainer}>
              <Image source={require('./assets/badge-10.png')} style={styles.badge} />
              <Image source={require('./assets/badge-25.png')} style={styles.badge} />
              <Image source={require('./assets/badge-50-grey.png')} style={styles.badgeGrey} />
              <Image source={require('./assets/badge-100-grey.png')} style={styles.badgeGrey} />
            </View>*/}
                </View>

                {/* Top associations section */}
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
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    logoContainer: {
        width: 180,
        height: 48,
        backgroundColor: '#f2f2f2',
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoText: {
        fontSize: 18,
        fontWeight: '500',
    },
    settingsButton: {
        padding: 8,
    },
    scrollView: {
        flex: 1,
        paddingHorizontal: 16,
    },
    welcomeTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginVertical: 20,
    },
    actionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    actionButton: {
        alignItems: 'center',
        width: '30%',
    },
    iconContainer: {
        width: 70,
        height: 70,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 5,
    },
    actionText: {
        fontSize: 14,
    },
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
    badgesContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    badge: {
        width: 50,
        height: 50,
    },
    badgeGrey: {
        width: 50,
        height: 50,
        opacity: 0.5,
    },
    topAssociationsCard: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 12,
        padding: 16,
        marginBottom: 20,
    },
    topAssociationsTitle: {
        fontSize: 18,
        fontWeight: '500',
        marginBottom: 8,
    },
    topAssociationsSubtitle: {
        fontSize: 14,
        color: '#666',
        marginBottom: 16,
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
        width: 40,
        height: 40,
        backgroundColor: '#f2f2f2',
        marginRight: 16,
    },
    associationName: {
        fontSize: 16,
    },
    navigationContainer: {
        paddingHorizontal: 16,
        paddingBottom: 16,
        paddingTop: 8,
    },
    navigationBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#f2f2f2',
        borderRadius: 30,
        paddingVertical: 8,
        paddingHorizontal: 12,
    },
    navItem: {
        padding: 8,
    },
});
