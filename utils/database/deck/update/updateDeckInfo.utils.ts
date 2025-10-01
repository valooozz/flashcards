import { SQLiteDatabase } from 'expo-sqlite';

export const updateDeckInfo = async (
  database: SQLiteDatabase,
  id: string,
  name: string,
  changeSide: boolean,
): Promise<boolean> => {
  return database
    .runAsync('UPDATE Deck SET name=?, changeSide=? WHERE id=?', [name.trim(), Number(changeSide), id])
    .then(() => true)
    .catch((err) => { console.log(err); return false; });
};
