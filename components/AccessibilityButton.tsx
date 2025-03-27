import React, { useState } from "react";
import { View, TouchableOpacity, Text, StyleSheet, Animated, Easing } from "react-native";
import { Scale } from 'lucide-react-native';
import useFontStore from "@/store/fontStore";
import Colors from "@/constants/Colors";

export default function FontSizeButton() {
    const { increaseFontSize, decreaseFontSize, fontSize } = useFontStore();
    const [isExpanded, setIsExpanded] = useState(false);
    const slideAnim = React.useRef(new Animated.Value(0)).current;
    const rotateAnim = React.useRef(new Animated.Value(0)).current;

    const toggleAccessibilityPanel = () => {
        setIsExpanded(!isExpanded);

        // Slide animation horizontally
        Animated.timing(slideAnim, {
            toValue: isExpanded ? 0 : 1,
            duration: 300,
            easing: Easing.bezier(0.4, 0, 0.2, 1),
            useNativeDriver: true
        }).start();

        // Rotation animation
        Animated.timing(rotateAnim, {
            toValue: isExpanded ? 0 : 1,
            duration: 300,
            useNativeDriver: true
        }).start();
    };

    const slideInterpolate = slideAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [-100, 0]  // Sliding from left to right
    });

    const rotateInterpolate = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '0deg']
    });

    return (
        <View style={styles.container}>
            {/* Accessibility Panel */}
            <Animated.View
                style={[
                    styles.accessibilityPanel,
                    {
                        transform: [
                            { translateX: slideInterpolate },
                            { rotate: rotateInterpolate }
                        ],
                        opacity: slideAnim
                    }
                ]}
            >
                <View style={styles.panelContent}>
                    <TouchableOpacity
                        style={[
                            styles.button,
                            isExpanded && { backgroundColor: Colors.primary_dark.background }
                        ]}
                        onPress={decreaseFontSize}
                    >
                        <Text style={styles.buttonText}>A-</Text>
                        <Text style={styles.sizeText}>{fontSize.toFixed(1)}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[
                            styles.button,
                            isExpanded && { backgroundColor: Colors.primary_dark.background }
                        ]}
                        onPress={increaseFontSize}
                    >
                        <Text style={styles.buttonText}>A+</Text>
                        <Text style={styles.sizeText}>{fontSize.toFixed(1)}</Text>
                    </TouchableOpacity>
                </View>
            </Animated.View>

            {/* Main Accessibility Toggle Button */}
            <TouchableOpacity
                style={[
                    styles.mainButton,
                    { backgroundColor: isExpanded ? Colors.primary_dark.background : Colors.primary_light.background }
                ]}
                onPress={toggleAccessibilityPanel}
            >
                <Animated.View
                    style={{
                        transform: [{ rotate: rotateInterpolate }]
                    }}
                >
                    <Scale color="white" size={24} />
                </Animated.View>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        right: 20,
        bottom: 20,
        flexDirection: "row",
        alignItems: "center",
    },
    accessibilityPanel: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: 15,
        marginRight: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    panelContent: {
        flexDirection: 'row',
        padding: 10,
        alignItems: 'center',
    },
    button: {
        backgroundColor: Colors.primary_dark.background,
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 5,
        elevation: 5,
    },
    buttonText: {
        color: "white",
        fontSize: 20,
        fontWeight: "bold",
    },
    sizeText: {
        color: "white",
        fontSize: 10,
        marginTop: 5,
    },
    mainButton: {
        backgroundColor: Colors.primary_dark.background,
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
});
