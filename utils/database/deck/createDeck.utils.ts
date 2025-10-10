import { SQLiteDatabase } from 'expo-sqlite';

export const createDeck = async (
  database: SQLiteDatabase,
  deckName: string,
  changeSide: boolean,
  showName: boolean,
): Promise<number> => {
  return database
    .runAsync(
      'INSERT INTO Deck (name, changeSide, showName) VALUES (?, ?, ?);',
      [deckName.trim(), Number(changeSide), Number(showName)]
    )
    .then((result) => result['lastInsertRowId'])
    .catch((error) => { console.error(error); return -1 });
};
