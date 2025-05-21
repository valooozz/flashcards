import { FlashCardType } from '../types/FlashCardType';

export const isLastItem = (
  card: FlashCardType,
  listOfCards: FlashCardType[],
): boolean => {
  return listOfCards[listOfCards.length - 1].id === card.id;
};
