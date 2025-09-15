import { SQLiteDatabase } from 'expo-sqlite';

export const stopLearningCard = async (
    database: SQLiteDatabase,
    id: number,
): Promise<boolean> => {
    return database
        .runAsync(
            'UPDATE Card SET toLearn=0 WHERE id=?',
            [id],
        )
        .then(() => true)
        .catch(() => false);
};
