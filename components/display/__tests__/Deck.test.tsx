import { render } from '@testing-library/react-native';
import React from 'react';
import { PaperProvider } from 'react-native-paper';
import { Deck } from '../Deck';

jest.mock('../../../hooks/useTranslation', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
    }),
}));

jest.mock('../../card/ListCard', () => {
    const React = require('react');
    const { Text } = require('react-native-paper');
    return {
        ListCard: ({ card }: any) => React.createElement(Text, { testID: `list-card-${card.id}` }, String(card.id)),
    };
});

describe('Deck', () => {
    const baseProps = {
        idDeck: 1,
        deckName: 'My Deck',
        reload: jest.fn(),
        closeDeck: jest.fn(),
        chooseFlashRevisionSettings: jest.fn(),
    } as const;

    const cards = [
        {
            id: 101,
            deck: 1,
            recto: 'Alpha',
            verso: 'One',
            toLearn: 1,
            step: 1,
            nextRevision: '2025-01-01',
            rectoImage: undefined,
            versoImage: undefined,
            changeSide: false,
        },
        {
            id: 102,
            deck: 1,
            recto: 'Beta',
            verso: 'Two',
            toLearn: 0,
            step: 8,
            nextRevision: null,
            rectoImage: undefined,
            versoImage: undefined,
            changeSide: true,
        },
    ];

    it('renders deck title and all provided cards', () => {
        const { getByText, getByTestId } = render(
            <PaperProvider>
                <Deck
                    idDeck={baseProps.idDeck}
                    deckName={baseProps.deckName}
                    cards={cards as any}
                    nbCards={cards.length}
                    progress={0.5}
                    reload={baseProps.reload}
                    closeDeck={baseProps.closeDeck}
                    chooseFlashRevisionSettings={baseProps.chooseFlashRevisionSettings}
                />
            </PaperProvider>
        );

        expect(getByText('My Deck')).toBeTruthy();
        expect(getByTestId('list-card-101')).toBeTruthy();
        expect(getByTestId('list-card-102')).toBeTruthy();
    });

    it('shows no-cards message when nbCards is 0', () => {
        const { getByText } = render(
            <PaperProvider>
                <Deck
                    idDeck={baseProps.idDeck}
                    deckName={baseProps.deckName}
                    cards={[] as any}
                    nbCards={0}
                    progress={0}
                    reload={baseProps.reload}
                    closeDeck={baseProps.closeDeck}
                    chooseFlashRevisionSettings={baseProps.chooseFlashRevisionSettings}
                />
            </PaperProvider>
        );

        expect(getByText('deck.noCards')).toBeTruthy();
    });
});


