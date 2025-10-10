import { router } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { Appbar, FAB, Menu, ProgressBar, Searchbar, Text, useTheme } from 'react-native-paper';
import { ListCard } from '../../components/card/ListCard';
import { useTranslation } from '../../hooks/useTranslation';
import { Colors } from '../../style/Colors';
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
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [filteredCards, setFilteredCards] = useState<CardType[]>(cards);

  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [filterCards, setFilterCards] = useState<string>(undefined);

  const { colors } = useTheme();
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

  const normalizedSearch = useMemo(() => debouncedSearch.trim().toLowerCase(), [debouncedSearch]);

  useEffect(() => {
    const id = setTimeout(() => setDebouncedSearch(searchText), 200);
    return () => clearTimeout(id);
  }, [searchText]);

  useEffect(() => {
    let filtered = cards;

    if (filterCards === 'notToLearn') {
      filtered = filtered.filter(card => card.toLearn === 0);
    } else if (filterCards === 'notLearnt') {
      filtered = filtered.filter(card => card.nextRevision === null);
    } else if (filterCards === 'ended') {
      filtered = filtered.filter(card => card.step === 8);
    }

    if (normalizedSearch !== '') {
      filtered = filtered.filter(card =>
        card.recto?.toLowerCase()?.includes(normalizedSearch) ||
        card.verso?.toLowerCase()?.includes(normalizedSearch)
      );
    }

    setFilteredCards(filtered);
  }, [cards, filterCards, normalizedSearch]);

  const renderItem = useCallback(({ item }: { item: CardType }) => (
    <ListCard card={item} triggerReload={reload} />
  ), [reload]);

  const keyExtractor = useCallback((item: CardType) => item.id.toString(), []);

  const toggleSearchMode = () => {
    setSearchMode(!searchMode);
    if (searchMode) {
      setSearchText('');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.primary }]}>
      <Appbar.Header style={{ backgroundColor: colors.elevation.level1 }}>
        <Appbar.BackAction onPressIn={closeDeck} />
        <Appbar.Content title={deckName} />
        <Appbar.Action icon="flash" onPress={chooseFlashRevisionSettings} />
        {filterCards ?
          <Appbar.Action icon={'filter-off'} onPressIn={() => { setFilterCards(undefined), setShowFilterMenu(false) }} />
          :
          <Menu
            visible={showFilterMenu}
            onDismiss={() => setShowFilterMenu(false)}
            anchor={<Appbar.Action icon="filter" onPressIn={() => setShowFilterMenu(true)} />}
          >
            <Menu.Item title={t('deck.notToLearn')} onPress={() => setFilterCards('notToLearn')} />
            <Menu.Item title={t('deck.notLearnt')} onPress={() => setFilterCards('notLearnt')} />
            <Menu.Item title={t('deck.ended')} onPress={() => setFilterCards('ended')} />
          </Menu>
        }
        <Appbar.Action icon={searchMode ? 'magnify-close' : 'magnify'} onPressIn={toggleSearchMode} />
        <Appbar.Action icon="cog" onPressIn={() => router.push(`/modalDeck?idDeck=${idDeck}`)} />
      </Appbar.Header>
      <ProgressBar
        progress={progress || 0}
        color={Colors.library.intermediate.main}
        style={styles.progressBar}
      />
      {searchMode && (
        <Searchbar
          placeholder='Search'
          value={searchText}
          onChangeText={setSearchText}
          style={styles.searchBar}
          elevation={5}
        />
      )}
      {showCards ? (
        <FlatList
          data={filteredCards}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          contentContainerStyle={[GlobalStyles.container, styles.cardsDisplay]}
          showsVerticalScrollIndicator={false}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          windowSize={7}
          removeClippedSubviews
        />
      ) : (
        <Text variant="bodyLarge" style={[GlobalStyles.centerText, { color: colors.onPrimary }]}>{t('deck.noCards')}</Text>
      )}
      <FAB
        icon="plus"
        style={[GlobalStyles.fab, { backgroundColor: colors.inversePrimary }]}
        onPress={() => router.push(`/modalCard?idDeck=${idDeck}`)}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchBar: {
    margin: 8,
  },
  cardsDisplay: {
    padding: 8,
    rowGap: 4,
  },
  progressBar: {
    height: 8,
  }
});
