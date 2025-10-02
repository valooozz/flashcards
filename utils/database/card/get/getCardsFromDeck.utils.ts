import { SQLiteDatabase } from 'expo-sqlite';
import { CardType } from '../../../../types/CardType';

export const getCardsFromDeck = async (
  database: SQLiteDatabase,
  idDeck: number,
): Promise<CardType[]> => {
  let cards: CardType[] = [];
  try {
    cards = await database.getAllAsync<CardType>(
      `SELECT
        C.id,
        C.recto,
        C.verso,
        C.rectoImage,
        C.versoImage,
        C.deck,
        C.rectoFirst,
        C.step,
        C.nextRevision,
        C.toLearn,
        CASE WHEN C.changeSide IS NOT NULL THEN C.changeSide ELSE D.changeSide END as changeSide
      FROM Card C
      INNER JOIN Deck D ON C.deck=D.id
      WHERE C.deck=?`,
      [idDeck],
    );
  } catch (error) {
    console.error('getCardsFromDeck:', error);
  }

  return cards;
};
