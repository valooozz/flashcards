import { SQLiteDatabase } from 'expo-sqlite';

export const renameDeck = async (
  database: SQLiteDatabase,
  id: string,
  newName: string,
): Promise<boolean> => {
  return database
    .runAsync('UPDATE Deck SET name=? WHERE id=?', [newName, id])
    .then(() => {
      return true;
    })
    .catch(() => {
      return false;
    });
};
