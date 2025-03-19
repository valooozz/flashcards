import { Stack } from 'expo-router/stack';
import { SQLiteDatabase, SQLiteProvider } from 'expo-sqlite';

export default function Layout() {
  const createDbIfNeeded = async (db: SQLiteDatabase) => {
    await db.execAsync(
      'CREATE TABLE IF NOT EXISTS Deck (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT);',
    );
  };

  return (
    <SQLiteProvider databaseName="flashcards.db" onInit={createDbIfNeeded}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="modalCreateDeck"
          options={{ presentation: 'modal' }}
        />
      </Stack>
    </SQLiteProvider>
  );
}
