import { SQLiteDatabase } from 'expo-sqlite';
import { DeckDocument } from '../../types/DeckDocument';
import { importDecks } from '../database/deck/importDecks.utils';
import { saveImageFromDataUri } from '../images/saveImageFromDataUri.utils';

export const importInDatabase = async (
  database: SQLiteDatabase,
  decksDocument: DeckDocument[],
): Promise<boolean> => {
  // Convert embedded images (data URIs) to files and replace with file paths
  for (const deck of decksDocument) {
    let cardIndex = 0;
    for (const card of deck.cards) {
      if (card.rectoImage && card.rectoImage.startsWith('data:')) {
        card.rectoImage = await saveImageFromDataUri(card.rectoImage, deck.deckName, `card_${cardIndex}_recto`);
      }
      if (card.versoImage && card.versoImage.startsWith('data:')) {
        card.versoImage = await saveImageFromDataUri(card.versoImage, deck.deckName, `card_${cardIndex}_verso`);
      }
      cardIndex += 1;
    }
  }

  return await importDecks(database, decksDocument);
};
