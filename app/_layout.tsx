import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFonts } from 'expo-font';
import { SplashScreen } from 'expo-router';
import { Stack } from 'expo-router/stack';
import { SQLiteProvider } from 'expo-sqlite';
import { useEffect, useMemo, useState } from 'react';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { LanguagePickerModal } from '../components/modal/LanguagePickerModal';
import { TutorialModal } from '../components/modal/TutorialModal';
import { DB_NAME } from '../const/database.const';
import { NotificationProvider } from '../context/NotificationContext';
import { SettingsProvider } from '../context/SettingsContext';
import { TutorialProvider, useTutorialContext } from '../context/TutorialContext';
import i18n, { i18nReady } from '../i18n';
import { homeLightTheme } from '../style/Themes';
import { initDatabase } from '../utils/database/initDatabase.utils';

function TutorialWrapper() {
  const { showTutorial, setShowTutorial } = useTutorialContext();
  const [initialTutorialShown, setInitialTutorialShown] = useState(false);
  const [needsLanguageChoice, setNeedsLanguageChoice] = useState(false);

  useEffect(() => {
    const checkFirstOpen = async () => {
      try {
        const flag = await AsyncStorage.getItem('hasSeenTutorial');
        const savedLanguage = await AsyncStorage.getItem('language');
        if (!savedLanguage) {
          setNeedsLanguageChoice(true);
        } else if (!flag && !initialTutorialShown) {
          setShowTutorial(true);
          setInitialTutorialShown(true);
        }
      } catch (e) {
        if (!initialTutorialShown) {
          setNeedsLanguageChoice(true);
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
      {
        key: 'library',
        image: require('../assets/images/library.png'),
        hasTitle: true,
      },
      {
        key: 'newDeck',
        image: require('../assets/images/newDeck.png'),
        hasTitle: true,
      },
      {
        key: 'card',
        image: require('../assets/images/card.png'),
        hasTitle: true,
      },
      {
        key: 'deck',
        image: require('../assets/images/deck.png'),
        hasTitle: true,
      },
      {
        key: 'learning',
        image: require('../assets/images/learning.png'),
        hasTitle: true,
      },
      {
        key: 'daily',
        image: require('../assets/images/daily.png'),
        hasTitle: true,
      },
      {
        key: 'flash',
        image: require('../assets/images/flash.png'),
        hasTitle: true,
      },
      {
        key: 'settings',
        image: require('../assets/images/settings.png'),
        hasTitle: true,
      },
      {
        key: 'end',
        image: require('../assets/images/logo.png'),
        hasTitle: true,
      },
    ],
    [],
  );

  return (
    <>
      <LanguagePickerModal
        visible={needsLanguageChoice}
        onSelect={async (lang) => {
          try {
            await AsyncStorage.setItem('language', lang);
          } catch { }
          // switch language immediately
          try {
            i18n.changeLanguage(lang);
          } catch { }
          setNeedsLanguageChoice(false);
          const hasSeen = await AsyncStorage.getItem('hasSeenTutorial');
          if (!hasSeen && !initialTutorialShown) {
            setShowTutorial(true);
            setInitialTutorialShown(true);
          }
        }}
      />
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
    </>
  );
}

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
    <SQLiteProvider databaseName={DB_NAME} onInit={initDatabase}>
      <PaperProvider theme={homeLightTheme}>
        <SafeAreaProvider style={{ flex: 1 }}>
          <TutorialProvider>
            <SettingsProvider>
              <NotificationProvider>
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
                <TutorialWrapper />
              </NotificationProvider>
            </SettingsProvider>
          </TutorialProvider>
        </SafeAreaProvider>
      </PaperProvider>
    </SQLiteProvider>
  );
}
