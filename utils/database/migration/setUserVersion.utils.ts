import { SQLiteDatabase } from "expo-sqlite";

export const setUserVersion = async (database: SQLiteDatabase, version: number) => {
    try {
        await database.execAsync(`PRAGMA user_version = ${version};`);
    } catch (error) {
        console.error('setUserVersion:', error);
    }
};