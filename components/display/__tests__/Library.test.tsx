import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Library } from '../Library';

jest.mock('expo-router', () => ({
    router: { push: jest.fn() },
}));

jest.mock('../../bar/Toolbar', () => {
    const { Pressable } = require('react-native');
    return {
        Toolbar: () => <Pressable testID="toolbar" />,
    };
});

jest.mock('../../button/AddButton', () => {
    const { Pressable } = require('react-native');
    return {
        AddButton: ({ onPress }: any) => (
            <Pressable testID="add-button" onPress={onPress} />
        ),
    };
});

jest.mock('../../card/DeckCard', () => {
    const { Pressable, Text } = require('react-native');
    return {
        DeckCard: ({ deck, openDeck }: any) => (
            <Pressable testID={`deck-card-${deck.id}`} onPress={() => openDeck(deck.id, deck.name)}>
                <Text>{deck.name}</Text>
            </Pressable>
        ),
    };
});

jest.mock('../../text/Header', () => {
    const { Text } = require('react-native');
    return {
        Header: ({ text }: any) => <Text>{text}</Text>,
    };
});

describe('Library', () => {
    const decks = [
        { id: 1, name: 'A', nbCards: 10, progress: 50 },
        { id: 2, name: 'B', nbCards: 5, progress: 30 },
        { id: 3, name: 'C', nbCards: 0, progress: 0 },
    ];

    it('renders headers and two columns of DeckCard when decks exist', () => {
        const openDeck = jest.fn();
        const { getByText, getByTestId } = render(
            <Library decks={decks as any} openDeck={openDeck} />
        );

        expect(getByText('Bibliothèque')).toBeTruthy();
        expect(getByText('Decks')).toBeTruthy();

        // First column should contain deck 1 and 3 (even indices)
        expect(getByTestId('deck-card-1')).toBeTruthy();
        expect(getByTestId('deck-card-3')).toBeTruthy();
        // Second column should contain deck 2 (odd index)
        expect(getByTestId('deck-card-2')).toBeTruthy();

        // Clicking a deck calls openDeck
        fireEvent.press(getByTestId('deck-card-2'));
        expect(openDeck).toHaveBeenCalledWith(2, 'B');
    });

    it('shows empty message when there are no decks', () => {
        const { getByText, queryByTestId } = render(
            <Library decks={[]} openDeck={jest.fn()} />
        );

        expect(getByText(/Il n'y a aucun deck/)).toBeTruthy();
        expect(queryByTestId('deck-card-1')).toBeNull();
    });

    it('navigates to modalDeck when AddButton is pressed', () => {
        const { router } = require('expo-router');
        (router.push as jest.Mock).mockClear();

        const { getByTestId } = render(
            <Library decks={decks as any} openDeck={jest.fn()} />
        );
        fireEvent.press(getByTestId('add-button'));
        expect(router.push).toHaveBeenCalledWith('/modalDeck');
    });
});
