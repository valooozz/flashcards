import { SQLiteDatabase } from 'expo-sqlite';

export const getDeckIdsWithCardsToLearn = async (
    database: SQLiteDatabase,
): Promise<number[]> => {
    try {
        const idsResult = await database.getAllAsync<{ deck: number }>(
            `SELECT DISTINCT deck 
            FROM Card 
            WHERE nextRevision IS NULL AND toLearn=1;
        `);
        return idsResult.map((idResult) => idResult.deck);
    } catch (error) {
        console.error('getDeckIdsWithCardsToLearn:', error);
    }
};
