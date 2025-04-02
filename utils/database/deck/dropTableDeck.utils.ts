import { SQLiteDatabase } from 'expo-sqlite';

export const dropTableDeck = async (database: SQLiteDatabase) => {
  try {
    await database.execAsync('DROP TABLE Deck;');
    console.log('table Deck dropped');
  } catch (error) {
    console.error(error);
  }
};
