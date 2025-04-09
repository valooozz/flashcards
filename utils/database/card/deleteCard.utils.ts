import { SQLiteDatabase } from 'expo-sqlite';

export const deleteCard = async (
  database: SQLiteDatabase,
  id: string,
): Promise<boolean> => {
  return database
    .runAsync('DELETE FROM Card WHERE id=?', [id])
    .then(() => true)
    .catch(() => false);
};
