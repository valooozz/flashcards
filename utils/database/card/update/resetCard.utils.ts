import { SQLiteDatabase } from 'expo-sqlite';

export const resetCard = async (
  database: SQLiteDatabase,
  id: string,
): Promise<boolean> => {
  return database
    .runAsync('UPDATE Card SET nextRevision=null WHERE id=?', [id])
    .then(() => true)
    .catch(() => false);
};
