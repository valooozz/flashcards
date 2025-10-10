import { SQLiteDatabase } from 'expo-sqlite';
import { DeckDocument } from '../../types/DeckDocument';
import { importInDatabase } from './importInDatabase.utils';

export const importJsonDocument = async (
  database: SQLiteDatabase,
  fileContent: string,
): Promise<boolean> => {
  const decksDocument: DeckDocument[] = JSON.parse(fileContent);
  return await importInDatabase(database, decksDocument);
};
