import { SQLiteDatabase } from 'expo-sqlite';
import { DeckDocument } from '../../../types/DeckDocument';
import { exportDocument } from '../../export/exportDocument.utils';
import { getCardsFromDeck } from '../card/get/getCardsFromDeck.utils';
import { transformJsonToCsv } from '../../export/transformJsonToCsv.utils';
import { ImportExportType } from '../../../types/ImportExportType';

export const exportDeck = async (
  database: SQLiteDatabase,
  idDeck: string,
  deckName: string,
  exportType: ImportExportType,
  fullExport: boolean,
) => {
  const cards = await getCardsFromDeck(database, Number(idDeck));

  const deckDocument: DeckDocument = {
    deckName,
    cards: [],
  };

  cards.forEach((card) => {
    if (exportType === 'json' && fullExport) {
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

  let dataToExport: DeckDocument[] | string;

  if (exportType === 'csv') {
    dataToExport = transformJsonToCsv(deckDocument)
  } else {
    dataToExport = [deckDocument];
  }

  await exportDocument(dataToExport, deckName, exportType);
};
