import { SQLiteDatabase } from 'expo-sqlite';
import { DeckType } from '../../../../types/DeckType';

export const getAllDecks = async (
  database: SQLiteDatabase,
): Promise<DeckType[]> => {
  return await database.getAllAsync<DeckType>('SELECT * FROM Deck;');
};
