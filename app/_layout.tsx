import { Stack } from 'expo-router/stack';
import { SQLiteProvider } from 'expo-sqlite';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { initDatabase } from '../utils/database/database.utils';

export default function Layout() {
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
        </SafeAreaView>
      </SafeAreaProvider>
    </SQLiteProvider>
  );
}
