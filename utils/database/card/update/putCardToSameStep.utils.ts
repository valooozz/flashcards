import { SQLiteDatabase } from 'expo-sqlite';
import { getNextRevision } from '../../../getNextRevision.utils';
import { getNextSide } from '../../../getNextSide.utils';

export const putCardToSameStep = async (
    database: SQLiteDatabase,
    intervals: number[],
    id: number,
    step: number,
    rectoFirst: number,
    changeSide: number,
) => {
    try {
        const nextRevision = getNextRevision(intervals, step);
        const nextSide = getNextSide(rectoFirst, changeSide);

        database.runAsync(
            'UPDATE Card SET nextRevision=?, rectoFirst=? WHERE id=?',
            [nextRevision, nextSide, id],
        );
    } catch (error) {
        console.error(error);
    }
};
