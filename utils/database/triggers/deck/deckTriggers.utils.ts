import { SQLiteDatabase } from 'expo-sqlite';

export const createDeckTriggers = async (database: SQLiteDatabase) => {
  try {

    // Trigger to update rectoFirst on all cards when deck changeSide changes
    await database.execAsync(`
      CREATE TRIGGER IF NOT EXISTS trigger_deck_change_side_updated
      AFTER UPDATE OF changeSide ON Deck
      WHEN NEW.changeSide != OLD.changeSide AND NEW.changeSide = 0
      BEGIN
        UPDATE Card
        SET rectoFirst = 1
        WHERE Card.deck = NEW.id AND Card.changeSide IS NULL;
      END;
    `);

  } catch (error) {
    console.error('Error creating deck triggers:', error);
    throw error;
  }
};
