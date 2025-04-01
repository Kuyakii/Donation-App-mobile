import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { images } from "@/config";
import {useTranslation} from "react-i18next";
import useFontStore from "@/store/fontStore";
import { useTheme } from "@/context/ThemeContext";
import { ThemeColors } from "@/constants/ThemeColor";

interface DetailAssosProps {
    nom: string;
    description: string;
    localisation: any;
    descriptionCourte: string;
    nomImage: string;
}

export default function DetailAssociation({ nom, description, localisation, descriptionCourte, nomImage }: DetailAssosProps) {
    // Vérification que localisation est bien un objet avec les propriétés `x` et `y`
    const getCoordinates = (loc: any) => {
        if (loc && typeof loc === 'object' && loc.x !== undefined && loc.y !== undefined) {
            return { latitude: loc.y, longitude: loc.x }; // Retourne les coordonnées
        }
        return null; // Retourne null si localisation invalide
    };
    const { t } = useTranslation();

    const coordinates = getCoordinates(localisation);
    console.log(localisation, typeof localisation, coordinates);

    const {fontSizeTresPetit ,fontSizePetit, fontSize, fontSizeSousTitre,fontSizeTitre,fontSizeGrosTitre, increaseFontSize, decreaseFontSize } = useFontStore();
    const { theme } = useTheme();
    const themeColors = ThemeColors[theme];

    const styles = getStyles(themeColors, {
        fontSizeTresPetit,
        fontSizePetit,
        fontSize,
        fontSizeSousTitre,
        fontSizeTitre,
        fontSizeGrosTitre,
    });

    return (
        <View style={styles.container}>
            {/* Nom de l'association */}
            <Text style={styles.title}>{nom}</Text>

            {/* Image + Description courte */}
            <View style={styles.imageContainer}>
                {/* @ts-ignore */}
                <Image source={images[nomImage]} style={styles.image} />
                <Text style={styles.shortDescription}>{descriptionCourte}</Text>
            </View>

            {/* Description longue */}
            <Text style={styles.longDescription}>{description}</Text>

            {/* Carte avec la localisation*/}
            {localisation ? (
                <MapView
                    style={styles.map}
                    initialRegion={{
                        /* @ts-ignore */
                        latitude: coordinates.latitude,
                        /* @ts-ignore */
                        longitude: coordinates.longitude,
                        latitudeDelta: 0.05,
                        longitudeDelta: 0.05,
                    }}
                >
                    <Marker
                        coordinate={{
                            /* @ts-ignore */
                            latitude: coordinates.latitude,
                            /* @ts-ignore */
                            longitude: coordinates.longitude,
                        }}
                        title={nom}
                    />
                </MapView>
            ) : (
                <Text style={styles.errorText}>{t("locationUnavailable")}</Text>
            )}
        </View>
    );
}

const getStyles = (themeColors: any, fontSizes: any) => StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: themeColors.backgroundColor,
    },
    title: {
        fontSize: fontSizes.fontSizeGrosTitre,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
        color: themeColors.text,
    },
    imageContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    image: {
        width: 150,
        height: 150,
        borderRadius: 75,
        marginBottom: 10,
        resizeMode: 'contain',
    },
    titreSection: {
        flexDirection: 'row',
        fontSize: fontSizes.fontSizeTitre,
        fontWeight: 'bold',
        padding: 10,
        color: themeColors.text,
    },
    shortDescription: {
        fontSize: fontSizes.fontSize,
        fontStyle: 'italic',
        textAlign: 'center',
        color: themeColors.text,
        opacity: 0.7,
    },
    longDescription: {
        fontSize: fontSizes.fontSizeSousTitre,
        lineHeight: 24,
        textAlign: 'justify',
        marginVertical: 20,
        color: themeColors.text,
    },
    map: {
        width: Dimensions.get('window').width - 40,
        height: 300,
        borderRadius: 10,
        alignSelf: 'center',
    },
    errorText: {
        fontSize: fontSizes.fontSize,
        color: 'red',
        textAlign: 'center',
        marginTop: 20,
    },
});