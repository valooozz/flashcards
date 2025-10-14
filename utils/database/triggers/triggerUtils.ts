import { SQLiteDatabase } from 'expo-sqlite';

export const listAllTriggers = async (database: SQLiteDatabase): Promise<string[]> => {
    try {
        const rows = await database.getAllAsync<{ name: string }>(
            "SELECT name FROM sqlite_master WHERE type = 'trigger'"
        );
        return rows.map(row => row.name);
    } catch (error) {
        console.error('Error listing triggers:', error);
        return [];
    }
};

export const dropTrigger = async (database: SQLiteDatabase, triggerName: string): Promise<void> => {
    try {
        await database.execAsync(`DROP TRIGGER IF EXISTS ${triggerName};`);
        console.info(`Trigger ${triggerName} dropped successfully`);
    } catch (error) {
        console.error(`Error dropping trigger ${triggerName}:`, error);
        throw error;
    }
};

export const dropAllTriggers = async (database: SQLiteDatabase): Promise<void> => {
    try {
        const triggers = await listAllTriggers(database);

        for (const triggerName of triggers) {
            await dropTrigger(database, triggerName);
        }

        console.info('All triggers dropped successfully');
    } catch (error) {
        console.error('Error dropping all triggers:', error);
        throw error;
    }
};

export const triggerExists = async (database: SQLiteDatabase, triggerName: string): Promise<boolean> => {
    try {
        const rows = await database.getAllAsync<{ name: string }>(
            "SELECT name FROM sqlite_master WHERE type = 'trigger' AND name = ?",
            [triggerName]
        );
        return rows.length > 0;
    } catch (error) {
        console.error(`Error checking if trigger ${triggerName} exists:`, error);
        return false;
    }
};

export const getTriggerDefinition = async (database: SQLiteDatabase, triggerName: string): Promise<string | null> => {
    try {
        const rows = await database.getAllAsync<{ sql: string }>(
            "SELECT sql FROM sqlite_master WHERE type = 'trigger' AND name = ?",
            [triggerName]
        );
        return rows.length > 0 ? rows[0].sql : null;
    } catch (error) {
        console.error(`Error getting trigger definition for ${triggerName}:`, error);
        return null;
    }
};
