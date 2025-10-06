import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { Appbar, FAB, ProgressBar, Searchbar, Text } from 'react-native-paper';
import { ListCard } from '../../components/card/ListCard';
import { useTranslation } from '../../hooks/useTranslation';
import { GlobalStyles } from '../../style/GlobalStyles';
import { CardType } from '../../types/CardType';

interface DeckProps {
  idDeck: number;
  deckName: string;
  cards: CardType[];
  nbCards: number;
  progress: number;
  reload: () => void;
  closeDeck: () => void;
  chooseFlashRevisionSettings: () => void;
}

export function Deck({
  idDeck,
  deckName,
  cards,
  nbCards,
  progress,
  reload,
  closeDeck,
  chooseFlashRevisionSettings
}: DeckProps) {
  const [showCards, setShowCards] = useState(true);
  const [searchMode, setSearchMode] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filteredCards, setFilteredCards] = useState<CardType[]>(cards);
  const [filterLearnedCards, setFilterLearnedCards] = useState(false);

  const { t } = useTranslation();

  useEffect(() => {
    if (nbCards > 0) {
      setShowCards(true);
    } else {
      setShowCards(false);
    }
  }, [nbCards]);

  useEffect(() => {
    setFilteredCards(cards);
  }, [cards]);

  useEffect(() => {
    let filtered = cards;

    if (filterLearnedCards) {
      filtered = filtered.filter(card => card.toLearn === 0);
    }

    if (searchText.trim() !== '') {
      filtered = filtered.filter(card =>
        card.recto?.toLowerCase()?.includes(searchText.toLowerCase()) ||
        card.verso?.toLowerCase()?.includes(searchText.toLowerCase())
      );
    }

    setFilteredCards(filtered);
  }, [searchText, cards, filterLearnedCards]);

  const toggleSearchMode = () => {
    setSearchMode(!searchMode);
    if (searchMode) {
      setSearchText('');
    }
  };

  return (
    <>
      <View style={styles.container}>
        <Appbar.Header>
          <Appbar.BackAction onPress={closeDeck} />
          <Appbar.Content title={deckName} />
          <Appbar.Action icon="flash" onPress={chooseFlashRevisionSettings} />
          <Appbar.Action icon={filterLearnedCards ? 'filter-off' : 'filter'} onPress={() => setFilterLearnedCards(!filterLearnedCards)} />
          <Appbar.Action icon={searchMode ? 'magnify-close' : 'magnify'} onPress={toggleSearchMode} />
          <Appbar.Action icon="cog" onPress={() => router.push(`/modalDeck?idDeck=${idDeck}`)} />
        </Appbar.Header>
        <ProgressBar progress={progress || 0} />
        {searchMode && (
          <Searchbar
            placeholder='Search'
            value={searchText}
            onChangeText={setSearchText}
            style={styles.searchBar}
          />
        )}
        {showCards ? (
          <FlatList
            data={filteredCards}
            renderItem={({ item }) => (
              <ListCard card={item} triggerReload={reload} />
            )}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={[GlobalStyles.container, styles.cardsDisplay]}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <Text variant="bodyLarge" style={GlobalStyles.centerText}>{t('deck.noCards')}</Text>
        )}
        <FAB
          icon="plus"
          style={styles.fab}
          onPress={() => router.push(`/modalCard?idDeck=${idDeck}`)}
        />
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchBar: {
    marginTop: 8,
    marginHorizontal: 8,
  },
  cardsDisplay: {
    padding: 8,
    rowGap: 4,
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
  },
});
