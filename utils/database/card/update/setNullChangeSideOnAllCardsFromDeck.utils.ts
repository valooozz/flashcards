import { SQLiteDatabase } from 'expo-sqlite';

export const setNullChangeSideOnAllCardsFromDeck = async (
    database: SQLiteDatabase,
    idDeck: string,
): Promise<boolean> => {
    return database
        .runAsync(
            `UPDATE Card 
            SET
                rectoFirst = CASE WHEN (SELECT changeSide FROM Deck WHERE id=?) = 0 THEN 1 ELSE rectoFirst END,
                changeSide=NULL 
            WHERE deck=?`,
            [idDeck, idDeck],
        )
        .then(() => true)
        .catch(() => false);
};
