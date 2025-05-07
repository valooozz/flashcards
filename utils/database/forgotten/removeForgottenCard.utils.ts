import { SQLiteDatabase } from 'expo-sqlite';

export const removeForgottenCard = async (
  database: SQLiteDatabase,
  idCard: number,
): Promise<boolean> => {
  return database
    .runAsync('DELETE FROM Forgotten WHERE idCard=?;', [idCard])
    .then(() => true)
    .catch(() => false);
};
