import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useEffect, useState } from 'react';
import { BackHandler } from 'react-native';
import { Deck } from '../../components/display/Deck';
import { Library } from '../../components/display/Library';
import { Revision } from '../../components/display/Revision';
import { FlashRevisionSettingsModal } from '../../components/modal/FlashRevisionSettingsModal';
import { CardType } from '../../types/CardType';
import { DeckType } from '../../types/DeckType';
import { FlashCardType } from '../../types/FlashCardType';
import { CardsToRevise, FlashRevisionSettingsType, RevisionSide, StepDelimiter } from '../../types/FlashRevisionSettings';
import { getCardsFromDeck } from '../../utils/database/card/get/getCardsFromDeck.utils';
import { getFlashCardsFromDeck } from '../../utils/database/card/get/getFlashCardsFromDeck.utils';
import { getProgressInDeck } from '../../utils/database/card/get/getProgressInDeck.utils';
import { getAllDecks } from '../../utils/database/deck/get/getAllDecks.utils';

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
  const [numberOfCards, setNumberOfCards] = useState<number>(undefined);
  const [revisionSide, setRevisionSide] = useState<RevisionSide>(undefined);
  const [showRevisionChoice, setShowRevisionChoice] = useState(false);

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

  const loadFlashCards = async (id: number, cardsToRevise: CardsToRevise, stepDelimiter: StepDelimiter) => {
    await getFlashCardsFromDeck(
      database,
      id,
      cardsToRevise === 'notLearnt',
      stepDelimiter
    ).then((flashCardsResult) => {
      setFlashCards(flashCardsResult);
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

  const chooseRevisionSide = () => {
    setShowRevisionChoice(true);
  }

  const openRevision = (flashRevisionSettings: FlashRevisionSettingsType) => {
    setShowRevisionChoice(false);
    setNumberOfCards(flashRevisionSettings.numberOfCards);
    setRevisionSide(flashRevisionSettings.revisionSide);
    loadFlashCards(idDeck, flashRevisionSettings.cardsToRevise, flashRevisionSettings.stepDelimiter).then(() => {
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
    <Revision
      deckName={deckName}
      flashCards={flashCards}
      numberOfCards={numberOfCards}
      revisionSide={revisionSide}
      closeRevision={closeRevision}
    />
  ) : (
    <>
      <Deck
        idDeck={idDeck}
        deckName={deckName}
        cards={cards}
        nbCards={nbCards}
        progress={progressInDeck}
        reload={() => loadCards(idDeck)}
        closeDeck={closeDeck}
        chooseRevisionSide={chooseRevisionSide}
      />
      <FlashRevisionSettingsModal visible={showRevisionChoice} openRevision={openRevision} closeModal={() => setShowRevisionChoice(false)} />
    </>
  ) : (
    <Library decks={decks} openDeck={openDeck} />
  );
}
