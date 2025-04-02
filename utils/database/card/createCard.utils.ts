import { SQLiteDatabase } from 'expo-sqlite';

export const createCard = async (
  database: SQLiteDatabase,
  recto: string,
  verso: string,
  idDeck: string,
) => {
  try {
    database.runAsync(
      'INSERT INTO Card (deck, recto, verso, rectoFirst, step, nextRevision, toLearn) VALUES (?, ?, ?, ?, ?, ?, ?);',
      [idDeck, recto, verso, 1, 0, null, 1],
    );
    console.log('Nouvelle carte:', recto, verso, idDeck);
  } catch (error) {
    console.error(error);
  }
};
