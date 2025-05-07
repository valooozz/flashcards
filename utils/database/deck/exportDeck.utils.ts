import { SQLiteDatabase } from 'expo-sqlite';
import { DeckDocument } from '../../../types/DeckDocument';
import { exportDocument } from '../../exportDocument.utils';
import { getCardsFromDeck } from '../card/get/getCardsFromDeck.utils';

export const exportDeck = async (
  database: SQLiteDatabase,
  idDeck: string,
  deckName: string,
  fullExport: boolean,
) => {
  const cards = await getCardsFromDeck(database, idDeck);

  const deckDocument: DeckDocument = {
    deckName,
    cards: [],
  };

  cards.forEach((card) => {
    if (fullExport) {
      deckDocument.cards.push({
        recto: card.recto,
        verso: card.verso,
        rectoFirst: Boolean(card.rectoFirst),
        step: card.step,
        nextRevision: card.nextRevision,
        toLearn: Boolean(card.toLearn),
        changeSide: Boolean(card.changeSide),
      });
    } else {
      deckDocument.cards.push({
        recto: card.recto,
        verso: card.verso,
        changeSide: Boolean(card.changeSide),
      });
    }
  });

  await exportDocument(deckDocument, deckName);
};
