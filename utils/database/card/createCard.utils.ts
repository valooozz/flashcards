import { SQLiteDatabase } from 'expo-sqlite';

export const createCard = async (
  database: SQLiteDatabase,
  recto: string,
  verso: string,
  rectoImage: string | null,
  versoImage: string | null,
  idDeck: string,
  changeSide: boolean | null,
  toLearn: boolean = true,
  rectoFirst: boolean = true,
  step: number = 0,
  nextRevision: string = null,
): Promise<boolean> => {
  return database
    .runAsync(
      'INSERT INTO Card (deck, recto, verso, rectoImage, versoImage, rectoFirst, step, nextRevision, toLearn, changeSide) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);',
      [
        idDeck,
        recto.trim(),
        verso.trim(),
        rectoImage ?? null,
        versoImage ?? null,
        rectoFirst ? 1 : 0,
        step,
        nextRevision,
        toLearn ? 1 : 0,
        changeSide === undefined || changeSide === null ? null : changeSide ? 1 : 0,
      ],
    )
    .then(() => true)
    .catch((error) => { console.error(error); return false; });
};
