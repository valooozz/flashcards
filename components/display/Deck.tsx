import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { Toolbar } from '../../components/bar/Toolbar';
import { AddButton } from '../../components/button/AddButton';
import { ListCard } from '../../components/card/ListCard';
import { Header } from '../../components/text/Header';
import { useTranslation } from '../../hooks/useTranslation';
import { Colors } from '../../style/Colors';
import { Sizes } from '../../style/Sizes';
import { globalStyles } from '../../style/Styles';
import { CardType } from '../../types/CardType';
import { DeckProgressBar } from '../bar/DeckProgressBar';
import { BackButton } from '../button/BackButton';
import { SettingsButton } from '../button/SettingsButton';

interface DeckProps {
  idDeck: number;
  deckName: string;
  cards: CardType[];
  nbCards: number;
  progress: number;
  reload: () => void;
  closeDeck: () => void;
}

export function Deck({
  idDeck,
  deckName,
  cards,
  nbCards,
  progress,
  reload,
  closeDeck,
}: DeckProps) {
  const [showCards, setShowCards] = useState(true);

  const { t } = useTranslation();

  useEffect(() => {
    if (nbCards > 0) {
      setShowCards(true);
    } else {
      setShowCards(false);
    }
  }, [nbCards]);

  return (
    <View style={styles.container}>
      <Toolbar addMarginRight>
        <BackButton color={Colors.library.dark.contrast} simpleAction={closeDeck} />
        <SettingsButton color={Colors.library.dark.contrast} route={`/modalDeck?idDeck=${idDeck}`} />
      </Toolbar>
      <Header
        level={1}
        text={deckName}
        color={Colors.library.dark.contrast}
        rightMargin
      />
      <DeckProgressBar
        progress={progress}
        color={Colors.library.intermediate.main}
      />
      <Header
        level={2}
        text={`${t('deck.cards')} ${nbCards > 0 ? `(${nbCards})` : ''}`}
        color={Colors.library.dark.contrast}
        rightMargin
      />
      {showCards ? (
        <FlatList
          data={cards}
          renderItem={({ item }) => (
            <ListCard card={item} triggerReload={reload} />
          )}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.cardsDisplay}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <Text style={styles.text}>{t('deck.noCards')}</Text>
      )}
      <AddButton
        icon="pluscircle"
        size={70}
        color={Colors.library.light.main}
        onPress={() => router.push(`/modalCard?idDeck=${idDeck}`)}
      />
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
  cardsDisplay: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    rowGap: 8,
    flexGrow: 1,
    marginRight: 24,
    paddingBottom: 104,
  },
  text: {
    color: Colors.learning.dark.contrast,
    textAlign: 'center',
    fontSize: Sizes.font.small,
    fontFamily: 'JosefinRegular',
    marginTop: 80,
    marginRight: 24,
  },
});
