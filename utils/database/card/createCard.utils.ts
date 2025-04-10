import { SQLiteDatabase } from 'expo-sqlite';

export const createCard = async (
  database: SQLiteDatabase,
  recto: string,
  verso: string,
  idDeck: string,
  changeSide: boolean,
): Promise<boolean> => {
  return database
    .runAsync(
      'INSERT INTO Card (deck, recto, verso, rectoFirst, step, nextRevision, toLearn, changeSide) VALUES (?, ?, ?, ?, ?, ?, ?, ?);',
      [idDeck, recto.trim(), verso.trim(), 1, 0, null, 1, changeSide ? 1 : 0],
    )
    .then(() => true)
    .catch(() => false);
};
