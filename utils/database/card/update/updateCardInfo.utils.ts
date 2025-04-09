import { SQLiteDatabase } from 'expo-sqlite';

export const updateCardInfo = async (
  database: SQLiteDatabase,
  id: string,
  recto: string,
  verso: string,
  changeSide: boolean,
): Promise<boolean> => {
  return database
    .runAsync('UPDATE Card SET recto=?, verso=?, changeSide=? WHERE id=?', [
      recto,
      verso,
      changeSide ? 1 : 0,
      id,
    ])
    .then(() => true)
    .catch(() => false);
};
