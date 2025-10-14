import { useCallback, useEffect, useMemo, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { Button, Dialog, Searchbar, SegmentedButtons, Text, useTheme } from "react-native-paper";
import { useTranslation } from "../../hooks/useTranslation";
import { CardType } from "../../types/CardType";
import { DeckType } from "../../types/DeckType";
import { isCardCloseToSearch } from "../../utils/isCardCloseToSearch.utils";
import { isDeckCloseToSearch } from "../../utils/isDeckCloseToSearch.utils";
import { DeckCard } from "../card/DeckCard";
import { SearchCard } from "../card/SearchCard";

interface SearchDialogProps {
    visible: boolean;
    hideDialog: () => void;
    allCards: CardType[];
    allDecks: DeckType[];
    openDeck: (id: number, name: string) => void;
}

export const SearchDialog = ({ visible, hideDialog, allCards, allDecks, openDeck }: SearchDialogProps) => {
    const [selectedSearch, setSelectedSearch] = useState('card');
    const [searchText, setSearchText] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');

    const [filteredCards, setFilteredCards] = useState<CardType[]>([]);
    const [filteredDecks, setFilteredDecks] = useState<DeckType[]>([]);

    const { t } = useTranslation();
    const { colors } = useTheme();

    useEffect(() => {
        setSearchText('');
    }, [visible]);

    useEffect(() => {
        const id = setTimeout(() => setDebouncedSearch(searchText), 300);
        return () => clearTimeout(id);
    }, [searchText]);

    const normalizedSearch = useMemo(() => debouncedSearch.trim().toLowerCase(), [debouncedSearch]);

    useEffect(() => {
        let filtered = [];

        if (selectedSearch === 'card') {
            if (normalizedSearch !== '') {
                filtered = allCards.filter(card => isCardCloseToSearch(card, normalizedSearch));
            }
            setFilteredCards(filtered);
        } else if (selectedSearch === 'deck') {
            if (normalizedSearch !== '') {
                filtered = allDecks.filter(deck => isDeckCloseToSearch(deck, normalizedSearch));
            }
            setFilteredDecks(filtered);
        }
    }, [normalizedSearch, allCards, allDecks, selectedSearch]);

    const updateSelectedSearch = (newSelectedSearch: string) => {
        setSelectedSearch(newSelectedSearch);
        if (newSelectedSearch === 'card') {
            setFilteredDecks([]);
        } else if (newSelectedSearch === 'deck') {
            setFilteredCards([]);
        }
    }

    const renderList = useCallback(() => {
        if (selectedSearch === 'card') {
            return (
                <FlatList
                    data={filteredCards}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderItemCard}
                    style={styles.list}
                    contentContainerStyle={[styles.listContainer, { backgroundColor: colors.elevation.level0 }]}
                />
            )
        } else if (selectedSearch === 'deck') {
            return (
                <FlatList
                    data={filteredDecks}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderItemDeck}
                    style={styles.list}
                    contentContainerStyle={[styles.listContainer, { backgroundColor: colors.elevation.level0 }]}
                />
            )
        }
    }, [selectedSearch, filteredCards, filteredDecks]);

    const renderItemCard = useCallback(({ item }: { item: CardType }) => (
        <SearchCard card={item} openDeck={openDeck} />
    ), [openDeck]);

    const renderItemDeck = useCallback(({ item }: { item: DeckType }) => (
        <DeckCard deck={item} openDeck={openDeck} searchCard />
    ), [openDeck]);

    return (
        <Dialog visible={visible} onDismiss={hideDialog}>
            <Dialog.Title>{t('dialog.searchTitle')}</Dialog.Title>
            <Dialog.Content>
                <SegmentedButtons
                    value={selectedSearch}
                    onValueChange={(newSelectedSearch: string) => updateSelectedSearch(newSelectedSearch)}
                    theme={{ colors: { secondaryContainer: colors.primary, onSecondaryContainer: colors.onPrimary, outline: colors.primary } }}
                    buttons={[
                        {
                            value: 'card',
                            label: t('card.title'),
                            checkedColor: colors.onPrimary,
                        },
                        {
                            value: 'deck',
                            label: t('deck.title'),
                            checkedColor: colors.onPrimary,
                        },
                    ]}
                />

                <Searchbar
                    placeholder={selectedSearch === 'card' ? t('dialog.searchCard') : t('dialog.searchDeck')}
                    value={searchText}
                    onChangeText={setSearchText}
                    elevation={0}
                    style={[styles.searchbar, { backgroundColor: colors.onPrimary }]}
                />

                {filteredDecks.length > 0 || filteredCards.length > 0 ?
                    renderList()
                    : (
                        <View style={styles.emptyContainer}>
                            <Text variant="bodyMedium">{normalizedSearch !== '' ? selectedSearch === 'card' ? t('dialog.noCard') : t('dialog.noDeck') : null}</Text>
                        </View>
                    )}
            </Dialog.Content>

            <Dialog.Actions>
                <Button onPress={hideDialog}>{t('common.close')}</Button>
            </Dialog.Actions>
        </Dialog>
    );
};

const styles = StyleSheet.create({
    searchbar: {
        marginTop: 8,
        marginBottom: 16,
    },
    list: {
        maxHeight: 300,
        borderRadius: 12,
    },
    listContainer: {
        rowGap: 8,
    },
    card: {
        marginBottom: 5,
    },
    cardTitle: {
        fontSize: 16,
    },
    emptyContainer: {
        alignItems: 'center',
        marginTop: 20,
    },
});
