import { render } from '@testing-library/react-native';
import React from 'react';
import { PaperProvider } from 'react-native-paper';
import { Library } from '../Library';

jest.mock('../../../hooks/useTranslation', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
    }),
}));

jest.mock('expo-sqlite', () => ({
    useSQLiteContext: () => ({}),
}));

jest.mock('../../card/DeckCard', () => {
    const React = require('react');
    const { Text } = require('react-native-paper');
    return {
        DeckCard: ({ deck }: any) => React.createElement(Text, { testID: `deck-card-${deck.id}` }, String(deck.name)),
    };
});

describe('Library', () => {
    const baseProps = {
        progress: 0.42,
        openDeck: jest.fn(),
        chooseFlashRevisionSettings: jest.fn(),
    } as const;

    const decks = [
        { id: 1, name: 'French', nbCards: 10, progress: 0.5 },
        { id: 2, name: 'Spanish', nbCards: 5, progress: 0.2 },
    ] as any;

    it('renders title and all deck cards when decks provided', () => {
        const { getByText, getByTestId } = render(
            <PaperProvider>
                <Library
                    decks={decks}
                    progress={baseProps.progress}
                    openDeck={baseProps.openDeck}
                    chooseFlashRevisionSettings={baseProps.chooseFlashRevisionSettings}
                />
            </PaperProvider>
        );

        expect(getByText('library.title')).toBeTruthy();
        expect(getByTestId('deck-card-1')).toBeTruthy();
        expect(getByTestId('deck-card-2')).toBeTruthy();
    });

    it('shows no-deck message when decks list is empty', () => {
        const { getByText } = render(
            <PaperProvider>
                <Library
                    decks={[] as any}
                    progress={0}
                    openDeck={baseProps.openDeck}
                    chooseFlashRevisionSettings={baseProps.chooseFlashRevisionSettings}
                />
            </PaperProvider>
        );

        expect(getByText('library.noDeck')).toBeTruthy();
    });
});


