import { FlashCardType } from "../types/FlashCardType";

export const preventCardToBeFirst = (card: FlashCardType, cards: FlashCardType[]) => {
    if (cards.length <= 1 || cards[0].id !== card.id) {
        return cards;
    }
    return [...cards.slice(1), card];
}