import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Deck } from '../Deck';
import { Text, Pressable, View } from 'react-native';

jest.mock('expo-router', () => ({
    router: { push: jest.fn() },
}));

jest.mock('../../bar/Toolbar', () => {
    const { Pressable } = require('react-native');
    return {
        Toolbar: ({ actionBackButton }: any) => (
            <Pressable testID="toolbar-back" onPress={actionBackButton} />
        ),
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

jest.mock('../../card/ListCard', () => {
    const { Pressable } = require('react-native');
    return {
        ListCard: ({ card, triggerReload }: any) => (
            <Pressable testID={`list-card-${card.id}`} onPress={triggerReload} />
        ),
    };
});

jest.mock('../../text/Header', () => {
    const { Text } = require('react-native');
    return {
        Header: ({ text }: any) => <Text>{text}</Text>,
    };
});

jest.mock('../../bar/DeckProgressBar', () => {
    const { View } = require('react-native');
    return {
        DeckProgressBar: ({ progress }: any) => (
            <View accessibilityLabel={`progress-${progress}`} />
        ),
    };
});

describe('Deck', () => {
    const sampleCards = [
        { id: 1, recto: 'r1', verso: 'v1', deck: 5, rectoFirst: 1, step: 0, nextRevision: '2023-01-01', toLearn: 1, changeSide: 0 },
        { id: 2, recto: 'r2', verso: 'v2', deck: 5, rectoFirst: 1, step: 0, nextRevision: '2023-01-01', toLearn: 1, changeSide: 0 },
    ];

    it('renders headers, progress and list when there are cards', () => {
        const closeDeck = jest.fn();
        const reload = jest.fn();
        const { getByText, getByTestId, queryByText } = render(
            <Deck
                idDeck={5}
                deckName="My Deck"
                cards={sampleCards as any}
                nbCards={sampleCards.length}
                progress={42}
                reload={reload}
                closeDeck={closeDeck}
            />
        );

        expect(getByText('My Deck')).toBeTruthy();
        expect(getByText(`Cartes (${sampleCards.length})`)).toBeTruthy();
        // List items rendered via mocks
        expect(getByTestId('list-card-1')).toBeTruthy();
        expect(getByTestId('list-card-2')).toBeTruthy();
        // Empty message should not be present
        expect(
            queryByText(/Ce deck ne contient aucune carte/)
        ).toBeNull();

        // Trigger back action
        fireEvent.press(getByTestId('toolbar-back'));
        expect(closeDeck).toHaveBeenCalled();

        // Trigger reload via a card press
        fireEvent.press(getByTestId('list-card-1'));
        expect(reload).toHaveBeenCalled();
    });

    it('shows empty message when there are no cards', () => {
        const { getByText, queryByTestId } = render(
            <Deck
                idDeck={1}
                deckName="Empty"
                cards={[]}
                nbCards={0}
                progress={0}
                reload={jest.fn()}
                closeDeck={jest.fn()}
            />
        );

        expect(getByText('Empty')).toBeTruthy();
        expect(getByText('Cartes ')).toBeTruthy();
        expect(
            getByText(/Ce deck ne contient aucune carte/)
        ).toBeTruthy();
        expect(queryByTestId('list-card-1')).toBeNull();
    });

    it('navigates to modalCard when AddButton is pressed', () => {
        const { router } = require('expo-router');
        (router.push as jest.Mock).mockClear();

        const { getByTestId } = render(
            <Deck
                idDeck={7}
                deckName="Deck"
                cards={sampleCards as any}
                nbCards={2}
                progress={10}
                reload={jest.fn()}
                closeDeck={jest.fn()}
            />
        );

        fireEvent.press(getByTestId('add-button'));
        expect(router.push).toHaveBeenCalledWith('/modalCard?idDeck=7');
    });
});
