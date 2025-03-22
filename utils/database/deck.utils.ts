import { SQLiteDatabase } from 'expo-sqlite';

export const dropTableDeck = async (database: SQLiteDatabase) => {
  try {
    await database.execAsync('DROP TABLE Deck;');
    console.log('table Deck dropped');
  } catch (error) {
    console.error(error);
  }
};

export const emptyTableDeck = async (database: SQLiteDatabase) => {
  try {
    await database.execAsync('DELETE FROM Deck;');
    console.log('table Deck emptied');
  } catch (error) {
    console.error(error);
  }
};

export const createTableDeck = async (database: SQLiteDatabase) => {
  try {
    await database.execAsync(
      'CREATE TABLE IF NOT EXISTS Deck (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT UNIQUE);',
    );
    console.log('table Deck created');
  } catch (error) {
    console.error(error);
  }
};

export const getNameById = async (database: SQLiteDatabase, idDeck: string) => {
  let deckNameResult: object = undefined;
  try {
    deckNameResult = await database.getFirstAsync<object>(
      'SELECT name FROM Deck WHERE id=?;',
      idDeck,
    );
  } catch (error) {
    console.error(error);
  }

  return deckNameResult['name'];
};
