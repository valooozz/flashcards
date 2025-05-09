import { SQLiteDatabase } from 'expo-sqlite';
import { CardDocument, DeckDocument } from '../../../types/DeckDocument';
import { createCard } from '../card/createCard.utils';
import { createDeck } from './createDeck.utils';

export const importDecks = async (
  database: SQLiteDatabase,
  decksDocument: DeckDocument[],
): Promise<boolean> => {
  let allDecksAdded = true;
  for (const deckDocument of decksDocument) {
    const idDeck = await createDeck(database, deckDocument.deckName);
    if (idDeck === -1) {
      allDecksAdded = false;
      continue;
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
  }

  return allDecksAdded;
};
