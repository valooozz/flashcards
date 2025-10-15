import { SQLiteDatabase } from 'expo-sqlite';
import { FlashCardType } from '../../../../types/FlashCardType';
import { CardsToReviseLearnt, StepDelimiter } from '../../../../types/FlashRevisionSettings';

export const getFlashCardsForFlashRevision = async (
  database: SQLiteDatabase,
  idDeck: number,
  cardsToReviseLearnt: CardsToReviseLearnt,
  stepDelimiter?: StepDelimiter
): Promise<FlashCardType[]> => {
  let flashcards: FlashCardType[];

  const globalRevision = idDeck === -1;

  try {
    flashcards = await database.getAllAsync<FlashCardType>(
      `SELECT
        C.id,
        C.recto,
        C.verso,
        C.rectoImage,
        C.versoImage,
        ${globalRevision ? "CASE WHEN D.showName = 1 THEN D.name ELSE '' END as name," : ''}
        C.rectoFirst,
        C.step,
        C.nextRevision,
        C.changeSide
      FROM Card C
      INNER JOIN Deck D ON C.deck=D.id
      WHERE C.toLearn=1
      ${globalRevision ? '' : `AND D.id=${idDeck}`}
      ${cardsToReviseLearnt !== 'all' ? `AND C.nextRevision IS ${cardsToReviseLearnt === 'learnt' ? 'NOT' : ''} NULL` : ''}
      ${stepDelimiter ? `AND C.step ${stepDelimiter.above ? '>=' : '<='} ${stepDelimiter.step}` : ''}`,
    );
  } catch (error) {
    console.error('getFlashCardsFromDeck:', error);
  }

  return flashcards;
};
