import { SQLiteDatabase } from 'expo-sqlite';
import { CardType } from '../../types/types';

export const dropTableCard = async (database: SQLiteDatabase) => {
  try {
    await database.execAsync('DROP TABLE Card;');
    console.log('table Card dropped');
  } catch (error) {
    console.error(error);
  }
};

export const emptyTableCard = async (database: SQLiteDatabase) => {
  try {
    await database.execAsync('DELETE FROM Card;');
    console.log('table Card emptied');
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

export const logAllCards = async (database: SQLiteDatabase) => {
  try {
    const cardsResult =
      await database.getAllAsync<CardType>('SELECT * FROM Card');
    console.log('all cards:', cardsResult);
  } catch (error) {
    console.error(error);
  }
};

export const getCardsFromDeck = async (
  database: SQLiteDatabase,
  idDeck: string,
) => {
  let cardsResult: CardType[] = [];
  try {
    cardsResult = await database.getAllAsync<CardType>(
      'SELECT * FROM Card WHERE deck=?;',
      idDeck,
    );
  } catch (error) {
    console.error(error);
  }

  return cardsResult;
};

export const createCard = async (
  database: SQLiteDatabase,
  recto: string,
  verso: string,
  idDeck: string,
) => {
  try {
    database.runAsync(
      'INSERT INTO Card (recto, verso, deck, nextRevision) VALUES (?, ?, ?, ?);',
      [recto, verso, idDeck, null],
    );
    console.log('Nouvelle carte:', recto, verso, idDeck);
  } catch (error) {
    console.error(error);
  }
};
