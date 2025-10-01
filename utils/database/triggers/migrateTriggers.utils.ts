import { SQLiteDatabase } from 'expo-sqlite';
import { createAllTriggers } from './createAllTriggers.utils';
import { dropAllTriggers } from './triggerUtils';

export const migrateTriggers = async (database: SQLiteDatabase, fromVersion: number, toVersion: number) => {
    try {
        // For now, we'll recreate all triggers on any migration
        // In the future, you might want more granular trigger versioning
        if (fromVersion < toVersion) {
            // Drop existing triggers and recreate them
            await dropAllTriggers(database);
            await createAllTriggers(database);
        }
    } catch (error) {
        console.error('Error migrating triggers:', error);
        throw error;
    }
};
