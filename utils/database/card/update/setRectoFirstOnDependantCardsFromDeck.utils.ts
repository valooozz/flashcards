import { SQLiteDatabase } from 'expo-sqlite';

export const setRectoFirstOnDependantCardsFromDeck = async (
    database: SQLiteDatabase,
    idDeck: string,
): Promise<boolean> => {
    return database
        .runAsync(
            `UPDATE Card SET rectoFirst = 1 WHERE deck=? AND changeSide IS NULL`,
            [idDeck],
        )
        .then(() => true)
        .catch(() => false);
};
