import { SQLiteDatabase } from 'expo-sqlite';
import { CardDocument, DeckDocument } from '../../../types/DeckDocument';
import { createCard } from '../card/createCard.utils';
import { createDeck } from './createDeck.utils';

export const importDeck = async (
  database: SQLiteDatabase,
  deckDocument: DeckDocument,
): Promise<boolean> => {
  const idDeck = await createDeck(database, deckDocument.deckName);
  if (idDeck === -1) {
    return false;
  }

  deckDocument.cards.forEach((card: CardDocument) => {
    createCard(
      database,
      card.recto,
      card.verso,
      String(idDeck),
      card.changeSide,
      card.rectoFirst,
      card.step,
      card.nextRevision,
      card.toLearn,
    );
  });

  return true;
};
