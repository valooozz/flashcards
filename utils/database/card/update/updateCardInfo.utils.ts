import { SQLiteDatabase } from 'expo-sqlite';

export const updateCardInfo = async (
  database: SQLiteDatabase,
  id: string,
  recto: string,
  verso: string,
  changeSide: boolean,
  toLearn: boolean,
): Promise<boolean> => {
  if (changeSide) {
    return database
      .runAsync(
        'UPDATE Card SET recto=?, verso=?, changeSide=1, toLearn=? WHERE id=?',
        [recto.trim(), verso.trim(), Number(toLearn), id],
      )
      .then(() => true)
      .catch(() => false);
  } else {
    return database
      .runAsync(
        'UPDATE Card SET recto=?, verso=?, rectoFirst=1, changeSide=0, toLearn=? WHERE id=?',
        [recto.trim(), verso.trim(), Number(toLearn), id],
      )
      .then(() => true)
      .catch((err) => false);
  }
};
