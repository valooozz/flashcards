import { SQLiteDatabase } from 'expo-sqlite';

export const createTableForgotten = async (database: SQLiteDatabase) => {
  try {
    await database.execAsync(
      'CREATE TABLE IF NOT EXISTS Forgotten (idCard INTEGER, date TEXT, PRIMARY KEY (idCard, date), FOREIGN KEY (idCard) REFERENCES Card(id));',
    );
  } catch (error) {
    console.error(error);
  }
};
