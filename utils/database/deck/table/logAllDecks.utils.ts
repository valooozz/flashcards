import { SQLiteDatabase } from 'expo-sqlite';
import { CardType } from '../../../../types/CardType';

export const logAllDecks = async (database: SQLiteDatabase) => {
    try {
        const decksResult =
            await database.getAllAsync<CardType>('SELECT * FROM Deck');
        console.log('=== all decks:');
        decksResult.forEach((deck) => {
            console.log('-', deck);
        });
    } catch (error) {
        console.error('logAllDecks:', error);
    }
};
