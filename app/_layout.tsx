import FontAwesome from '@expo/vector-icons/FontAwesome';
import {ThemeProvider} from "@/context/ThemeContext";
import { useFonts } from 'expo-font';
import { Stack, useNavigation } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/components/useColorScheme';
import useFontStore from "@/store/fontStore";
import { Button, View } from 'react-native';
import AccessibilityButton from "@/components/AccessibilityButton";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });
  const loadFontSize = useFontStore((state) => state.loadFontSize);

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();


  return (
    <ThemeProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }}  />
        <Stack.Screen name="modal" options={{ presentation: 'modal' }}  />
        <Stack.Screen name="register" options={{ headerShown: false  }} />
        <Stack.Screen name="detailsAssos" options={{ headerShown: false }} />
        <Stack.Screen name="dons" options={{ headerShown: false}} />
        <Stack.Screen name="login" options={{ headerShown: false  }} />
        <Stack.Screen name="settings" options={{ headerShown: false  }} />
      </Stack>
      <View style={[{bottom: 65}]}>
        <AccessibilityButton></AccessibilityButton>
      </View>
    </ThemeProvider>
  );
}
