import { SQLiteDatabase } from "expo-sqlite";
import { LATEST_DB_VERSION } from "../../../const/database.const";

export const getUserVersion = async (database: SQLiteDatabase): Promise<number> => {
    try {
        const rows = await database.getAllAsync<{ user_version: number }>('PRAGMA user_version;');
        const userVersion = rows?.[0]?.user_version;
        return userVersion === 0 ? LATEST_DB_VERSION : userVersion;
    } catch (error) {
        console.error('getUserVersion:', error);
        return 0;
    }
};