import { router } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { Appbar, FAB, Menu, ProgressBar, Text, useTheme } from 'react-native-paper';
import { DeckCard } from '../../components/card/DeckCard';
import { useTranslation } from '../../hooks/useTranslation';
import { Colors } from '../../style/Colors';
import { GlobalStyles } from '../../style/GlobalStyles';
import { Sizes } from '../../style/Sizes';
import { DeckType } from '../../types/DeckType';
import { exportAllDecks } from '../../utils/database/deck/exportAllDecks.utils';
import { importDocument } from '../../utils/import/importDocument.utils';
import { LoaderModal } from '../modal/LoaderModal';

interface LibraryProps {
  decks: DeckType[];
  progress: number;
  openDeck: (id: number, name: string) => void;
  chooseFlashRevisionSettings: () => void;
  reload: () => void;
}

export function Library({ decks, progress, openDeck, chooseFlashRevisionSettings, reload }: LibraryProps) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const database = useSQLiteContext();

  const [showExportMenu, setShowExportMenu] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const handleImport = useCallback(async () => {
    setShowExportMenu(false);
    setIsImporting(true);
    try {
      await importDocument(database, 'json');
    } finally {
      setIsImporting(false);
      reload();
    }
  }, [database]);

  const handleExport = useCallback(async () => {
    setShowExportMenu(false);
    setIsExporting(true);
    try {
      await exportAllDecks(database);
    } catch (error) {
      console.error(error);
    } finally {
      setIsExporting(false);
    }
  }, [database]);

  const renderItem = useCallback(({ item }: { item: DeckType }) => (
    <DeckCard deck={item} openDeck={openDeck} />
  ), [openDeck]);

  const keyExtractor = useCallback((item: DeckType) => item.id.toString(), []);

  return (
    <View style={[styles.container, { backgroundColor: colors.primary }]}>
      <Appbar.Header style={{ backgroundColor: colors.elevation.level1 }}>
        <Appbar.Content title={t('library.title')} />
        <Appbar.Action icon="flash" onPressIn={chooseFlashRevisionSettings} />
        <Menu
          visible={showExportMenu}
          onDismiss={() => setShowExportMenu(false)}
          anchor={<Appbar.Action icon="swap-vertical" onPressIn={() => setShowExportMenu(true)} />}
        >
          <Menu.Item title={t('library.import')} onPress={handleImport} />
          <Menu.Item title={t('library.export')} onPress={handleExport} />
        </Menu>
        <Appbar.Action icon="cog" onPressIn={() => router.push("modalSettings")} />
      </Appbar.Header>
      <ProgressBar
        progress={progress || 0}
        color={Colors.library.intermediate.main}
        style={styles.progressBar}
      />

      {decks.length > 0 ? (
        <FlatList
          data={decks}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          contentContainerStyle={[GlobalStyles.container, styles.decksDisplay]}
          showsVerticalScrollIndicator={false}
          initialNumToRender={8}
          maxToRenderPerBatch={8}
          windowSize={5}
          removeClippedSubviews
        />
      ) : (
        <Text variant="titleMedium" style={[GlobalStyles.centerText, { color: colors.onPrimary }]}>
          {t('library.noDeck')}
        </Text>
      )}

      <FAB
        icon="plus"
        style={[GlobalStyles.fab, { backgroundColor: colors.inversePrimary }]}
        onPress={() => router.push('/modalDeck')}
      />

      <LoaderModal visible={isImporting || isExporting} text={isImporting ? t('common.importing') : t('common.exporting')} />
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
    textAlign: 'center',
    fontSize: Sizes.font.small,
    fontFamily: 'JosefinRegular',
    marginTop: 80,
    marginRight: 24,
  },
  progressBar: {
    height: 8,
  },
});
