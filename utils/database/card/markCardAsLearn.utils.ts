import { SQLiteDatabase } from 'expo-sqlite';

export const markCardAsLearnt = async (
  database: SQLiteDatabase,
  id: string,
) => {
  try {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextRevision = tomorrow.toISOString().split('T')[0];

    console.log('nextRevision:', nextRevision);

    database.runAsync('UPDATE Card SET nextRevision=? WHERE id=?', [
      nextRevision,
      id,
    ]);
    console.log('Carte apprise à réviser demain:', id);
  } catch (error) {
    console.error(error);
  }
};
