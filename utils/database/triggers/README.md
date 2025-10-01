# Database Triggers Organization

This directory contains all database triggers for the flashcards application, organized by table and functionality.

## Directory Structure

```
triggers/
├── createAllTriggers.utils.ts    # Main entry point for creating all triggers
├── migrateTriggers.utils.ts      # Trigger migration logic
├── triggerUtils.ts               # Utility functions for trigger management
├── card/
│   └── cardTriggers.utils.ts     # Card table triggers
├── deck/
│   └── deckTriggers.utils.ts     # Deck table triggers
├── stats/
│   └── statsTriggers.utils.ts    # Stats table triggers
└── forgotten/
    └── forgottenTriggers.utils.ts # Forgotten table triggers
```

## Trigger Categories

### Card Triggers (`card/cardTriggers.utils.ts`)
- **trigger_card_validate**: Validates card data integrity on insert
- **trigger_card_change_side_updated**: Updates rectoFirst when changeSide changes

### Deck Triggers (`deck/deckTriggers.utils.ts`)
- **trigger_deck_change_side_updated**: Updates rectoFirst on all cards when changeSide of deck changes

### Stats Triggers (`stats/statsTriggers.utils.ts`)
- **trigger_stats_validate_values_insert**: Ensures stats values are non-negative on insert
- **trigger_stats_validate_values_update**: Ensures stats values are non-negative on update

### Forgotten Triggers (`forgotten/forgottenTriggers.utils.ts`)
- **trigger_forgotten_prevent_duplicate**: Prevents duplicate forgotten entries

## Usage

### Creating Triggers
```typescript
import { createAllTriggers } from './triggers/createAllTriggers.utils';

// Create all triggers (usually done during database initialization)
await createAllTriggers(database);
```

### Managing Triggers
```typescript
import { 
  listAllTriggers, 
  dropTrigger, 
  triggerExists,
  getTriggerDefinition 
} from './triggers/triggerUtils';

// List all triggers
const triggers = await listAllTriggers(database);

// Check if a trigger exists
const exists = await triggerExists(database, 'trigger_card_created');

// Get trigger definition
const definition = await getTriggerDefinition(database, 'trigger_card_created');

// Drop a specific trigger
await dropTrigger(database, 'trigger_card_created');
```

### Migration
```typescript
import { migrateTriggers } from './triggers/migrateTriggers.utils';

// Migrate triggers during database migration
await migrateTriggers(database, fromVersion, toVersion);
```

## Best Practices

1. **Naming Convention**: Use descriptive names with the pattern `trigger_{table}_{action}`
2. **Error Handling**: Always include proper error handling in trigger creation
3. **Validation**: Use triggers for data validation and integrity checks
4. **Performance**: Be mindful of trigger performance impact on bulk operations
5. **Testing**: Test triggers thoroughly, especially those that modify data
6. **Documentation**: Document complex trigger logic and business rules

## Adding New Triggers

1. Create the trigger in the appropriate table-specific file
2. Add the trigger creation call to the main trigger creation function
3. Update this README with the new trigger documentation
4. Test the trigger thoroughly
5. Consider migration implications if modifying existing triggers

## Common Trigger Patterns

### Data Validation
```sql
CREATE TRIGGER trigger_validate_data
BEFORE INSERT ON Table
BEGIN
  SELECT CASE
    WHEN NEW.column < 0 THEN
      RAISE(ABORT, 'Column must be non-negative')
  END;
END;
```

### Cascade Operations
```sql
CREATE TRIGGER trigger_cascade_delete
AFTER DELETE ON ParentTable
BEGIN
  DELETE FROM ChildTable WHERE parent_id = OLD.id;
END;
```

### Statistics Updates
```sql
CREATE TRIGGER trigger_update_stats
AFTER INSERT ON Table
BEGIN
  INSERT OR REPLACE INTO Stats (date, count)
  VALUES (date('now'), 
    COALESCE((SELECT count FROM Stats WHERE date = date('now')), 0) + 1
  );
END;
```
