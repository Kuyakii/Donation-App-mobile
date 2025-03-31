import React from 'react';
import {
    Modal,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
    Image
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useFavorites } from '@/context/FavoriteContext';
import { getUtilisateurConnecte } from '@/helpers';
import Colors from '@/constants/Colors';
import {images} from "@/config";
import {useTranslation} from "react-i18next";
import useFontStore from "@/store/fontStore";
import { useTheme } from "@/context/ThemeContext";
import { ThemeColors } from "@/constants/ThemeColor";

interface AssociationFavoritesModalProps {
    visible: boolean;
    onClose: () => void;
}

const AssociationFavoritesModal: React.FC<AssociationFavoritesModalProps> = ({
                                                                                 visible,
                                                                                 onClose
                                                                             }) => {
    const { associationsFavorites, loading, fetchFavorites } = useFavorites();
    const user = getUtilisateurConnecte();
    const userId = user?.idUtilisateur;
    const router = useRouter();
    const { t } = useTranslation();

    const handleNavigate = (idAssos: number) => {
        onClose(); // Fermer la modal avant de naviguer
        router.push({
            pathname: "/detailsAssos",
            params: { id: idAssos },
        });
    };

    // Déclencher le chargement des favoris quand la modal s'ouvre
    React.useEffect(() => {
        if (visible && userId) {
            fetchFavorites(userId);
        }
    }, [visible, userId]);
    const {fontSizeTresPetit ,fontSizePetit, fontSize, fontSizeSousTitre,fontSizeTitre, increaseFontSize, decreaseFontSize } = useFontStore();
    const { theme } = useTheme();
    const themeColors = ThemeColors[theme];

    const styles = getStyles(themeColors, {
        fontSizeTresPetit,
        fontSizePetit,
        fontSize,
        fontSizeSousTitre,
        fontSizeTitre,
    });

    // @ts-ignore
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>{t('favorite_associations')}</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <Feather name="x" size={24} color={themeColors.text} />
                        </TouchableOpacity>
                    </View>

                    {loading ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color={Colors.primary_dark.background} />
                        </View>
                    ) : (
                        <ScrollView
                            contentContainerStyle={styles.favoritesScrollView}
                            showsVerticalScrollIndicator={false}
                        >
                            {associationsFavorites.length > 0 ? (
                                associationsFavorites.map((asso) => (
                                    <TouchableOpacity
                                        key={asso.idAssociation}
                                        onPress={() => handleNavigate(asso.idAssociation)}
                                        style={styles.favoriteItemContainer}
                                    >
                                        <View style={styles.favoriteItemContent}>
                                            <Image
                                                //@ts-ignore
                                                source={images[asso.nomImage]}
                                                style={styles.associationImage}
                                                resizeMode="cover"
                                            />
                                            <Text style={styles.associationName} numberOfLines={2}>
                                                {asso.nom}
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                ))
                            ) : (
                                <View style={styles.noFavorites}>
                                    <Text style={styles.noFavoritesText}>
                                        {t('no_favorite_association')}
                                    </Text>
                                </View>
                            )}
                        </ScrollView>
                    )}
                </View>
            </View>
        </Modal>
    );
};

const getStyles = (themeColors: any, fontSizes: any) => StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        backgroundColor: themeColors.background,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingTop: 20,
        paddingHorizontal: 16,
        maxHeight: '80%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: fontSizes.fontSizeSousTitre,
        fontWeight: 'bold',
        color: themeColors.text,
    },
    closeButton: {
        padding: 10,
    },
    favoritesScrollView: {
        paddingBottom: 20,
    },
    favoriteItemContainer: {
        marginBottom: 15,
    },
    favoriteItemContent: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: themeColors.card.background,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: themeColors.card.border,
        padding: 10,
    },
    associationImage: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginRight: 15,
    },
    associationName: {
        flex: 1,
        fontSize: fontSizes.fontSize,
        fontWeight: 'bold',
        color: themeColors.text,
    },
    loadingContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 200,
    },
    noFavorites: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    noFavoritesText: {
        color: themeColors.text,
        opacity: 0.6,
        textAlign: 'center',
        fontSize: fontSizes.fontSizePetit,
        fontStyle: 'italic',
    },
});

export default AssociationFavoritesModal;
