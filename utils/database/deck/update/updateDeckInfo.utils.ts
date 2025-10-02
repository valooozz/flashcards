import { SQLiteDatabase } from 'expo-sqlite';

export const updateDeckInfo = async (
  database: SQLiteDatabase,
  id: string,
  name: string,
  changeSide: boolean,
  showName: boolean,
): Promise<boolean> => {
  return database
    .runAsync(
      'UPDATE Deck SET name=?, changeSide=?, showName=? WHERE id=?',
      [name.trim(), Number(changeSide), Number(showName), id]
    )
    .then(() => true)
    .catch((err) => { console.log(err); return false; });
};
