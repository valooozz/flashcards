import { SQLiteDatabase } from "expo-sqlite";
import { setUserVersion } from "./setUserVersion.utils";

export const migrateToV1 = async (database: SQLiteDatabase) => {
    try {
        await database.execAsync('BEGIN TRANSACTION;');

        // 1) Add Deck.changeSide
        await database.execAsync('ALTER TABLE Deck ADD COLUMN changeSide INTEGER NOT NULL DEFAULT 1;');

        // 2) Recreate Card table to enforce constraints
        await database.execAsync(
            `CREATE TABLE IF NOT EXISTS Card_new (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                deck INTEGER NOT NULL,
                recto TEXT NOT NULL,
                verso TEXT NOT NULL,
                rectoFirst INTEGER NOT NULL,
                step INTEGER NOT NULL,
                nextRevision TEXT,
                toLearn INTEGER NOT NULL,
                changeSide INTEGER,
                FOREIGN KEY(deck)
                REFERENCES Deck(id)
                ON UPDATE CASCADE
                ON DELETE CASCADE
            );`,
        );

        // Copy existing data
        await database.execAsync(
            `INSERT INTO Card_new (id, deck, recto, verso, rectoFirst, step, nextRevision, toLearn, changeSide)
            SELECT id, deck, recto, verso, rectoFirst, step, nextRevision, toLearn, changeSide FROM Card;`,
        );

        // Replace old table
        await database.execAsync('DROP TABLE Card;');
        await database.execAsync('ALTER TABLE Card_new RENAME TO Card;');

        await setUserVersion(database, 1);
        await database.execAsync('COMMIT;');
    } catch (error) {
        console.error(error);
        try { await database.execAsync('ROLLBACK;'); } catch { }
        throw error;
    }
};