import { SQLiteDatabase } from 'expo-sqlite';
import { CardType } from '../../../../types/CardType';

export const getCardsFromDeck = async (
  database: SQLiteDatabase,
  idDeck: number,
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
