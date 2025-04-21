import { SQLiteDatabase } from 'expo-sqlite';

export const createDeck = async (
  database: SQLiteDatabase,
  deckName: string,
): Promise<number> => {
  return database
    .runAsync('INSERT INTO Deck (name) VALUES (?);', [deckName.trim()])
    .then((result) => result['lastInsertRowId'])
    .catch(() => -1);
};
