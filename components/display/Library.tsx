import { router } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Appbar, FAB, Menu } from 'react-native-paper';
import { DeckCard } from '../../components/card/DeckCard';
import { useTranslation } from '../../hooks/useTranslation';
import { Colors } from '../../style/Colors';
import { GlobalStyles } from '../../style/GlobalStyles';
import { Sizes } from '../../style/Sizes';
import { DeckType } from '../../types/DeckType';
import { exportAllDecks } from '../../utils/database/deck/exportAllDecks.utils';
import { importDocument } from '../../utils/import/importDocument.utils';

interface LibraryProps {
  decks: DeckType[];
  openDeck: (id: number, name: string) => void;
}

export function Library({ decks, openDeck }: LibraryProps) {
  const { t } = useTranslation();
  const database = useSQLiteContext();

  const [showExportMenu, setShowExportMenu] = useState(false);

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title={t('library.title')} />
        <Menu
          visible={showExportMenu}
          onDismiss={() => setShowExportMenu(false)}
          anchor={<Appbar.Action icon="swap-vertical" onPress={() => setShowExportMenu(true)} />}
        >
          <Menu.Item title={t('library.import')} onPress={() => importDocument(database, 'json')} />
          <Menu.Item title={t('library.export')} onPress={() => exportAllDecks(database)} />
        </Menu>
        <Appbar.Action icon="cog" onPress={() => router.push("modalSettings")} />
      </Appbar.Header>
      {decks.length > 0 ? (
        <ScrollView
          contentContainerStyle={[GlobalStyles.container, styles.decksDisplay]}
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
    padding: 16,
    rowGap: 8,
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
