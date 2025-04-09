import { useFonts } from 'expo-font';
import { SplashScreen } from 'expo-router';
import { Stack } from 'expo-router/stack';
import { SQLiteProvider } from 'expo-sqlite';
import { useEffect } from 'react';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import ToastManager from 'toastify-react-native';
import { initDatabase } from '../utils/database/initDatabase.utils';

export default function Layout() {
  const [loaded] = useFonts({
    JosefinRegular: require('../assets/fonts/JosefinSans-Regular.ttf'),
    JosefinBold: require('../assets/fonts/JosefinSans-Bold.ttf'),
    JosefinSemiBold: require('../assets/fonts/JosefinSans-SemiBold.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <SQLiteProvider databaseName="flashcards.db" onInit={initDatabase}>
      <SafeAreaProvider style={{ flex: 1 }}>
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
          </Stack>
          <ToastManager />
        </SafeAreaView>
      </SafeAreaProvider>
    </SQLiteProvider>
  );
}
