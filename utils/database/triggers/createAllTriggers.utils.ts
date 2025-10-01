import { SQLiteDatabase } from 'expo-sqlite';
import { createCardTriggers } from './card/cardTriggers.utils';
import { createDeckTriggers } from './deck/deckTriggers.utils';
import { createForgottenTriggers } from './forgotten/forgottenTriggers.utils';
import { createStatsTriggers } from './stats/statsTriggers.utils';

export const createAllTriggers = async (database: SQLiteDatabase) => {
    try {
        await createCardTriggers(database);
        await createDeckTriggers(database);
        await createStatsTriggers(database);
        await createForgottenTriggers(database);
    } catch (error) {
        console.error('Error creating database triggers:', error);
        throw error;
    }
};
