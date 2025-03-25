import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    Modal,
    StyleSheet,
    TouchableOpacity,
    Image,
    Animated,
    Dimensions
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {images} from "@/config";
import Colors from "@/constants/Colors";

const FirstTimeModal = () => {
    const [isVisible, setIsVisible] = useState(true);
    const screenHeight = Dimensions.get('window').height;
    const slideAnimation = useRef(new Animated.Value(-screenHeight * 0.9)).current;

    useEffect(() => {
        const animationTimer = setTimeout(() => {
            Animated.timing(slideAnimation, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true
            }).start();
        }, 100);

        return () => clearTimeout(animationTimer);
    }, []);

    const handleClose = () => {
        Animated.timing(slideAnimation, {
            toValue: -screenHeight * 0.9,
            duration: 300,
            useNativeDriver: true
        }).start(() => {
            setIsVisible(false);
            AsyncStorage.setItem('hasLaunchedBefore', 'true');
        });
    };

    return (
        <Modal
            visible={isVisible}
            transparent={true}
            animationType="none"
        >
            <View style={styles.modalContainer}>
                <Animated.View
                    style={[
                        styles.modalContent,
                        {
                            transform: [{
                                translateY: slideAnimation
                            }]
                        }
                    ]}
                >
                    <View style={styles.logoContainer}>
                        <Image
                            source={images["logo.png"]}
                            style={styles.soteriaLogo}
                            resizeMode="contain"
                        />
                        <Image
                            source={images["france-asso.png"]}
                            style={styles.franceSanteLogo}
                            resizeMode="contain"
                        />
                    </View>

                    <Text style={styles.modalText}>
                        Soteria est une application innovante dédiée à la gestion des dons pour les associations partenaires de France Assos Santé.
                        {'\n\n'}
                        En collaborant étroitement avec cette union nationale, qui regroupe près de 85 associations  militant pour les droits des patients et des usagers , Soteria facilite le processus de don en offrant une plateforme centralisée et sécurisée.
                        {'\n\n'}
                        Notre objectif est de renforcer le soutien aux associations membres de France Assos Santé, contribuant ainsi à améliorer la représentation et la défense des droits des usagers du système de santé en France.
                        {'\n\n'}
                        <Text style={styles.modalTextPlus}> Retrouvez plus d’informations dans l’onglet "Profil" de l’application.
                        </Text>
                    </Text>

                    <TouchableOpacity
                        style={styles.closeButton}
                        onPress={handleClose}
                    >
                        <Text style={styles.closeButtonText}>Fermer</Text>
                    </TouchableOpacity>
                </Animated.View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-start',
    },
    modalContent: {
        backgroundColor: Colors.primary_lighter.background,
        height: '80%',
        width: '100%',
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        paddingTop: 50,
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    logoContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginVertical:30,
    },
    soteriaLogo: {
        width: 200,
        height: 125,
    },
    franceSanteLogo: {
        width: 200,
        height: 125,
    },
    modalText: {
        textAlign: 'center',
        color: '#333',
        fontSize: 14,
        marginBottom: 20,
        lineHeight: 20,
    },
    modalTextPlus: {
        textAlign:'center',
        color: Colors.primary_dark.background,
        fontWeight: 'bold',
        fontSize: 14,
        marginBottom: 20,
        lineHeight: 20,
    },
    closeButton: {
        backgroundColor: Colors.primary_dark.background,
        borderRadius: 25,
        paddingVertical: 12,
        alignItems: 'center',
        marginTop: 'auto',
    },
    closeButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default FirstTimeModal;