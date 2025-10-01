import { SQLiteDatabase } from 'expo-sqlite';

const getUserVersion = async (database: SQLiteDatabase): Promise<number> => {
    try {
        const rows = await database.getAllAsync<{ user_version: number }>('PRAGMA user_version;');
        return rows?.[0]?.user_version ?? 0;
    } catch (error) {
        console.error(error);
        return 0;
    }
};

const setUserVersion = async (database: SQLiteDatabase, version: number) => {
    try {
        await database.execAsync(`PRAGMA user_version = ${version};`);
    } catch (error) {
        console.error(error);
    }
};

const doesColumnExist = async (database: SQLiteDatabase, table: string, column: string): Promise<boolean> => {
    try {
        const rows = await database.getAllAsync<{ name: string }>(`PRAGMA table_info(${table});`);
        return rows.some((row) => row.name === column);
    } catch (error) {
        console.error(error);
        return false;
    }
};

const migrateToV1 = async (database: SQLiteDatabase) => {
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

const migrateToV0 = async (database: SQLiteDatabase) => {
    try {
        await database.execAsync('BEGIN TRANSACTION;');

        await database.execAsync(
            `CREATE TABLE IF NOT EXISTS Deck_new(
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT UNIQUE NOT NULL
            );`,
        );

        await database.execAsync(
            `INSERT INTO Deck_new (id, name)
            SELECT id, name FROM Deck;`,
        );

        await database.execAsync('DROP TABLE Deck;');
        await database.execAsync('ALTER TABLE Deck_new RENAME TO Deck;');

        await setUserVersion(database, 0);
        await database.execAsync('COMMIT;');
    } catch (error) {
        console.error(error);
        try { await database.execAsync('ROLLBACK;'); } catch { }
        throw error;
    }
}

export const migrateDatabase = async (database: SQLiteDatabase) => {
    const currentVersion = await getUserVersion(database);

    if (currentVersion < 1) {
        await migrateToV1(database);
    }
};


