import { SQLiteDatabase } from 'expo-sqlite';

export const updateCard = async (
  database: SQLiteDatabase,
  id: string,
  recto: string,
  verso: string,
) => {
  try {
    database.runAsync('UPDATE Card SET recto=?, verso=? WHERE id=?', [
      recto,
      verso,
      id,
    ]);
    console.log('MAJ carte:', id, recto, verso);
  } catch (error) {
    console.error(error);
  }
};
