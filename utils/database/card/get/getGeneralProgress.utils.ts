import { SQLiteDatabase } from 'expo-sqlite';

export const getGeneralProgress = async (
    database: SQLiteDatabase,
): Promise<number> => {
    let result: object = undefined;
    try {
        result = await database.getFirstAsync(
            'SELECT SUM(step), COUNT(*) FROM Card WHERE toLearn=1'
        );
    } catch (error) {
        console.error('getGeneralProgress:', error);
    }

    return (result['SUM(step)'] / (result['COUNT(*)'] * 8));
};
