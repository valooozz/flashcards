import { SQLiteDatabase } from 'expo-sqlite';
import { DeckDocument } from '../../types/DeckDocument';
import { importDecks } from '../database/deck/importDecks.utils';

export const importInDatabase = async (
  database: SQLiteDatabase,
  decksDocument: DeckDocument[],
): Promise<boolean> => {
  return await importDecks(database, decksDocument);
};
