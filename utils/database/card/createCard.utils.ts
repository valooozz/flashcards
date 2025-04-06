import { SQLiteDatabase } from 'expo-sqlite';

export const createCard = async (
  database: SQLiteDatabase,
  recto: string,
  verso: string,
  idDeck: string,
  changeSide: boolean,
) => {
  try {
    database.runAsync(
      'INSERT INTO Card (deck, recto, verso, rectoFirst, step, nextRevision, toLearn, changeSide) VALUES (?, ?, ?, ?, ?, ?, ?, ?);',
      [idDeck, recto, verso, 1, 0, null, 1, changeSide ? 1 : 0],
    );
    console.log('Nouvelle carte:', recto, verso, idDeck);
  } catch (error) {
    console.error(error);
  }
};
