import { SQLiteDatabase } from 'expo-sqlite';

export const createTableCard = async (database: SQLiteDatabase) => {
  try {
    await database.execAsync(
      `CREATE TABLE IF NOT EXISTS Card (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        deck INTEGER NOT NULL,
        recto TEXT NOT NULL,
        verso TEXT NOT NULL,
        rectoImage TEXT,
        versoImage TEXT,
        rectoFirst INTEGER NOT NULL,
        step INTEGER NOT NULL,
        nextRevision TEXT,
        toLearn INTEGER NOT NULL,
        changeSide INTEGER,
        FOREIGN KEY(deck)
        REFERENCES Deck(id)
      );`,
    );
  } catch (error) {
    console.error('createTableCard:', error);
  }
};
