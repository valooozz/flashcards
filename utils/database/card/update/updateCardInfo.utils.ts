import { SQLiteDatabase } from 'expo-sqlite';

export const updateCardInfo = async (
  database: SQLiteDatabase,
  id: string,
  recto: string,
  verso: string,
  changeSide: boolean,
): Promise<boolean> => {
  if (changeSide) {
    return database
      .runAsync('UPDATE Card SET recto=?, verso=?, changeSide=? WHERE id=?', [
        recto.trim(),
        verso.trim(),
        1,
        id,
      ])
      .then(() => true)
      .catch(() => false);
  } else {
    return database
      .runAsync(
        'UPDATE Card SET recto=?, verso=?, rectoFirst=?, changeSide=? WHERE id=?',
        [recto.trim(), verso.trim(), 1, 0, id],
      )
      .then(() => true)
      .catch((err) => false);
  }
};
