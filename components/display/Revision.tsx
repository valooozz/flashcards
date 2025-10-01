import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Toolbar } from '../../components/bar/Toolbar';
import { useTranslation } from '../../hooks/useTranslation';
import { Colors } from '../../style/Colors';
import { Sizes } from '../../style/Sizes';
import { globalStyles } from '../../style/Styles';
import { RevisionAction } from '../../types/Actions';
import { FlashCardType } from '../../types/FlashCardType';
import { RevisionSide } from '../../types/RevisionSide';
import { shuffle } from '../../utils/shuffle.utils';
import { BackButton } from '../button/BackButton';
import { FlashButton } from '../button/FlashButton';
import { FlashCard } from '../card/FlashCard';

interface DeckProps {
  flashCards: FlashCardType[];
  revisionSide: RevisionSide;
  closeRevision: () => void;
}

export function Revision({
  flashCards,
  revisionSide,
  closeRevision,
}: DeckProps) {
  const [cardsToRevise, setCardsToRevise] = useState<FlashCardType[]>([]);
  const [cardToShow, setCardToShow] = useState<FlashCardType>(undefined);
  const [rectoToShow, setRectoToShow] = useState<string>(undefined);
  const [versoToShow, setVersoToShow] = useState<string>(undefined);
  const [rectoImageToShow, setRectoImageToShow] = useState<string>(undefined);
  const [versoImageToShow, setVersoImageToShow] = useState<string>(undefined);
  const [previousCard, setPreviousCard] = useState<FlashCardType>(undefined);
  const [sizeOfDeck, setSizeOfDeck] = useState(0);

  const { t } = useTranslation();

  useEffect(() => {
    shuffle(flashCards);
    setCardsToRevise(flashCards);
    updateRectoVerso(flashCards[0]);
    setCardToShow(flashCards[0]);
    setSizeOfDeck(flashCards.length);
  }, [flashCards]);

  const updateRectoVerso = (newCard: FlashCardType) => {
    let showRectoFirst: boolean;

    if (revisionSide === 'recto') {
      showRectoFirst = true;
    } else if (revisionSide === 'verso') {
      showRectoFirst = false;
    } else if (revisionSide === 'current') {
      showRectoFirst = Boolean(newCard.rectoFirst);
    } else if (revisionSide === 'random') {
      showRectoFirst = Math.random() < 0.5;
    }

    if (showRectoFirst) {
      setRectoToShow(newCard.recto);
      setRectoImageToShow(newCard.rectoImage);
      setVersoToShow(newCard.verso);
      setVersoImageToShow(newCard.versoImage);
    } else {
      setRectoToShow(newCard.verso);
      setRectoImageToShow(newCard.versoImage);
      setVersoToShow(newCard.recto);
      setVersoImageToShow(newCard.rectoImage);
    }
  }

  const updateCardToShow = (newCard: FlashCardType) => {
    if (newCard === undefined) {
      setCardToShow(undefined);
      return;
    }
    updateRectoVerso(newCard);
    setCardToShow(newCard);
  }

  const handleNext = (revisionAction: RevisionAction) => {
    setPreviousCard(cardToShow);
    let newCardsToRevise: FlashCardType[];
    if (revisionAction === 'again') {
      newCardsToRevise = [...cardsToRevise.slice(1), cardToShow];
    } else if (revisionAction === 'done') {
      newCardsToRevise = cardsToRevise.slice(1);
    }
    setCardsToRevise(newCardsToRevise);
    updateCardToShow(newCardsToRevise[0]);
  }

  const handlePrevious = () => {
    setCardsToRevise([previousCard, ...cardsToRevise.slice(0, -1)]);
    updateCardToShow(previousCard);
    setPreviousCard(undefined);
  }

  return (
    <View style={styles.container}>
      <Toolbar addMarginRight>
        <BackButton color={Colors.library.dark.contrast} simpleAction={closeRevision} />
      </Toolbar>

      <View style={styles.interface}>
        <Text style={[styles.text, styles.progressText]}>
          {`${sizeOfDeck - cardsToRevise.length} / ${sizeOfDeck}`}
        </Text>

        {cardToShow ? (
          <View style={styles.cardContainer}>
            <FlashCard
              recto={rectoToShow}
              verso={versoToShow}
              rectoImage={rectoImageToShow}
              versoImage={versoImageToShow}
              deckName={cardToShow.name}
              backgroundColor={Colors.revision.simple.main}
              textColor={Colors.revision.simple.contrast}
              textDeckColor={Colors.revision.dark.main}
              previousPossible={previousCard !== undefined}
              handlePrevious={handlePrevious}
            />
            <View style={styles.buttons}>
              <FlashButton
                text={t('revision.again')}
                backgroundColor={Colors.revision.light.main}
                textColor={Colors.revision.light.contrast}
                handleClick={() => handleNext('again')}
              />
              <FlashButton
                text={t('revision.done')}
                backgroundColor={Colors.revision.intermediate.main}
                textColor={Colors.revision.intermediate.contrast}
                handleClick={() => handleNext('done')}
              />
            </View>
          </View>
        ) : (
          <Text
            style={[styles.text, styles.overText]}
          >
            {t('revision.over')}
          </Text>
        )}
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...globalStyles.page,
    backgroundColor: Colors.revision.dark.main,
  },
  interface: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    rowGap: 16,
  },
  cardContainer: {
    flex: 1,
  },
  buttons: {
    display: 'flex',
    flexDirection: 'row',
    height: Sizes.component.large,
  },
  text: {
    color: Colors.revision.dark.contrast,
    textAlign: 'center',
    fontFamily: 'JosefinRegular',
    marginHorizontal: 'auto',
  },
  progressText: {
    fontSize: Sizes.font.medium,
  },
  overText: {
    fontSize: Sizes.font.small,
    marginVertical: 'auto',
  }
});
