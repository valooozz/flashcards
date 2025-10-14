import { SQLiteDatabase } from 'expo-sqlite';
import { CardType } from '../../../../types/CardType';

export const logAllDecks = async (database: SQLiteDatabase) => {
    try {
        const decksResult =
            await database.getAllAsync<CardType>('SELECT * FROM Deck');
        console.info('=== all decks:');
        decksResult.forEach((deck) => {
            console.info('-', deck);
        });
    } catch (error) {
        console.error('logAllDecks:', error);
    }
};
