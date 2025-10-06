import { SQLiteDatabase } from 'expo-sqlite';
import { FlashCardType } from '../../../../types/FlashCardType';
import { CardsToReviseLearnt, StepDelimiter } from '../../../../types/FlashRevisionSettings';

export const getFlashCardsFromDeck = async (
  database: SQLiteDatabase,
  idDeck: number,
  cardsToReviseLearnt: CardsToReviseLearnt,
  stepDelimiter?: StepDelimiter
): Promise<FlashCardType[]> => {
  let flashcards: FlashCardType[];


  try {
    flashcards = await database.getAllAsync<FlashCardType>(
      `SELECT
        C.id,
        C.recto,
        C.verso,
        C.rectoImage,
        C.versoImage,
        C.rectoFirst,
        C.step,
        C.nextRevision,
        C.changeSide
      FROM Card C
      INNER JOIN Deck D ON C.deck=D.id
      WHERE D.id=? AND C.toLearn=1
      ${cardsToReviseLearnt !== 'all' ? `AND C.nextRevision IS ${cardsToReviseLearnt === 'learnt' ? 'NOT' : ''} NULL` : ''}
      ${stepDelimiter ? `AND C.step ${stepDelimiter.above ? '>=' : '<='} ${stepDelimiter.step}` : ''}`,
      [idDeck],
    );
  } catch (error) {
    console.error('getFlashCardsFromDeck:', error);
  }

  return flashcards;
};
