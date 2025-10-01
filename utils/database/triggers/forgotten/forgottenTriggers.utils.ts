import { SQLiteDatabase } from 'expo-sqlite';

export const createForgottenTriggers = async (database: SQLiteDatabase) => {
  try {

    // Trigger to prevent duplicate forgotten entries for the same day
    await database.execAsync(`
      CREATE TRIGGER IF NOT EXISTS trigger_forgotten_prevent_duplicate
      BEFORE INSERT ON Forgotten
      BEGIN
        SELECT CASE
          WHEN EXISTS(
            SELECT 1 FROM Forgotten 
            WHERE idCard = NEW.idCard AND date = NEW.date
          ) THEN
            RAISE(ABORT, 'Card already marked as forgotten for this date')
        END;
      END;
    `);

  } catch (error) {
    console.error('Error creating forgotten triggers:', error);
    throw error;
  }
};
