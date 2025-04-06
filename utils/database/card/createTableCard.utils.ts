import { SQLiteDatabase } from 'expo-sqlite';

export const createTableCard = async (database: SQLiteDatabase) => {
  try {
    await database.execAsync(
      'CREATE TABLE IF NOT EXISTS Card (id INTEGER PRIMARY KEY AUTOINCREMENT, deck INTEGER, recto TEXT, verso TEXT, rectoFirst INTEGER, step INTEGER, nextRevision TEXT, toLearn INTEGER, changeSide INTEGER, FOREIGN KEY(deck) REFERENCES Deck(id));',
    );
    console.log('table Card created');
  } catch (error) {
    console.error(error);
  }
};
