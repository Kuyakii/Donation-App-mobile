import {Camera, CameraView, useCameraPermissions} from 'expo-camera';
import {useState, useEffect, useRef} from 'react';
import {Button, StyleSheet, Text, View, Animated, TouchableOpacity} from 'react-native';
import { useTranslation } from 'react-i18next';

export default function QRCodeScanner() {
    const { t } = useTranslation();
    const [permission, requestPermission] = useCameraPermissions();
    const [scanned, setScanned] = useState(false);
    const [scannedData, setScannedData] = useState<string | null>(null);
    const lineAnimation = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const getPermission = async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            if (status !== 'granted') {
                await requestPermission();
            }
        };
        getPermission();
    }, []);

    useEffect(() => {
        if (!scanned) {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(lineAnimation, {
                        toValue: 1,
                        duration: 1500,
                        useNativeDriver: true,
                    }),
                    Animated.timing(lineAnimation, {
                        toValue: 0,
                        duration: 1500,
                        useNativeDriver: true,
                    }),
                ])
            ).start();
        }
    }, [scanned]);

    if (!permission) {
        return <View />;
    }

    if (!permission.granted) {
        return (
            <View style={styles.container}>
                <Text style={styles.permissionMessage}>{t('camera_permission_required')}</Text>
                <Button onPress={requestPermission} title={t('grant_permission')} />
            </View>
        );
    }

    const handleBarCodeScanned = ({ type, data }: { type: string; data: string }) => {
        setScanned(true);
        setScannedData(data);
    };

    return (
        <View style={styles.container}>
            <CameraView
                barcodeScannerSettings={{
                    barcodeTypes: ["qr"],
                }}
                onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
                style={styles.camera}
                facing={'back'}
            >
                {!scanned && (
                    <View style={styles.overlay}>
                        <View style={styles.scanFrame}>
                            <View style={[styles.corner, styles.topLeft]} />
                            <View style={[styles.corner, styles.topRight]} />
                            <View style={[styles.corner, styles.bottomLeft]} />
                            <View style={[styles.corner, styles.bottomRight]} />

                            <Animated.View style={[styles.scannerLine, {
                                transform: [{
                                    translateY: lineAnimation.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [0, 200],
                                    }),
                                }],
                            }]} />
                        </View>
                    </View>
                )}

                {scanned && (
                    <View style={styles.resultContainer}>
                        <Text style={styles.resultText}>{t('scanned_qr_code')}</Text>
                        <Text style={styles.resultData}>{scannedData}</Text>
                        <TouchableOpacity style={styles.rescanButton} onPress={() => setScanned(false)} >
                            <Text style={styles.rescanButtonText}>{t('rescan_button')}</Text>
                        </TouchableOpacity>
                    </View>
                )}

            </CameraView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    permissionMessage: {
        textAlign: 'center',
        paddingBottom: 10,
    },
    camera: {
        flex: 1,
    },
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 200,
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
    },
    scanFrame: {
        width: 250,
        height: 250,
        alignItems: 'center',
        paddingTop: 25,
    },
    corner: {
        position: 'absolute',
        width: 40, height: 40,
        borderColor: 'white',
    },
    topLeft: {
        top: 0, left: 0,
        borderLeftWidth: 5, borderTopWidth: 5,
        borderTopStartRadius: 15,
    },
    topRight: {
        top: 0, right: 0,
        borderRightWidth: 5, borderTopWidth: 5,
        borderTopEndRadius: 15,
    },
    bottomLeft: {
        bottom: 0, left: 0,
        borderLeftWidth: 5, borderBottomWidth: 5,
        borderBottomStartRadius: 15,
    },
    bottomRight: {
        bottom: 0, right: 0,
        borderRightWidth: 5, borderBottomWidth: 5,
        borderBottomEndRadius: 15,
    },
    scannerLine: {
        width: '80%',
        height: 3,
        backgroundColor: 'red',
    },

    text: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
    },
    resultContainer: {
        padding: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        alignItems: 'center',
    },
    resultText: {
        color: 'white',
        fontSize: 20,
        marginBottom: 10,
    },
    resultData: {
        color: 'white',
        fontSize: 16,
        marginBottom: 20,
    },
    rescanButton: {
        backgroundColor: "#c16ce8",
        padding: 12,
        borderRadius: 10,
    },

    rescanButtonText: {
        color: 'white',
    }

});
