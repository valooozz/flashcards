import { SQLiteDatabase } from 'expo-sqlite';
import { DeckDocument } from '../../../types/DeckDocument';
import { DeckType } from '../../../types/DeckType';
import { exportDocument } from '../../exportDocument.utils';
import { getCardsFromDeck } from '../card/get/getCardsFromDeck.utils';
import { getAllDecks } from './get/getAllDecks.utils';

export const exportAllDecks = async (database: SQLiteDatabase) => {
  const decks: DeckType[] = await getAllDecks(database);

  const bddDocument: DeckDocument[] = [];

  for (const deck of decks) {
    const deckDocument: DeckDocument = {
      deckName: deck.name,
      cards: [],
    };

    const cards = await getCardsFromDeck(database, deck.id.toString());
    cards.forEach((card) => {
      deckDocument.cards.push({
        recto: card.recto,
        verso: card.verso,
        rectoFirst: Boolean(card.rectoFirst),
        step: card.step,
        nextRevision: card.nextRevision,
        toLearn: Boolean(card.toLearn),
        changeSide: Boolean(card.changeSide),
      });
    });

    bddDocument.push(deckDocument);
  }

  exportDocument(bddDocument, 'Flashcards');
};
