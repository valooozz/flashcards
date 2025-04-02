import { SQLiteDatabase } from 'expo-sqlite';

export const deleteCard = async (database: SQLiteDatabase, id: string) => {
  try {
    database.runAsync('DELETE FROM Card WHERE id=?', [id]);
    console.log('Carte', id, 'supprimée');
  } catch (error) {
    console.error(error);
  }
};
