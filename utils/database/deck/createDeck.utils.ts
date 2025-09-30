import { SQLiteDatabase } from 'expo-sqlite';

export const createDeck = async (
  database: SQLiteDatabase,
  deckName: string,
  changeSide: boolean,
): Promise<number> => {
  return database
    .runAsync('INSERT INTO Deck (name, changeSide) VALUES (?, ?);', [deckName.trim(), Number(changeSide)])
    .then((result) => result['lastInsertRowId'])
    .catch(() => -1);
};
