import { SQLiteDatabase } from 'expo-sqlite';

export const updateCardInfo = async (
  database: SQLiteDatabase,
  id: string,
  recto: string,
  verso: string,
  rectoImage: string | null,
  versoImage: string | null,
  changeSide: boolean,
  toLearn: boolean,
): Promise<boolean> => {
  const newChangeSide = changeSide === null ? null : Number(changeSide);

  return database
    .runAsync(
      'UPDATE Card SET recto=?, verso=?, rectoImage=?, versoImage=?, changeSide=?, toLearn=? WHERE id=?',
      [recto.trim(), verso.trim(), rectoImage ?? null, versoImage ?? null, newChangeSide, Number(toLearn), id],
    )
    .then(() => true)
    .catch(() => false);
};
