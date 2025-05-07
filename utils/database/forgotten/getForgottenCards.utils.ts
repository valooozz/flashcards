import { SQLiteDatabase } from 'expo-sqlite';
import { CardType } from '../../../types/CardType';
import { getDate } from '../../getDate.utils';

export const getForgottenCards = async (database: SQLiteDatabase) => {
  let cards: CardType[] = [];
  const today = getDate(0);

  try {
    cards = await database.getAllAsync<CardType>(
      'SELECT id, recto, verso, deck, rectoFirst, step, nextRevision, toLearn, changeSide FROM Forgotten F INNER JOIN Card C ON F.idCard=C.id WHERE date=?;',
      today,
    );
  } catch (error) {
    console.error(error);
  }

  return cards;
};
