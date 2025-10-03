import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Appbar, FAB } from 'react-native-paper';
import { DeckCard } from '../../components/card/DeckCard';
import { useTranslation } from '../../hooks/useTranslation';
import { Colors } from '../../style/Colors';
import { Sizes } from '../../style/Sizes';
import { DeckType } from '../../types/DeckType';

interface LibraryProps {
  decks: DeckType[];
  openDeck: (id: number, name: string) => void;
}

export function Library({ decks, openDeck }: LibraryProps) {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title={t('library.title')} />
        <Appbar.Action icon="cog" onPress={() => router.push("modalSettings")} />
      </Appbar.Header>
      {decks.length > 0 ? (
        <ScrollView
          contentContainerStyle={styles.decksDisplay}
          showsVerticalScrollIndicator={false}
        >
          {decks.map((deck) => (
            <DeckCard deck={deck} openDeck={openDeck} key={deck.id} />
          ))}
        </ScrollView>
      ) : (
        <Text style={styles.text}>
          {t('library.noDeck')}
        </Text>
      )}

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => router.push('/modalDeck')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  decksDisplay: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    rowGap: 8,
    padding: 16,
  },
  text: {
    color: Colors.learning.dark.contrast,
    textAlign: 'center',
    fontSize: Sizes.font.small,
    fontFamily: 'JosefinRegular',
    marginTop: 80,
    marginRight: 24,
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
  },
});
