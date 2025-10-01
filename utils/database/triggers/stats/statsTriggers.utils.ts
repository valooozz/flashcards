import { SQLiteDatabase } from 'expo-sqlite';

/**
 * Creates all triggers related to the Stats table
 */
export const createStatsTriggers = async (database: SQLiteDatabase) => {
    try {

        // Triggers to validate stats values are non-negative
        await database.execAsync(`
      CREATE TRIGGER IF NOT EXISTS trigger_stats_validate_values_insert
      BEFORE INSERT ON Stats
      BEGIN
        SELECT CASE
          WHEN NEW.nbKnown < 0 THEN
            RAISE(ABORT, 'nbKnown must be non-negative')
          WHEN NEW.nbForgotten < 0 THEN
            RAISE(ABORT, 'nbForgotten must be non-negative')
          WHEN NEW.nbLearnt < 0 THEN
            RAISE(ABORT, 'nbLearnt must be non-negative')
        END;
      END;
    `);
        await database.execAsync(`
      CREATE TRIGGER IF NOT EXISTS trigger_stats_validate_values_update
      BEFORE UPDATE ON Stats
      BEGIN
        SELECT CASE
          WHEN NEW.nbKnown < 0 THEN
            RAISE(ABORT, 'nbKnown must be non-negative')
          WHEN NEW.nbForgotten < 0 THEN
            RAISE(ABORT, 'nbForgotten must be non-negative')
          WHEN NEW.nbLearnt < 0 THEN
            RAISE(ABORT, 'nbLearnt must be non-negative')
        END;
      END;
    `);

    } catch (error) {
        console.error('Error creating stats triggers:', error);
        throw error;
    }
};
