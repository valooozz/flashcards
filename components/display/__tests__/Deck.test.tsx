import { fireEvent, render, waitFor } from '@testing-library/react-native';
import React from 'react';
import { Deck } from '../Deck';

jest.mock('expo-router', () => ({
    router: { push: jest.fn() },
}));

jest.mock('../../../hooks/useTranslation', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
    }),
}));

jest.mock('../../bar/Toolbar', () => {
    const { View } = require('react-native');
    return {
        Toolbar: ({ children }: any) => <View testID="toolbar">{children}</View>,
    };
});

jest.mock('../../button/BackButton', () => {
    const { Pressable } = require('react-native');
    return {
        BackButton: ({ simpleAction }: any) => (
            <Pressable testID="back-button" onPress={simpleAction} />
        ),
    };
});

jest.mock('../../button/FlashDeckButton', () => {
    const { Pressable } = require('react-native');
    return {
        FlashDeckButton: ({ onPress }: any) => (
            <Pressable testID="flash-deck-button" onPress={onPress} />
        ),
    };
});

jest.mock('../../button/SettingsButton', () => {
    const { Pressable } = require('react-native');
    return {
        SettingsButton: ({ route }: any) => (
            <Pressable testID="settings-button" accessibilityLabel={route} />
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
        Header: ({ text }: any) => <Text testID="header">{text}</Text>,
    };
});

jest.mock('../../text/Input', () => {
    const { TextInput } = require('react-native');
    return {
        Input: ({ text, setText, autofocus }: any) => (
            <TextInput
                testID="search-input"
                value={text}
                onChangeText={setText}
                autoFocus={autofocus}
            />
        ),
    };
});

jest.mock('../../bar/DeckProgressBar', () => {
    const { View } = require('react-native');
    return {
        DeckProgressBar: ({ progress }: any) => (
            <View testID="progress-bar" accessibilityLabel={`progress-${progress}`} />
        ),
    };
});

describe('Deck', () => {
    const sampleCards = [
        { id: 1, recto: 'Hello', verso: 'Bonjour', deck: 5, rectoFirst: 1, step: 0, nextRevision: '2023-01-01', toLearn: 1, changeSide: 0 },
        { id: 2, recto: 'Goodbye', verso: 'Au revoir', deck: 5, rectoFirst: 1, step: 0, nextRevision: '2023-01-01', toLearn: 1, changeSide: 0 },
        { id: 3, recto: 'Thank you', verso: 'Merci', deck: 5, rectoFirst: 1, step: 0, nextRevision: '2023-01-01', toLearn: 1, changeSide: 0 },
    ];

    const defaultProps = {
        idDeck: 5,
        deckName: 'Test Deck',
        cards: sampleCards,
        nbCards: sampleCards.length,
        progress: 42,
        reload: jest.fn(),
        closeDeck: jest.fn(),
        chooseRevisionSide: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('Basic Rendering', () => {
        it('renders all main components when there are cards', () => {
            const { getByText, getByTestId, queryByText } = render(
                <Deck {...defaultProps} />
            );

            // Headers
            expect(getByText('Test Deck')).toBeTruthy();
            expect(getByText(`deck.cards (${sampleCards.length})`)).toBeTruthy();

            // Components
            expect(getByTestId('toolbar')).toBeTruthy();
            expect(getByTestId('progress-bar')).toBeTruthy();
            expect(getByTestId('search-toggle-button')).toBeTruthy();
            expect(getByTestId('add-button')).toBeTruthy();

            // List items
            expect(getByTestId('list-card-1')).toBeTruthy();
            expect(getByTestId('list-card-2')).toBeTruthy();
            expect(getByTestId('list-card-3')).toBeTruthy();

            // Empty message should not be present
            expect(queryByText('deck.noCards')).toBeNull();
        });

        it('shows empty message when there are no cards', () => {
            const { getByText, queryByTestId } = render(
                <Deck {...defaultProps} cards={[]} nbCards={0} progress={0} />
            );

            expect(getByText('Test Deck')).toBeTruthy();
            expect(getByText('deck.cards')).toBeTruthy();
            expect(getByText('deck.noCards')).toBeTruthy();
            expect(queryByTestId('list-card-1')).toBeNull();
        });

        it('renders progress bar with correct progress value', () => {
            const { getByTestId } = render(
                <Deck {...defaultProps} progress={75} />
            );

            const progressBar = getByTestId('progress-bar');
            expect(progressBar).toBeTruthy();
            expect(progressBar.props.accessibilityLabel).toBe('progress-75');
        });
    });

    describe('Button Interactions', () => {
        it('calls chooseRevisionSide when FlashDeckButton is pressed', () => {
            const chooseRevisionSide = jest.fn();
            const { getByTestId } = render(
                <Deck {...defaultProps} chooseRevisionSide={chooseRevisionSide} />
            );

            fireEvent.press(getByTestId('flash-deck-button'));
            expect(chooseRevisionSide).toHaveBeenCalledWith(5);
        });

        it('calls closeDeck when BackButton is pressed', () => {
            const closeDeck = jest.fn();
            const { getByTestId } = render(
                <Deck {...defaultProps} closeDeck={closeDeck} />
            );

            fireEvent.press(getByTestId('back-button'));
            expect(closeDeck).toHaveBeenCalledTimes(1);
        });

        it('navigates to modalCard when AddButton is pressed', () => {
            const { router } = require('expo-router');
            const { getByTestId } = render(
                <Deck {...defaultProps} idDeck={7} />
            );

            fireEvent.press(getByTestId('add-button'));
            expect(router.push).toHaveBeenCalledWith('/modalCard?idDeck=7');
        });

        it('calls reload when a card is pressed', () => {
            const reload = jest.fn();
            const { getByTestId } = render(
                <Deck {...defaultProps} reload={reload} />
            );

            fireEvent.press(getByTestId('list-card-1'));
            expect(reload).toHaveBeenCalledTimes(1);
        });

        it('renders settings button with correct route', () => {
            const { getByTestId } = render(
                <Deck {...defaultProps} idDeck={123} />
            );

            const settingsButton = getByTestId('settings-button');
            expect(settingsButton).toBeTruthy();
            expect(settingsButton.props.accessibilityLabel).toBe('/modalDeck?idDeck=123');
        });
    });

    describe('Search Functionality', () => {
        it('toggles search mode when search button is pressed', () => {
            const { getByTestId, queryByTestId } = render(
                <Deck {...defaultProps} />
            );

            // Initially search input should not be visible
            expect(queryByTestId('search-input')).toBeNull();

            // Press search toggle button
            fireEvent.press(getByTestId('search-toggle-button'));

            // Search input should now be visible
            expect(getByTestId('search-input')).toBeTruthy();
        });

        it('closes search mode and clears search text when search button is pressed again', async () => {
            const { getByTestId, queryByTestId } = render(
                <Deck {...defaultProps} />
            );

            // Open search mode
            fireEvent.press(getByTestId('search-toggle-button'));
            expect(getByTestId('search-input')).toBeTruthy();

            // Type in search input
            const searchInput = getByTestId('search-input');
            fireEvent.changeText(searchInput, 'hello');
            expect(searchInput.props.value).toBe('hello');

            // Close search mode
            fireEvent.press(getByTestId('search-toggle-button'));

            // Search input should be hidden
            expect(queryByTestId('search-input')).toBeNull();

            // Reopen search mode to check if text was cleared
            fireEvent.press(getByTestId('search-toggle-button'));
            const newSearchInput = getByTestId('search-input');
            expect(newSearchInput.props.value).toBe('');
        });

        it('filters cards based on recto text', async () => {
            const { getByTestId, queryByTestId } = render(
                <Deck {...defaultProps} />
            );

            // Open search mode
            fireEvent.press(getByTestId('search-toggle-button'));
            const searchInput = getByTestId('search-input');

            // Search for "hello" (should match first card's recto)
            fireEvent.changeText(searchInput, 'hello');

            // Wait for filtering to take effect
            await waitFor(() => {
                expect(getByTestId('list-card-1')).toBeTruthy(); // "Hello" card should be visible
                expect(queryByTestId('list-card-2')).toBeNull(); // "Goodbye" card should be hidden
                expect(queryByTestId('list-card-3')).toBeNull(); // "Thank you" card should be hidden
            });
        });

        it('filters cards based on verso text', async () => {
            const { getByTestId, queryByTestId } = render(
                <Deck {...defaultProps} />
            );

            // Open search mode
            fireEvent.press(getByTestId('search-toggle-button'));
            const searchInput = getByTestId('search-input');

            // Search for "merci" (should match third card's verso)
            fireEvent.changeText(searchInput, 'merci');

            // Wait for filtering to take effect
            await waitFor(() => {
                expect(queryByTestId('list-card-1')).toBeNull(); // "Hello" card should be hidden
                expect(queryByTestId('list-card-2')).toBeNull(); // "Goodbye" card should be hidden
                expect(getByTestId('list-card-3')).toBeTruthy(); // "Thank you" card should be visible
            });
        });

        it('shows all cards when search text is empty', async () => {
            const { getByTestId } = render(
                <Deck {...defaultProps} />
            );

            // Open search mode
            fireEvent.press(getByTestId('search-toggle-button'));
            const searchInput = getByTestId('search-input');

            // Search for something first
            fireEvent.changeText(searchInput, 'hello');

            // Clear search
            fireEvent.changeText(searchInput, '');

            // Wait for filtering to take effect
            await waitFor(() => {
                expect(getByTestId('list-card-1')).toBeTruthy();
                expect(getByTestId('list-card-2')).toBeTruthy();
                expect(getByTestId('list-card-3')).toBeTruthy();
            });
        });

        it('search is case insensitive', async () => {
            const { getByTestId, queryByTestId } = render(
                <Deck {...defaultProps} />
            );

            // Open search mode
            fireEvent.press(getByTestId('search-toggle-button'));
            const searchInput = getByTestId('search-input');

            // Search for "HELLO" (uppercase)
            fireEvent.changeText(searchInput, 'HELLO');

            // Wait for filtering to take effect
            await waitFor(() => {
                expect(getByTestId('list-card-1')).toBeTruthy(); // "Hello" card should be visible
                expect(queryByTestId('list-card-2')).toBeNull(); // Other cards should be hidden
                expect(queryByTestId('list-card-3')).toBeNull();
            });
        });

        it('sets autofocus on search input when search mode is opened', () => {
            const { getByTestId } = render(
                <Deck {...defaultProps} />
            );

            // Open search mode
            fireEvent.press(getByTestId('search-toggle-button'));
            const searchInput = getByTestId('search-input');

            expect(searchInput.props.autoFocus).toBe(true);
        });
    });

    describe('Props and State Updates', () => {
        it('updates filtered cards when cards prop changes', async () => {
            const { getByTestId, queryByTestId, rerender } = render(
                <Deck {...defaultProps} />
            );

            // Initially all cards should be visible
            expect(getByTestId('list-card-1')).toBeTruthy();
            expect(getByTestId('list-card-2')).toBeTruthy();
            expect(getByTestId('list-card-3')).toBeTruthy();

            // Update with fewer cards
            const newCards = [sampleCards[0]]; // Only first card
            rerender(
                <Deck {...defaultProps} cards={newCards} nbCards={1} />
            );

            await waitFor(() => {
                expect(getByTestId('list-card-1')).toBeTruthy();
                expect(queryByTestId('list-card-2')).toBeNull();
                expect(queryByTestId('list-card-3')).toBeNull();
            });
        });

        it('shows cards when nbCards changes from 0 to positive', async () => {
            const { getByText, queryByText, rerender } = render(
                <Deck {...defaultProps} cards={[]} nbCards={0} />
            );

            // Initially should show empty message
            expect(getByText('deck.noCards')).toBeTruthy();

            // Update with cards
            rerender(
                <Deck {...defaultProps} cards={sampleCards} nbCards={sampleCards.length} />
            );

            await waitFor(() => {
                expect(queryByText('deck.noCards')).toBeNull();
            });
        });

        it('displays correct card count in header', () => {
            const { getByText, rerender } = render(
                <Deck {...defaultProps} nbCards={5} />
            );

            expect(getByText('deck.cards (5)')).toBeTruthy();

            // Update card count
            rerender(
                <Deck {...defaultProps} nbCards={10} />
            );

            expect(getByText('deck.cards (10)')).toBeTruthy();
        });

        it('displays header without count when nbCards is 0', () => {
            const { getByText } = render(
                <Deck {...defaultProps} nbCards={0} />
            );

            expect(getByText('deck.cards')).toBeTruthy();
        });
    });

    describe('Edge Cases', () => {
        it('handles empty search results gracefully', async () => {
            const { getByTestId, queryByTestId } = render(
                <Deck {...defaultProps} />
            );

            // Open search mode
            fireEvent.press(getByTestId('search-toggle-button'));
            const searchInput = getByTestId('search-input');

            // Search for something that doesn't exist
            fireEvent.changeText(searchInput, 'nonexistent');

            // Wait for filtering to take effect
            await waitFor(() => {
                expect(queryByTestId('list-card-1')).toBeNull();
                expect(queryByTestId('list-card-2')).toBeNull();
                expect(queryByTestId('list-card-3')).toBeNull();
            });
        });

        it('handles cards with empty recto/verso text', async () => {
            const cardsWithEmptyText = [
                { id: 1, recto: '', verso: 'verso1', deck: 5, rectoFirst: 1, step: 0, nextRevision: '2023-01-01', toLearn: 1, changeSide: 0 },
                { id: 2, recto: 'recto2', verso: '', deck: 5, rectoFirst: 1, step: 0, nextRevision: '2023-01-01', toLearn: 1, changeSide: 0 },
                { id: 3, recto: '', verso: '', deck: 5, rectoFirst: 1, step: 0, nextRevision: '2023-01-01', toLearn: 1, changeSide: 0 },
            ];

            const { getByTestId, queryByTestId } = render(
                <Deck {...defaultProps} cards={cardsWithEmptyText} />
            );

            // Open search mode
            fireEvent.press(getByTestId('search-toggle-button'));
            const searchInput = getByTestId('search-input');

            // Search for "verso1"
            fireEvent.changeText(searchInput, 'verso1');

            await waitFor(() => {
                expect(getByTestId('list-card-1')).toBeTruthy(); // Card with verso1 should be visible
                expect(queryByTestId('list-card-2')).toBeNull();
                expect(queryByTestId('list-card-3')).toBeNull();
            });

            // Search for "recto2"
            fireEvent.changeText(searchInput, 'recto2');

            await waitFor(() => {
                expect(queryByTestId('list-card-1')).toBeNull();
                expect(getByTestId('list-card-2')).toBeTruthy(); // Card with recto2 should be visible
                expect(queryByTestId('list-card-3')).toBeNull();
            });
        });

        it('handles special characters in search text', async () => {
            const cardsWithSpecialChars = [
                { id: 1, recto: 'Hello!', verso: 'Bonjour?', deck: 5, rectoFirst: 1, step: 0, nextRevision: '2023-01-01', toLearn: 1, changeSide: 0 },
                { id: 2, recto: 'C++', verso: 'Programming', deck: 5, rectoFirst: 1, step: 0, nextRevision: '2023-01-01', toLearn: 1, changeSide: 0 },
            ];

            const { getByTestId, queryByTestId } = render(
                <Deck {...defaultProps} cards={cardsWithSpecialChars} />
            );

            // Open search mode
            fireEvent.press(getByTestId('search-toggle-button'));
            const searchInput = getByTestId('search-input');

            // Search for "C++"
            fireEvent.changeText(searchInput, 'C++');

            await waitFor(() => {
                expect(queryByTestId('list-card-1')).toBeNull();
                expect(getByTestId('list-card-2')).toBeTruthy();
            });

            // Search for "Hello!"
            fireEvent.changeText(searchInput, 'Hello!');

            await waitFor(() => {
                expect(getByTestId('list-card-1')).toBeTruthy();
                expect(queryByTestId('list-card-2')).toBeNull();
            });
        });

        it('handles rapid search mode toggling', () => {
            const { getByTestId, queryByTestId } = render(
                <Deck {...defaultProps} />
            );

            const searchToggle = getByTestId('search-toggle-button');

            // Rapidly toggle search mode multiple times
            fireEvent.press(searchToggle); // Open
            expect(getByTestId('search-input')).toBeTruthy();

            fireEvent.press(searchToggle); // Close
            expect(queryByTestId('search-input')).toBeNull();

            fireEvent.press(searchToggle); // Open again
            expect(getByTestId('search-input')).toBeTruthy();

            fireEvent.press(searchToggle); // Close again
            expect(queryByTestId('search-input')).toBeNull();
        });

        it('maintains search state when cards prop updates during search', async () => {
            const { getByTestId, queryByTestId, rerender } = render(
                <Deck {...defaultProps} />
            );

            // Open search mode and search for "hello"
            fireEvent.press(getByTestId('search-toggle-button'));
            const searchInput = getByTestId('search-input');
            fireEvent.changeText(searchInput, 'hello');

            // Update cards prop with new cards that don't match search
            const newCards = [
                { id: 4, recto: 'New Card', verso: 'Nouvelle Carte', deck: 5, rectoFirst: 1, step: 0, nextRevision: '2023-01-01', toLearn: 1, changeSide: 0 },
            ];

            rerender(
                <Deck {...defaultProps} cards={newCards} nbCards={1} />
            );

            // Search input should still contain "hello"
            const updatedSearchInput = getByTestId('search-input');
            expect(updatedSearchInput.props.value).toBe('hello');

            // No cards should be visible since none match "hello"
            await waitFor(() => {
                expect(queryByTestId('list-card-4')).toBeNull();
            });
        });

        it('handles undefined or null card properties gracefully', async () => {
            const cardsWithNullProps = [
                { id: 1, recto: null, verso: 'verso1', deck: 5, rectoFirst: 1, step: 0, nextRevision: '2023-01-01', toLearn: 1, changeSide: 0 },
                { id: 2, recto: 'recto2', verso: undefined, deck: 5, rectoFirst: 1, step: 0, nextRevision: '2023-01-01', toLearn: 1, changeSide: 0 },
            ] as any;

            const { getByTestId } = render(
                <Deck {...defaultProps} cards={cardsWithNullProps} />
            );

            // Component should render without crashing
            expect(getByTestId('list-card-1')).toBeTruthy();
            expect(getByTestId('list-card-2')).toBeTruthy();

            // Search should work even with null/undefined values
            fireEvent.press(getByTestId('search-toggle-button'));
            const searchInput = getByTestId('search-input');

            // This should not crash
            fireEvent.changeText(searchInput, 'verso1');

            // The component should handle the null/undefined gracefully
            expect(searchInput).toBeTruthy();
        });
    });
});
