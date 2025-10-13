import { SQLiteDatabase } from 'expo-sqlite';
import { DeckDocument } from '../../../types/DeckDocument';
import { ImportExportType } from '../../../types/ImportExportType';
import { exportDocument } from '../../export/exportDocument.utils';
import { transformJsonToCsv } from '../../export/transformJsonToCsv.utils';
import { getCardsFromDeck } from '../card/get/getCardsFromDeck.utils';

export const exportDeck = async (
  database: SQLiteDatabase,
  idDeck: string,
  deckName: string,
  changeSide: boolean,
  showName: boolean,
  exportType: ImportExportType,
  fullExport: boolean,
) => {
  const cards = await getCardsFromDeck(database, Number(idDeck), true);

  const deckDocument: DeckDocument = {
    deckName,
    changeSide,
    showName,
    cards: [],
  };

  cards.forEach((card) => {
    if (exportType === 'json' && fullExport) {
      deckDocument.cards.push({
        recto: card.recto,
        verso: card.verso,
        rectoImage: card.rectoImage ?? null,
        versoImage: card.versoImage ?? null,
        rectoFirst: Boolean(card.rectoFirst),
        step: card.step,
        nextRevision: card.nextRevision,
        toLearn: Boolean(card.toLearn),
        changeSide: card.changeSide === null ? null : Boolean(card.changeSide),
      });
    } else {
      deckDocument.cards.push({
        recto: card.recto,
        verso: card.verso,
        rectoImage: card.rectoImage ?? null,
        versoImage: card.versoImage ?? null,
        changeSide: card.changeSide === null ? null : Boolean(card.changeSide),
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
