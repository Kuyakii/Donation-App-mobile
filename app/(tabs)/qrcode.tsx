import {Camera, CameraView, useCameraPermissions} from 'expo-camera';
import { useState, useEffect } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function QRCodeScanner() {
    const [permission, requestPermission] = useCameraPermissions();
    const [scanned, setScanned] = useState(false);
    const [scannedData, setScannedData] = useState<string | null>(null);


    useEffect(() => {
        const getPermission = async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            if (status !== 'granted') {
                await requestPermission();
            }
        };
        getPermission();
    }, []);

    if (!permission) {
        return <View />;
    }

    if (!permission.granted) {
        return (
            <View style={styles.container}>
                <Text style={styles.message}>Nous avons besoin de votre permission pour activer la caméra</Text>
                <Button onPress={requestPermission} title="Accorder la permission" />
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
                barcodeScannerSettings={
                    {barcodeTypes: ["qr"],}}
                onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
                style={styles.camera}
                facing={'back'}
            >
                {scanned ? (
                    <View style={styles.resultContainer}>
                        <Text style={styles.resultText}>QR Code Scanné:</Text>
                        <Text style={styles.resultData}>{scannedData}</Text>
                        <Button title="Scanner à nouveau" onPress={() => setScanned(false)} />
                    </View>
                ) : (
                    <View style={styles.overlay} />
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
    message: {
        textAlign: 'center',
        paddingBottom: 10,
    },
    camera: {
        flex: 1,
    },
    resultContainer: {
        position: 'absolute',
        top: 50,
        left: 20,
        right: 20,
        padding: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        borderRadius: 10,
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
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
});
