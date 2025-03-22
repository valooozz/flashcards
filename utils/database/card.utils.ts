import { SQLiteDatabase } from 'expo-sqlite';

export const dropTableCard = async (database: SQLiteDatabase) => {
  try {
    await database.execAsync('DROP TABLE Card');
    console.log('table Card dropped');
  } catch (error) {
    console.error(error);
  }
};

export const createTableCard = async (database: SQLiteDatabase) => {
  try {
    await database.execAsync(
      'CREATE TABLE IF NOT EXISTS Card (id INTEGER PRIMARY KEY AUTOINCREMENT, recto TEXT, verso TEXT, deck INTEGER, nextRevision TEXT, FOREIGN KEY(deck) REFERENCES Deck(id));',
    );
    console.log('table Card created');
  } catch (error) {
    console.error(error);
  }
};
