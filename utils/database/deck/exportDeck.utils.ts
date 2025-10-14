import { SQLiteDatabase } from 'expo-sqlite';
import { DeckDocument } from '../../../types/DeckDocument';
import { ImportExportType } from '../../../types/ImportExportType';
import { exportDeckBundle } from '../../export/exportDeckBundle.utils';
import { exportDocument } from '../../export/exportDocument.utils';
import { transformJsonToCsv } from '../../export/transformJsonToCsv.utils';
import { fileToDataUri } from '../../images/fileToDataUri.utils';
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

  let hasImage = false;

  for (const card of cards) {
    const rectoImageData = card.rectoImage ? await fileToDataUri(card.rectoImage) : null;
    const versoImageData = card.versoImage ? await fileToDataUri(card.versoImage) : null;
    if (exportType === 'json' && fullExport) {
      deckDocument.cards.push({
        recto: card.recto,
        verso: card.verso,
        ...(rectoImageData ? { rectoImage: rectoImageData } : {}),
        ...(versoImageData ? { versoImage: versoImageData } : {}),
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
        ...(rectoImageData ? { rectoImage: rectoImageData } : {}),
        ...(versoImageData ? { versoImage: versoImageData } : {}),
        changeSide: card.changeSide === null ? null : Boolean(card.changeSide),
      });
    }
    if (rectoImageData || versoImageData) {
      hasImage = true;
    }
  }

  let dataToExport: DeckDocument[] | string;

  if (exportType === 'csv') {
    dataToExport = transformJsonToCsv(deckDocument)
  } else {
    dataToExport = [deckDocument];
  }

  if (exportType === 'json' && hasImage) {
    await exportDeckBundle(database, idDeck, deckName, changeSide, showName);
  } else {
    await exportDocument(dataToExport, deckName, exportType);
  }
};
