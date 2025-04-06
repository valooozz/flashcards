import { SQLiteDatabase } from 'expo-sqlite';

export const dropTableDeck = async (database: SQLiteDatabase) => {
  try {
    await database.execAsync('DROP TABLE Deck;');
  } catch (error) {
    console.error(error);
  }
};
