import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useEffect, useState } from 'react';
import { Deck } from '../../components/display/Deck';
import { Library } from '../../components/display/Library';
import { CardType } from '../../types/CardType';
import { DeckType } from '../../types/DeckType';
import { getCardsFromDeck } from '../../utils/database/card/get/getCardsFromDeck.utils';
import { getProgressInDeck } from '../../utils/database/card/get/getProgressInDeck.utils';
import { getAllDecks } from '../../utils/database/deck/get/getAllDecks.utils';

export default function Tab() {
  const [inDeck, setInDeck] = useState(false);
  const [decks, setDecks] = useState<DeckType[]>([]);

  const [idDeck, setIdDeck] = useState(-1);
  const [deckName, setDeckName] = useState('');

  const [cards, setCards] = useState<CardType[]>([]);
  const [nbCards, setNbCards] = useState(0);
  const [progressInDeck, setProgressInDeck] = useState(0);

  const database = useSQLiteContext();

  const saveState = async () => {
    await AsyncStorage.setItem(
      'tabState',
      JSON.stringify({
        inDeck,
        idDeck,
        deckName,
      }),
    );
  };

  const loadState = async () => {
    const savedState = await AsyncStorage.getItem('tabState');
    if (savedState) {
      const {
        inDeck: savedInDeck,
        idDeck: savedIdDeck,
        deckName: savedDeckName,
      } = JSON.parse(savedState);
      setInDeck(savedInDeck);
      setIdDeck(savedIdDeck);
      setDeckName(savedDeckName);
      if (savedInDeck && savedIdDeck) {
        loadCards(savedIdDeck);
      }
    }
  };

  const loadCards = async (id: number) => {
    // setAllRevisionsToToday(database);
    await getCardsFromDeck(database, id).then((cardsResult) => {
      setCards(cardsResult);
      setNbCards(cardsResult.length);
    });
    await getProgressInDeck(database, id).then((nb) => {
      setProgressInDeck(Number(nb.toFixed(2)));
    });
  };

  useEffect(() => {
    saveState();
  }, [idDeck, deckName, inDeck]);

  const openDeck = (id: number, name: string) => {
    setIdDeck(id);
    setDeckName(name);
    loadCards(id).then(() => {
      setInDeck(true);
    });
  };

  const closeDeck = () => {
    setIdDeck(-1);
    setDeckName('');
    setInDeck(false);
  };

  useFocusEffect(
    useCallback(() => {
      loadState();
      getAllDecks(database).then((decksResult) => {
        setDecks(decksResult);
      });
    }, []),
  );

  return inDeck ? (
    <Deck
      idDeck={idDeck}
      deckName={deckName}
      cards={cards}
      nbCards={nbCards}
      progress={progressInDeck}
      reload={() => loadCards(idDeck)}
      closeDeck={closeDeck}
    />
  ) : (
    <Library decks={decks} openDeck={openDeck} />
  );
}
