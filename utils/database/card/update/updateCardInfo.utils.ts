import { SQLiteDatabase } from 'expo-sqlite';

export const updateCardInfo = async (
  database: SQLiteDatabase,
  id: string,
  recto: string,
  verso: string,
  changeSide: boolean,
  toLearn: boolean,
): Promise<boolean> => {
  const newChangeSide = changeSide === null ? null : Number(changeSide);

  return database
    .runAsync(
      'UPDATE Card SET recto=?, verso=?, changeSide=?, toLearn=? WHERE id=?',
      [recto.trim(), verso.trim(), newChangeSide, Number(toLearn), id],
    )
    .then(() => true)
    .catch(() => false);
};
