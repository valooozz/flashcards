import { SQLiteDatabase } from 'expo-sqlite';

export const resetDeck = async (
  database: SQLiteDatabase,
  id: string,
): Promise<boolean> => {
  return database
    .runAsync('UPDATE Card SET nextRevision=null WHERE deck=?', [id])
    .then(() => {
      return true;
    })
    .catch(() => {
      return false;
    });
};
