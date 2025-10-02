import { SQLiteDatabase } from "expo-sqlite";

export const doesColumnExist = async (database: SQLiteDatabase, table: string, column: string): Promise<boolean> => {
    try {
        const rows = await database.getAllAsync<{ name: string }>(`PRAGMA table_info(${table});`);
        return rows.some((row) => row.name === column);
    } catch (error) {
        console.error('doesColumnExist:', error);
        return false;
    }
};