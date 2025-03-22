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
  let cards: CardType[] = [];
  try {
    cards = await database.getAllAsync<CardType>(
      'SELECT * FROM Card WHERE deck=?;',
      idDeck,
    );
  } catch (error) {
    console.error(error);
  }

  return cards;
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

export const updateCard = async (
  database: SQLiteDatabase,
  id: string,
  recto: string,
  verso: string,
) => {
  try {
    database.runAsync('UPDATE Card SET recto=?, verso=? WHERE id=?', [
      recto,
      verso,
      id,
    ]);
    console.log('MAJ carte:', id, recto, verso);
  } catch (error) {
    console.error(error);
  }
};

export const deleteCard = async (database: SQLiteDatabase, id: string) => {
  try {
    database.runAsync('DELETE FROM Card WHERE id=?', [id]);
    console.log('Carte', id, 'supprimée');
  } catch (error) {
    console.error(error);
  }
};

export const getCardById = async (database: SQLiteDatabase, id: string) => {
  let card: CardType;
  try {
    card = await database.getFirstAsync<CardType>(
      'SELECT * FROM Card WHERE id=?',
      id,
    );
  } catch (error) {
    console.error(error);
  }

  return card;
};
