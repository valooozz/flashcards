import { SQLiteDatabase } from 'expo-sqlite';
import { getDate } from '../../../getDate.utils';

export const getNbCardsToReviseInDeck = async (
    database: SQLiteDatabase,
    idDeck: number,
): Promise<number> => {

    const today = getDate(0);

    let nbCardsResult: object;
    try {
        nbCardsResult = await database.getFirstAsync(
            'SELECT COUNT(*) FROM Card WHERE deck=? AND nextRevision<=? AND toLearn=1',
            [idDeck, today],
        );
    } catch (error) {
        console.error('getNbCardsToReviseInDeck:', error);
    }

    return nbCardsResult['COUNT(*)'];
};
