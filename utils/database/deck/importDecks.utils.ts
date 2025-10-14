import { SQLiteDatabase } from 'expo-sqlite';
import { DeckDocument } from '../../../types/DeckDocument';
import { createCard } from '../card/createCard.utils';
import { createDeck } from './createDeck.utils';

export const importDecks = async (
  database: SQLiteDatabase,
  decksDocument: DeckDocument[],
): Promise<boolean> => {
  let allDecksAdded = true;
  for (const deckDocument of decksDocument) {
    const idDeck = await createDeck(
      database,
      deckDocument.deckName,
      deckDocument.changeSide !== undefined ? deckDocument.changeSide : true,
      deckDocument.showName !== undefined ? deckDocument.showName : true,
    );
    if (idDeck === -1) {
      allDecksAdded = false;
      continue;
    }

    try {
      await database.execAsync('BEGIN TRANSACTION;');
      for (const card of deckDocument.cards) {
        const ok = await createCard(
          database,
          card.recto,
          card.verso,
          card.rectoImage ?? null,
          card.versoImage ?? null,
          String(idDeck),
          card.changeSide,
          card.toLearn,
          card.rectoFirst,
          card.step,
          card.nextRevision,
        );
        if (!ok) {
          allDecksAdded = false;
        }
      }
      await database.execAsync('COMMIT;');
    } catch (e) {
      allDecksAdded = false;
      try { await database.execAsync('ROLLBACK;'); } catch { }
    }
  }

  return allDecksAdded;
};
