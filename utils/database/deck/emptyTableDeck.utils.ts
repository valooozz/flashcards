import { SQLiteDatabase } from 'expo-sqlite';

export const emptyTableDeck = async (database: SQLiteDatabase) => {
  try {
    await database.execAsync('DELETE FROM Deck;');
    console.log('table Deck emptied');
  } catch (error) {
    console.error(error);
  }
};
