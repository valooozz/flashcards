import { SQLiteDatabase } from "expo-sqlite";
import { setUserVersion } from "./setUserVersion.utils";

export const migrateToV2 = async (database: SQLiteDatabase) => {
    try {
        await database.execAsync('BEGIN TRANSACTION;');

        await database.execAsync('ALTER TABLE Card ADD COLUMN rectoImage TEXT DEFAULT NULL;');
        await database.execAsync('ALTER TABLE Card ADD COLUMN versoImage TEXT DEFAULT NULL;');

        await setUserVersion(database, 2);
        await database.execAsync('COMMIT;');
    } catch (error) {
        console.error('migrateToV2:', error);
        try { await database.execAsync('ROLLBACK;'); } catch { }
        throw error;
    }
};