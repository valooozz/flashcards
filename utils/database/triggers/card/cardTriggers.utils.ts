import { SQLiteDatabase } from 'expo-sqlite';

export const createCardTriggers = async (database: SQLiteDatabase) => {
    try {

        // Trigger to validate card data integrity
        await database.execAsync(`
            CREATE TRIGGER IF NOT EXISTS trigger_card_validate
            BEFORE INSERT ON Card
            BEGIN
                -- Ensure step is non-negative
                SELECT CASE
                WHEN NEW.step < 0 THEN
                    RAISE(ABORT, 'Card step must be non-negative')
                END;
                
                -- Ensure toLearn is 0 or 1
                SELECT CASE
                WHEN NEW.toLearn NOT IN (0, 1) THEN
                    RAISE(ABORT, 'Card toLearn must be 0 or 1')
                END;
            END;
        `);

        // Trigger to update rectoFirst when changeSide changes
        await database.execAsync(`
            CREATE TRIGGER IF NOT EXISTS trigger_card_change_side_updated
            AFTER UPDATE OF changeSide ON Card
            WHEN (NEW.changeSide = 0 AND (OLD.changeSide = 1 OR OLD.changeSide IS NULL) OR (NEW.changeSide IS NULL AND OLD.changeSide = 1))
            BEGIN
                UPDATE Card
                SET rectoFirst = CASE
                    WHEN (NEW.changeSide = 0 OR (NEW.changeSide IS NULL AND ((SELECT changeSide FROM Deck WHERE Deck.id = NEW.deck) = 0))) THEN 1
                    ELSE rectoFirst
                END
                WHERE id = NEW.id;
            END;
        `);

    } catch (error) {
        console.error('Error creating card triggers:', error);
        throw error;
    }
};
