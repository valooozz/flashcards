import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { Appbar, FAB, Menu, ProgressBar, Searchbar, Text, useTheme } from 'react-native-paper';
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

  useEffect(() => {
    let filtered = cards;

    if (filterCards === 'notToLearn') {
      filtered = filtered.filter(card => card.toLearn === 0);
    } else if (filterCards === 'notLearnt') {
      filtered = filtered.filter(card => card.nextRevision === null);
    } else if (filterCards === 'ended') {
      filtered = filtered.filter(card => card.step === 8);
    }

    if (searchText.trim() !== '') {
      filtered = filtered.filter(card =>
        card.recto?.toLowerCase()?.includes(searchText.toLowerCase()) ||
        card.verso?.toLowerCase()?.includes(searchText.toLowerCase())
      );
    }

    setFilteredCards(filtered);
  }, [searchText, cards, filterCards]);

  const toggleSearchMode = () => {
    setSearchMode(!searchMode);
    if (searchMode) {
      setSearchText('');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.primary }]}>
      <Appbar.Header style={{ backgroundColor: colors.elevation.level1 }}>
        <Appbar.BackAction onPress={closeDeck} />
        <Appbar.Content title={deckName} />
        <Appbar.Action icon="flash" onPress={chooseFlashRevisionSettings} />
        {filterCards ?
          <Appbar.Action icon={'filter-off'} onPress={() => { setFilterCards(undefined), setShowFilterMenu(false) }} />
          :
          <Menu
            visible={showFilterMenu}
            onDismiss={() => setShowFilterMenu(false)}
            anchor={<Appbar.Action icon="filter" onPress={() => setShowFilterMenu(true)} />}
          >
            <Menu.Item title={t('deck.notToLearn')} onPress={() => setFilterCards('notToLearn')} />
            <Menu.Item title={t('deck.notLearnt')} onPress={() => setFilterCards('notLearnt')} />
            <Menu.Item title={t('deck.ended')} onPress={() => setFilterCards('ended')} />
          </Menu>
        }
        <Appbar.Action icon={searchMode ? 'magnify-close' : 'magnify'} onPress={toggleSearchMode} />
        <Appbar.Action icon="cog" onPress={() => router.push(`/modalDeck?idDeck=${idDeck}`)} />
      </Appbar.Header>
      <ProgressBar progress={progress || 0} style={{ backgroundColor: colors.primary }} color={colors.primaryContainer} />
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
    marginTop: 8,
    marginHorizontal: 8,
  },
  cardsDisplay: {
    padding: 8,
    rowGap: 4,
  },
});
