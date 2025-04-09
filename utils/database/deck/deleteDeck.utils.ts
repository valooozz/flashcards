import { SQLiteDatabase } from 'expo-sqlite';

export const deleteDeck = async (
  database: SQLiteDatabase,
  id: string,
): Promise<boolean> => {
  database.runAsync('DELETE FROM Card WHERE deck=?', [id]);
  return database
    .runAsync('DELETE FROM Deck WHERE id=?', [id])
    .then(() => {
      return true;
    })
    .catch(() => {
      return false;
    });
};
