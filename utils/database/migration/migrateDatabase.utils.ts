import { SQLiteDatabase } from 'expo-sqlite';
import { getUserVersion } from './getUserVersion.utils';
import { migrateToV1 } from './migrateToV1.utils';
import { migrateToV2 } from './migrateToV2.utils';
import { migrateToV3 } from './migrateToV3.utils';

export const migrateDatabase = async (database: SQLiteDatabase) => {
    const currentVersion = await getUserVersion(database);

    if (currentVersion < 1) {
        await migrateToV1(database);
    }

    if (currentVersion < 2) {
        await migrateToV2(database);
    }

    if (currentVersion < 3) {
        await migrateToV3(database);
    }
};


