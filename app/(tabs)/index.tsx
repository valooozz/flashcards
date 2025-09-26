import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useEffect, useState } from 'react';
import { BackHandler } from 'react-native';
import { Deck } from '../../components/display/Deck';
import { Library } from '../../components/display/Library';
import { CardType } from '../../types/CardType';
import { DeckType } from '../../types/DeckType';
import { getCardsFromDeck } from '../../utils/database/card/get/getCardsFromDeck.utils';
import { getProgressInDeck } from '../../utils/database/card/get/getProgressInDeck.utils';
import { getAllDecks } from '../../utils/database/deck/get/getAllDecks.utils';
import { getFlashCardsFromDeck } from '../../utils/database/card/get/getFlashCardsFromDeck.utils';
import { FlashCardType } from '../../types/FlashCardType';
import { Revision } from '../../components/display/Revision';

export default function Tab() {
  const [inDeck, setInDeck] = useState(false);
  const [inRevision, setInRevision] = useState(false);
  const [decks, setDecks] = useState<DeckType[]>([]);

  const [idDeck, setIdDeck] = useState(-1);
  const [deckName, setDeckName] = useState('');

  const [cards, setCards] = useState<CardType[]>([]);
  const [nbCards, setNbCards] = useState(0);
  const [progressInDeck, setProgressInDeck] = useState(0);

  const [flashCards, setFlashCards] = useState<FlashCardType[]>([]);

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

  const loadFlashCards = async (id: number) => {
    await getFlashCardsFromDeck(database, id).then((falshCardsResult) => {
      setFlashCards(falshCardsResult);
    });
  }

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

  const openRevision = (id: number) => {
    loadFlashCards(id).then(() => {
      setInRevision(true);
    });
  }

  const closeRevision = () => {
    setInRevision(false);
  }

  useFocusEffect(
    useCallback(() => {
      loadState();
      getAllDecks(database).then((decksResult) => {
        setDecks(decksResult);
      });
    }, []),
  );

  useFocusEffect(
    useCallback(() => {
      const backAction = () => {
        if (inRevision) {
          closeRevision();
          return true; // Empêche le comportement par défaut de retour
        }
        if (inDeck) {
          closeDeck();
          return true; // Empêche le comportement par défaut de retour
        }
        return false; // Permet le comportement par défaut de retour
      };

      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        backAction,
      );

      return () => backHandler.remove(); // Nettoyage de l'écouteur d'événements
    }, [inDeck]),
  );

  return inDeck ? inRevision ? (
    <Revision flashCards={flashCards} closeRevision={closeRevision} />
  ) : (
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
