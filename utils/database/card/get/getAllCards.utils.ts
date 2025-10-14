import { SQLiteDatabase } from 'expo-sqlite';
import { CardType } from '../../../../types/CardType';

export const getAllCards = async (
    database: SQLiteDatabase,
): Promise<CardType[]> => {
    let cards: CardType[] = [];
    try {
        cards = await database.getAllAsync<CardType>(
            `SELECT
                C.id,
                C.recto,
                C.verso,
                C.rectoImage,
                C.versoImage,
                C.deck,
                D.name,
                C.rectoFirst,
                C.step,
                C.nextRevision,
                C.toLearn,
                C.changeSide
            FROM Card C
            INNER JOIN Deck D ON C.deck = D.id;
        `);
    } catch (error) {
        console.error('getAllCards:', error);
    }

    return cards;
};
