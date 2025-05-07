import { SQLiteDatabase } from 'expo-sqlite';
import { getDate } from '../../getDate.utils';

export const addForgottenCard = async (
  database: SQLiteDatabase,
  idCard: number,
): Promise<boolean> => {
  const today = getDate(0);

  return database
    .runAsync('INSERT INTO Forgotten (idCard, date) VALUES (?, ?);', [
      idCard,
      today,
    ])
    .then(() => true)
    .catch(() => false);
};
