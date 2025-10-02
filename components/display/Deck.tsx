import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Toolbar } from '../../components/bar/Toolbar';
import { AddButton } from '../../components/button/AddButton';
import { ListCard } from '../../components/card/ListCard';
import { Header } from '../../components/text/Header';
import { Input } from '../../components/text/Input';
import { useTranslation } from '../../hooks/useTranslation';
import { Colors } from '../../style/Colors';
import { Radius } from '../../style/Radius';
import { Sizes } from '../../style/Sizes';
import { globalStyles } from '../../style/Styles';
import { CardType } from '../../types/CardType';
import { DeckProgressBar } from '../bar/DeckProgressBar';
import { BackButton } from '../button/BackButton';
import { FlashDeckButton } from '../button/FlashDeckButton';
import { SettingsButton } from '../button/SettingsButton';

interface DeckProps {
  idDeck: number;
  deckName: string;
  cards: CardType[];
  nbCards: number;
  progress: number;
  reload: () => void;
  closeDeck: () => void;
  chooseRevisionSide: (id: number) => void;
}

export function Deck({
  idDeck,
  deckName,
  cards,
  nbCards,
  progress,
  reload,
  closeDeck,
  chooseRevisionSide
}: DeckProps) {
  const [showCards, setShowCards] = useState(true);
  const [searchMode, setSearchMode] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filteredCards, setFilteredCards] = useState<CardType[]>(cards);

  const { t } = useTranslation();

  useEffect(() => {
    if (nbCards > 0) {
      setShowCards(true);
    } else {
      setShowCards(false);
    }
  }, [nbCards]);

  // Update filtered cards when cards prop changes
  useEffect(() => {
    setFilteredCards(cards);
  }, [cards]);

  // Filter cards based on search text
  useEffect(() => {
    if (searchText.trim() === '') {
      setFilteredCards(cards);
    } else {
      const filtered = cards.filter(card =>
        card.recto?.toLowerCase()?.includes(searchText.toLowerCase()) ||
        card.verso?.toLowerCase()?.includes(searchText.toLowerCase())
      );
      setFilteredCards(filtered);
    }
  }, [searchText, cards]);

  const toggleSearchMode = () => {
    setSearchMode(!searchMode);
    if (searchMode) {
      // Closing search mode - clear search text
      setSearchText('');
    }
  };

  return (
    <View style={styles.container}>
      <Toolbar addMarginRight>
        <BackButton color={Colors.library.dark.contrast} simpleAction={closeDeck} />
        <FlashDeckButton color={Colors.library.dark.contrast} onPress={() => chooseRevisionSide(idDeck)} />
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
      <View style={styles.headerWithSearch}>
        <Header
          level={2}
          text={`${t('deck.cards')} ${nbCards > 0 ? `(${nbCards})` : ''}`}
          color={Colors.library.dark.contrast}
          rightMargin={false}
        />
        <TouchableOpacity
          onPress={toggleSearchMode}
          style={styles.searchButton}
          testID="search-toggle-button"
        >
          <MaterialIcons
            name={searchMode ? "close" : "search"}
            size={32}
            color={Colors.library.dark.contrast}
          />
        </TouchableOpacity>
      </View>
      {searchMode && (
        <View style={styles.inputContainer}>
          <Input
            text={searchText}
            setText={setSearchText}
            autofocus={true}
            backgroundColor={Colors.library.light.main}
            color={Colors.library.light.contrast}
          />
        </View>
      )}
      {showCards ? (
        <FlatList
          data={filteredCards}
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
  headerWithSearch: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginRight: 24,
  },
  searchButton: {
    padding: 8,
    marginLeft: 16,
  },
  inputContainer: {
    marginRight: 24,
    marginBottom: 16,
    borderRadius: Radius.small,
    overflow: 'hidden',
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
