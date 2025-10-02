import { fireEvent, render, waitFor } from '@testing-library/react-native';
import React from 'react';
import { FlashRevisionSettingsModal } from '../FlashRevisionSettingsModal';

// Mock the ButtonSelectionModal component
jest.mock('../ButtonSelectionModal', () => ({
    ButtonSelectionModal: ({ visible, title, options, onRequestClose }: any) => {
        const { View, Text, TouchableOpacity } = require('react-native');
        return visible ? (
            <View testID="button-selection-modal">
                <Text testID="button-modal-title">{title}</Text>
                {options.map((option: any, index: number) => (
                    <TouchableOpacity
                        key={index}
                        testID={`option-${option.label}`}
                        onPress={option.onPress}
                    >
                        <Text>{option.label}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        ) : null;
    }
}));

// Mock the NumberSelectionModal component
jest.mock('../NumberSelectionModal', () => ({
    NumberSelectionModal: ({ visible, title, selectedCardsToRevise, validate, onRequestClose, showSelector }: any) => {
        const { View, Text, TouchableOpacity, TextInput } = require('react-native');
        const [value, setValue] = require('react').useState('');

        return visible ? (
            <View testID="number-selection-modal">
                <Text testID="number-modal-title">{title}</Text>
                <TextInput
                    testID="number-input"
                    value={value}
                    onChangeText={setValue}
                />
                <TouchableOpacity
                    testID="number-validate"
                    onPress={() => validate(selectedCardsToRevise, parseInt(value) || 0, showSelector ? false : undefined)}
                >
                    <Text>Validate</Text>
                </TouchableOpacity>
            </View>
        ) : null;
    }
}));

// Mock the useTranslation hook
jest.mock('../../../hooks/useTranslation', () => ({
    useTranslation: () => ({
        t: (key: string) => {
            const translations: { [key: string]: string } = {
                'revision.chooseCards': 'Choose Cards',
                'revision.chooseNumber': 'Choose Number',
                'revision.chooseStep': 'Choose Step',
                'revision.chooseSide': 'Choose Side',
                'revision.all': 'All',
                'revision.number': 'Number',
                'revision.step': 'Step',
                'revision.notLearnt': 'Not Learnt',
                'revision.recto': 'Recto',
                'revision.verso': 'Verso',
                'revision.current': 'Current',
                'revision.random': 'Random'
            };
            return translations[key] || key;
        }
    })
}));

describe('FlashRevisionSettingsModal', () => {
    const mockOpenRevision = jest.fn();
    const mockCloseModal = jest.fn();

    const defaultProps = {
        visible: true,
        openRevision: mockOpenRevision,
        closeModal: mockCloseModal,
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders correctly when visible', () => {
        const { getByTestId, getByText } = render(<FlashRevisionSettingsModal {...defaultProps} />);

        expect(getByTestId('button-selection-modal')).toBeTruthy();
        expect(getByText('Choose Cards')).toBeTruthy();
    });

    it('does not render when not visible', () => {
        const { queryByTestId } = render(
            <FlashRevisionSettingsModal {...defaultProps} visible={false} />
        );

        expect(queryByTestId('button-selection-modal')).toBeNull();
        expect(queryByTestId('number-selection-modal')).toBeNull();
    });

    it('shows initial cards selection options', () => {
        const { getByTestId } = render(<FlashRevisionSettingsModal {...defaultProps} />);

        expect(getByTestId('option-All')).toBeTruthy();
        expect(getByTestId('option-Number')).toBeTruthy();
        expect(getByTestId('option-Step')).toBeTruthy();
        expect(getByTestId('option-Not Learnt')).toBeTruthy();
    });

    it('handles "All" cards selection and shows revision side options', async () => {
        const { getByTestId, getByText } = render(<FlashRevisionSettingsModal {...defaultProps} />);

        fireEvent.press(getByTestId('option-All'));

        await waitFor(() => {
            expect(getByText('Choose Side')).toBeTruthy();
            expect(getByTestId('option-Recto')).toBeTruthy();
            expect(getByTestId('option-Verso')).toBeTruthy();
            expect(getByTestId('option-Current')).toBeTruthy();
            expect(getByTestId('option-Random')).toBeTruthy();
        });
    });

    it('handles "Not Learnt" cards selection and shows revision side options', async () => {
        const { getByTestId, getByText } = render(<FlashRevisionSettingsModal {...defaultProps} />);

        fireEvent.press(getByTestId('option-Not Learnt'));

        await waitFor(() => {
            expect(getByText('Choose Side')).toBeTruthy();
            expect(getByTestId('option-Recto')).toBeTruthy();
            expect(getByTestId('option-Verso')).toBeTruthy();
            expect(getByTestId('option-Current')).toBeTruthy();
            expect(getByTestId('option-Random')).toBeTruthy();
        });
    });

    it('handles "Number" cards selection and shows number input modal', async () => {
        const { getByTestId, getByText } = render(<FlashRevisionSettingsModal {...defaultProps} />);

        fireEvent.press(getByTestId('option-Number'));

        await waitFor(() => {
            expect(getByTestId('number-selection-modal')).toBeTruthy();
            expect(getByText('Choose Number')).toBeTruthy();
        });
    });

    it('handles "Step" cards selection and shows step input modal', async () => {
        const { getByTestId, getByText } = render(<FlashRevisionSettingsModal {...defaultProps} />);

        fireEvent.press(getByTestId('option-Step'));

        await waitFor(() => {
            expect(getByTestId('number-selection-modal')).toBeTruthy();
            expect(getByText('Choose Step')).toBeTruthy();
        });
    });

    it('completes full flow for "All" cards with "Recto" side', async () => {
        const { getByTestId } = render(<FlashRevisionSettingsModal {...defaultProps} />);

        // Select "All" cards
        fireEvent.press(getByTestId('option-All'));

        await waitFor(() => {
            expect(getByTestId('option-Recto')).toBeTruthy();
        });

        // Select "Recto" side
        fireEvent.press(getByTestId('option-Recto'));

        expect(mockOpenRevision).toHaveBeenCalledWith({
            cardsToRevise: 'all',
            revisionSide: 'recto'
        });
    });

    it('completes full flow for "Number" cards with number input', async () => {
        const { getByTestId } = render(<FlashRevisionSettingsModal {...defaultProps} />);

        // Select "Number" cards
        fireEvent.press(getByTestId('option-Number'));

        await waitFor(() => {
            expect(getByTestId('number-selection-modal')).toBeTruthy();
        });

        // Input a number and validate
        const input = getByTestId('number-input');
        fireEvent.changeText(input, '5');
        fireEvent.press(getByTestId('number-validate'));

        await waitFor(() => {
            expect(getByTestId('option-Recto')).toBeTruthy();
        });

        // Select revision side
        fireEvent.press(getByTestId('option-Recto'));

        expect(mockOpenRevision).toHaveBeenCalledWith({
            cardsToRevise: 'number',
            revisionSide: 'recto',
            numberOfCards: 5,
            stepDelimiter: undefined
        });
    });

    it('completes full flow for "Step" cards with step delimiter', async () => {
        const { getByTestId } = render(<FlashRevisionSettingsModal {...defaultProps} />);

        // Select "Step" cards
        fireEvent.press(getByTestId('option-Step'));

        await waitFor(() => {
            expect(getByTestId('number-selection-modal')).toBeTruthy();
        });

        // Input a step and validate
        const input = getByTestId('number-input');
        fireEvent.changeText(input, '3');
        fireEvent.press(getByTestId('number-validate'));

        await waitFor(() => {
            expect(getByTestId('option-Verso')).toBeTruthy();
        });

        // Select revision side
        fireEvent.press(getByTestId('option-Verso'));

        expect(mockOpenRevision).toHaveBeenCalledWith({
            cardsToRevise: 'step',
            revisionSide: 'verso',
            numberOfCards: undefined,
            stepDelimiter: {
                above: false,
                step: 3
            }
        });
    });

    it('resets state when modal becomes visible', async () => {
        const { rerender, getByTestId, getByText } = render(
            <FlashRevisionSettingsModal {...defaultProps} visible={false} />
        );

        // Make modal visible
        rerender(<FlashRevisionSettingsModal {...defaultProps} visible={true} />);

        await waitFor(() => {
            expect(getByTestId('button-selection-modal')).toBeTruthy();
            expect(getByText('Choose Cards')).toBeTruthy();
        });
    });

    it('handles different revision side selections correctly', async () => {
        const { getByTestId, rerender } = render(<FlashRevisionSettingsModal {...defaultProps} />);

        // Select "All" cards to get to revision side selection
        fireEvent.press(getByTestId('option-All'));

        await waitFor(() => {
            expect(getByTestId('option-Verso')).toBeTruthy();
        });

        // Test different revision sides
        fireEvent.press(getByTestId('option-Verso'));

        expect(mockOpenRevision).toHaveBeenCalledWith({
            cardsToRevise: 'all',
            revisionSide: 'verso'
        });

        // Reset and test another side
        mockOpenRevision.mockClear();

        // Re-render the component to reset state
        rerender(<FlashRevisionSettingsModal {...defaultProps} visible={false} />);
        rerender(<FlashRevisionSettingsModal {...defaultProps} visible={true} />);

        // Select "All" again
        fireEvent.press(getByTestId('option-All'));

        await waitFor(() => {
            expect(getByTestId('option-Random')).toBeTruthy();
        });

        fireEvent.press(getByTestId('option-Random'));

        expect(mockOpenRevision).toHaveBeenCalledWith({
            cardsToRevise: 'all',
            revisionSide: 'random'
        });
    });
});
