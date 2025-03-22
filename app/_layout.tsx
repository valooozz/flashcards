import { Stack } from 'expo-router/stack';
import { SQLiteDatabase, SQLiteProvider } from 'expo-sqlite';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

export default function Layout() {
  const createDbIfNeeded = async (db: SQLiteDatabase) => {
    await db.execAsync(
      'CREATE TABLE IF NOT EXISTS Deck (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT);',
    );
  };

  return (
    <SQLiteProvider databaseName="flashcards.db" onInit={createDbIfNeeded}>
      <SafeAreaProvider style={{ flex: 1 }}>
        <SafeAreaView style={{ flex: 1 }}>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen
              name="modalCreateDeck"
              options={{ presentation: 'modal' }}
            />
          </Stack>
        </SafeAreaView>
      </SafeAreaProvider>
    </SQLiteProvider>
  );
}
