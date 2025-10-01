import { SQLiteDatabase } from "expo-sqlite";

export const getUserVersion = async (database: SQLiteDatabase): Promise<number> => {
    try {
        const rows = await database.getAllAsync<{ user_version: number }>('PRAGMA user_version;');
        return rows?.[0]?.user_version ?? 0;
    } catch (error) {
        console.error(error);
        return 0;
    }
};