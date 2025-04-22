import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { SQLiteDatabase } from 'expo-sqlite';
import { DeckDocument } from '../../../types/DeckDocument';
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

  const stringDocument = JSON.stringify(deckDocument);
  const exportPath = FileSystem.cacheDirectory + deckName + '.json';

  await FileSystem.writeAsStringAsync(exportPath, stringDocument);

  await Sharing.shareAsync(exportPath);
};
