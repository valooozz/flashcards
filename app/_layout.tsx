import { useFonts } from 'expo-font';
import { SplashScreen } from 'expo-router';
import { Stack } from 'expo-router/stack';
import { SQLiteProvider } from 'expo-sqlite';
import { useEffect, useState } from 'react';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import ToastManager from 'toastify-react-native';
import { SettingsProvider } from '../context/SettingsContext';
import { i18nReady } from '../i18n';
import { initDatabase } from '../utils/database/initDatabase.utils';

export default function Layout() {
  const [fontsLoaded] = useFonts({
    JosefinRegular: require('../assets/fonts/JosefinSans-Regular.ttf'),
    JosefinBold: require('../assets/fonts/JosefinSans-Bold.ttf'),
    JosefinSemiBold: require('../assets/fonts/JosefinSans-SemiBold.ttf'),
  });
  const [i18nLoaded, setI18nLoaded] = useState(false);

  useEffect(() => {
    // Wait for i18n initialization to complete
    i18nReady
      .then(() => {
        setI18nLoaded(true);
      })
      .catch((error) => {
        console.error('Error initializing i18n:', error);
        setI18nLoaded(true); // Continue even if there's an error
      });
  }, []);

  useEffect(() => {
    if (fontsLoaded && i18nLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, i18nLoaded]);

  if (!fontsLoaded || !i18nLoaded) {
    return null;
  }

  return (
    <SQLiteProvider databaseName="flashcards.db" onInit={initDatabase}>
      <SafeAreaProvider style={{ flex: 1 }}>
        <SettingsProvider>
          <SafeAreaView style={{ flex: 1 }}>
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen
                name="modalDeck"
                options={{ presentation: 'modal' }}
              />
              <Stack.Screen
                name="modalCard"
                options={{ presentation: 'modal' }}
              />
              <Stack.Screen
                name="modalSettings"
                options={{ presentation: 'modal' }}
              />
            </Stack>
            <ToastManager />
          </SafeAreaView>
        </SettingsProvider>
      </SafeAreaProvider>
    </SQLiteProvider>
  );
}
