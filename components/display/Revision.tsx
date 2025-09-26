import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Toolbar } from '../../components/bar/Toolbar';
import { useTranslation } from '../../hooks/useTranslation';
import { Colors } from '../../style/Colors';
import { Sizes } from '../../style/Sizes';
import { globalStyles } from '../../style/Styles';
import { BackButton } from '../button/BackButton';
import { FlashCardType } from '../../types/FlashCardType';
import { FlashCard } from '../card/FlashCard';
import { RevisionAction } from '../../types/Actions';
import { FlashButton } from '../button/FlashButton';

interface DeckProps {
  flashCards: FlashCardType[];
  closeRevision: () => void;
}

export function Revision({
  flashCards,
  closeRevision,
}: DeckProps) {
  const [cardsToRevise, setCardsToRevise] = useState<FlashCardType[]>([]);
  const [cardToShow, setCardToShow] = useState<FlashCardType>(undefined);
  const [previousCard, setPreviousCard] = useState<FlashCardType>(undefined);
  const [sizeOfDeck, setSizeOfDeck] = useState(0);

  const { t } = useTranslation();

  useEffect(() => {
    setCardsToRevise(flashCards);
    setCardToShow(flashCards[0]);
    setSizeOfDeck(flashCards.length);
  }, [flashCards]);

  const updateCardToShow = (newCard: FlashCardType) => {
    if (newCard === undefined) {
      setCardToShow(undefined);
      return;
    }
    setCardToShow(newCard);
  }

  const handleNext = (revisionAction: RevisionAction) => {
    setPreviousCard(cardToShow);
    if (revisionAction === 'again') {
      setCardsToRevise([...cardsToRevise.slice(1), cardToShow]);
    } else if (revisionAction === 'done') {
      setCardsToRevise(cardsToRevise.slice(1));
    }
    updateCardToShow(cardsToRevise[1]);
  }

  const handlePrevious = () => {
    setCardsToRevise([previousCard, ...cardsToRevise]);
    updateCardToShow(previousCard);
    setPreviousCard(undefined);
  }

  return (
    <View style={styles.container}>
      <Toolbar addMarginRight>
        <BackButton color={Colors.library.dark.contrast} simpleAction={closeRevision} />
      </Toolbar>

      <Text style={styles.text}>
        {`${sizeOfDeck - cardsToRevise.length} / ${sizeOfDeck}`}
      </Text>

      {cardToShow ? (
        <>
          <FlashCard
            recto={cardToShow.recto}
            verso={cardToShow.verso}
            deckName={cardToShow.name}
            backgroundColor={Colors.revision.simple.main}
            textColor={Colors.revision.simple.contrast}
            textDeckColor={Colors.revision.dark.main}
            previousPossible={previousCard !== undefined}
            handlePrevious={handlePrevious}
          />
          <View style={styles.buttons}>
            <FlashButton
              text={t('revision.forgotten')}
              backgroundColor={Colors.revision.light.main}
              textColor={Colors.revision.light.contrast}
              handleClick={() => handleNext('again')}
            />
            <FlashButton
              text={t('revision.known')}
              backgroundColor={Colors.revision.intermediate.main}
              textColor={Colors.revision.intermediate.contrast}
              handleClick={() => handleNext('done')}
            />
          </View>
        </>
      ) : (
        <Text
          style={{
            ...styles.text,
            
          }}
        >
          {t('revision.over')}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...globalStyles.page,
    backgroundColor: Colors.library.dark.main,
    paddingRight: 0,
    paddingBottom: 0,
  },
  buttons: {
    display: 'flex',
    flexDirection: 'row',
    height: Sizes.component.large,
  },
  text: {
    color: Colors.revision.dark.contrast,
    textAlign: 'center',
    fontSize: Sizes.font.small,
    fontFamily: 'JosefinRegular',
    marginTop: 80,
    marginRight: 24,
    marginVertical: '10%',
    marginHorizontal: '20%',
  },
});
