import { SQLiteDatabase } from 'expo-sqlite';

export const resetDatabase = async (
    database: SQLiteDatabase,
): Promise<void> => {
    await database.runAsync('DELETE FROM Card');
    await database.runAsync('DELETE FROM Deck');
};
