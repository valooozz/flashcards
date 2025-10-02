import { SQLiteDatabase } from "expo-sqlite";
import { setUserVersion } from "./setUserVersion.utils";

export const migrateToV3 = async (database: SQLiteDatabase) => {
    try {
        await database.execAsync('BEGIN TRANSACTION;');

        await database.execAsync('ALTER TABLE Deck ADD COLUMN showName INTEGER NOT NULL DEFAULT 1;');

        await setUserVersion(database, 3);
        await database.execAsync('COMMIT;');
    } catch (error) {
        console.error('migrateToV3:', error);
        try { await database.execAsync('ROLLBACK;'); } catch { }
        throw error;
    }
};