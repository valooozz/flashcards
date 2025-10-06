import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFonts } from 'expo-font';
import { SplashScreen } from 'expo-router';
import { Stack } from 'expo-router/stack';
import { SQLiteProvider } from 'expo-sqlite';
import { useEffect, useMemo, useState } from 'react';
import { MD3LightTheme, PaperProvider, configureFonts } from 'react-native-paper';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import ToastManager from 'toastify-react-native';
import { TutorialModal } from '../components/modal/TutorialModal';
import { NotificationProvider } from '../context/NotificationContext';
import { SettingsProvider } from '../context/SettingsContext';
import { TutorialProvider, useTutorialContext } from '../context/TutorialContext';
import { i18nReady } from '../i18n';
import { initDatabase } from '../utils/database/initDatabase.utils';

function TutorialWrapper() {
  const { showTutorial, setShowTutorial } = useTutorialContext();
  const [initialTutorialShown, setInitialTutorialShown] = useState(false);

  useEffect(() => {
    const checkFirstOpen = async () => {
      try {
        const flag = await AsyncStorage.getItem('hasSeenTutorial');
        if (!flag && !initialTutorialShown) {
          setShowTutorial(true);
          setInitialTutorialShown(true);
        }
      } catch (e) {
        if (!initialTutorialShown) {
          setShowTutorial(true);
          setInitialTutorialShown(true);
        }
      }
    };
    checkFirstOpen();
  }, [setShowTutorial, initialTutorialShown]);

  const tutoSlides = useMemo(
    () => [
      {
        key: 'welcome',
        image: require('../assets/images/logo.png'),
        hasTitle: true,
      },
    ],
    [],
  );

  return (
    <TutorialModal
      visible={showTutorial}
      slides={tutoSlides}
      onSkip={async () => {
        setShowTutorial(false);
        try {
          await AsyncStorage.setItem('hasSeenTutorial', 'true');
        } catch { }
      }}
      onDone={async () => {
        setShowTutorial(false);
        try {
          await AsyncStorage.setItem('hasSeenTutorial', 'true');
        } catch { }
      }}
    />
  );
}

export default function Layout() {
  const [fontsLoaded] = useFonts({
    JosefinRegular: require('../assets/fonts/JosefinSans-Regular.ttf'),
    JosefinBold: require('../assets/fonts/JosefinSans-Bold.ttf'),
    JosefinSemiBold: require('../assets/fonts/JosefinSans-SemiBold.ttf'),
  });
  const [i18nLoaded, setI18nLoaded] = useState(false);

  const fontConfig = {
    displayLarge: { fontFamily: 'JosefinBold' },
    displayMedium: { fontFamily: 'JosefinBold' },
    displaySmall: { fontFamily: 'JosefinSemiBold' },
    headlineLarge: { fontFamily: 'JosefinSemiBold' },
    headlineMedium: { fontFamily: 'JosefinSemiBold' },
    headlineSmall: { fontFamily: 'JosefinSemiBold' },
    titleLarge: { fontFamily: 'JosefinSemiBold' },
    titleMedium: { fontFamily: 'JosefinSemiBold' },
    titleSmall: { fontFamily: 'JosefinSemiBold' },
    labelLarge: { fontFamily: 'JosefinSemiBold' },
    labelMedium: { fontFamily: 'JosefinSemiBold' },
    labelSmall: { fontFamily: 'JosefinSemiBold' },
    bodyLarge: { fontFamily: 'JosefinRegular' },
    bodyMedium: { fontFamily: 'JosefinRegular' },
    bodySmall: { fontFamily: 'JosefinRegular' },
  } as const;

  const theme = {
    ...MD3LightTheme,
    colors: {
      ...MD3LightTheme.colors,
      primary: '#63BDF2',
      secondary: '#FED09A',
      // MD3 themes don't use 'accent'; keep if referenced elsewhere
      accent: 'yellow',
    },
    fonts: configureFonts({ config: fontConfig }),
  };

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
      <PaperProvider theme={theme}>
        <SafeAreaProvider style={{ flex: 1 }}>
          <TutorialProvider>
            <SettingsProvider>
              <NotificationProvider>
                <SafeAreaView style={{ flex: 1 }}>
                  <Stack>
                    <Stack.Screen name="index" options={{ headerShown: false }} />
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
                  <ToastManager useModal={false} />
                  <TutorialWrapper />
                </SafeAreaView>
              </NotificationProvider>
            </SettingsProvider>
          </TutorialProvider>
        </SafeAreaProvider>
      </PaperProvider>
    </SQLiteProvider>
  );
}
