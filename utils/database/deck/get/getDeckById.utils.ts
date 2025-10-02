import { SQLiteDatabase } from 'expo-sqlite';
import { DeckType } from '../../../../types/DeckType';

export const getDeckById = async (
    database: SQLiteDatabase,
    idDeck: string,
): Promise<DeckType> => {
    let deckResult: DeckType;
    try {
        deckResult = await database.getFirstAsync<DeckType>(
            'SELECT * FROM Deck WHERE id=?;',
            idDeck,
        );
    } catch (error) {
        console.error('getDeckById:', error);
    }

    return deckResult;
};
