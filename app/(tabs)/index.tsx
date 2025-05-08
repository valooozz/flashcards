import { useFocusEffect } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useState } from 'react';
import { Deck } from '../../components/display/Deck';
import { Library } from '../../components/display/Library';
import { DeckType } from '../../types/DeckType';
import { getAllDecks } from '../../utils/database/deck/get/getAllDecks.utils';

export default function Tab() {
  const [inLibrary, setInLibrary] = useState(true);
  const [decks, setDecks] = useState<DeckType[]>([]);
  const [idDeck, setIdDeck] = useState(-1);
  const [deckName, setDeckName] = useState('');

  const database = useSQLiteContext();

  const openDeck = (id: number, name: string) => {
    setIdDeck(id);
    setDeckName(name);
    setInLibrary(false);
  };

  const closeDeck = () => {
    setIdDeck(-1);
    setDeckName('');
    setInLibrary(true);
  };

  useFocusEffect(
    useCallback(() => {
      getAllDecks(database).then((decksResult) => {
        setDecks(decksResult);
      });
    }, []),
  );

  return inLibrary ? (
    <Library decks={decks} openDeck={openDeck} />
  ) : (
    <Deck idDeck={idDeck} deckName={deckName} closeDeck={closeDeck} />
  );
}
