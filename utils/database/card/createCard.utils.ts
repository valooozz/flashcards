import { SQLiteDatabase } from 'expo-sqlite';

export const createCard = async (
  database: SQLiteDatabase,
  recto: string,
  verso: string,
  idDeck: string,
  changeSide: boolean = true,
  rectoFirst: boolean = true,
  step: number = 0,
  nextRevision: string = null,
  toLearn: boolean = true,
): Promise<boolean> => {
  return database
    .runAsync(
      'INSERT INTO Card (deck, recto, verso, rectoFirst, step, nextRevision, toLearn, changeSide) VALUES (?, ?, ?, ?, ?, ?, ?, ?);',
      [
        idDeck,
        recto.trim(),
        verso.trim(),
        rectoFirst ? 1 : 0,
        step,
        nextRevision,
        toLearn ? 1 : 0,
        changeSide ? 1 : 0,
      ],
    )
    .then(() => true)
    .catch(() => false);
};
