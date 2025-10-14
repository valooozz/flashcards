import { useCallback, useEffect, useMemo, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { Button, Dialog, Searchbar, Text, useTheme } from "react-native-paper";
import { useTranslation } from "../../hooks/useTranslation";
import { CardType } from "../../types/CardType";
import { isCardCloseToSearch } from "../../utils/isCardCloseToSearch.utils";
import { SearchCard } from "../card/SearchCard";

interface SearchDialogProps {
    visible: boolean;
    hideDialog: () => void;
    allCards: CardType[];
}

export const SearchDialog = ({ visible, hideDialog, allCards }: SearchDialogProps) => {
    const [searchText, setSearchText] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [filteredCards, setFilteredCards] = useState<CardType[]>([]);

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
        if (normalizedSearch !== '') {
            filtered = allCards.filter(card => isCardCloseToSearch(card, normalizedSearch));
        }
        setFilteredCards(filtered);
    }, [normalizedSearch, allCards]);

    const renderItem = useCallback(({ item }: { item: CardType }) => (
        <SearchCard card={item} />
    ), []);

    return (
        <Dialog visible={visible} onDismiss={hideDialog} style={styles.dialog}>
            <Dialog.Title>{t('dialog.searchTitle')}</Dialog.Title>
            <Dialog.Content>
                <Searchbar
                    placeholder={t('dialog.searchCard')}
                    value={searchText}
                    onChangeText={setSearchText}
                    elevation={0}
                    style={[styles.searchbar, { backgroundColor: colors.onPrimary }]}
                />

                {filteredCards.length > 0 ? (
                    <FlatList
                        data={filteredCards}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={renderItem}
                        style={styles.list}
                        contentContainerStyle={[styles.listContainer, { backgroundColor: colors.elevation.level0 }]}
                    />
                ) : (
                    <View style={styles.emptyContainer}>
                        <Text variant="bodyMedium">{normalizedSearch !== '' ? t('dialog.noCard') : null}</Text>
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
    dialog: {
        // height: 520,
    },
    searchbar: {
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
