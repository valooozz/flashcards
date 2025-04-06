import { SQLiteDatabase } from 'expo-sqlite';

export const updateCardInfo = async (
  database: SQLiteDatabase,
  id: string,
  recto: string,
  verso: string,
  changeSide: boolean,
) => {
  try {
    database.runAsync(
      'UPDATE Card SET recto=?, verso=?, changeSide=? WHERE id=?',
      [recto, verso, changeSide ? 1 : 0, id],
    );
  } catch (error) {
    console.error(error);
  }
};
