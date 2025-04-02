import { SQLiteDatabase } from 'expo-sqlite';
import { CardType } from '../../../types/types';

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
