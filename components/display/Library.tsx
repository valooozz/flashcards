import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Toolbar } from '../../components/bar/Toolbar';
import { AddButton } from '../../components/button/AddButton';
import { DeckCard } from '../../components/card/DeckCard';
import { Header } from '../../components/text/Header';
import { useTranslation } from '../../hooks/useTranslation';
import { Colors } from '../../style/Colors';
import { Sizes } from '../../style/Sizes';
import { globalStyles } from '../../style/Styles';
import { DeckType } from '../../types/DeckType';
import { SettingsButton } from '../button/SettingsButton';

interface LibraryProps {
  decks: DeckType[];
  openDeck: (id: number, name: string) => void;
}

export function Library({ decks, openDeck }: LibraryProps) {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <Toolbar childrenOnTheRight addMarginRight>
        <SettingsButton color={Colors.library.dark.contrast} route={"modalSettings"} />
      </Toolbar>
      <Header
        level={1}
        text={t('library.title')}
        color={Colors.library.dark.contrast}
        rightMargin
      />
      <Header
        level={2}
        text={t('library.decks')}
        color={Colors.library.dark.contrast}
        rightMargin
      />
      {decks.length > 0 ? (
        <ScrollView
          contentContainerStyle={styles.decksDisplay}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.columnDisplay}>
            {decks.map((deck, index) => {
              return index % 2 === 0 ? (
                <DeckCard deck={deck} openDeck={openDeck} key={deck.id} />
              ) : null;
            })}
          </View>
          <View style={styles.columnDisplay}>
            {decks.map((deck, index) => {
              return index % 2 === 0 ? null : (
                <DeckCard deck={deck} openDeck={openDeck} key={deck.id} />
              );
            })}
          </View>
        </ScrollView>
      ) : (
        <Text style={styles.text}>
          {t('library.noDeck')}
        </Text>
      )}

      <AddButton
        icon="pluscircle"
        size={70}
        color={Colors.library.light.main}
        onPress={() => router.push('/modalDeck')}
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
  decksDisplay: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    columnGap: 16,
    flexGrow: 1,
    marginRight: 24,
    paddingBottom: 104,
  },
  columnDisplay: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    rowGap: 16,
    minWidth: 152,
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
