import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import { CardsToRevise } from '../../../types/FlashRevisionSettings';
import { NumberSelectionModal } from '../NumberSelectionModal';

// Mock the SelectionModal component
jest.mock('../SelectionModal', () => ({
    SelectionModal: ({ children, visible, title, onRequestClose }: any) => {
        const { View, Text } = require('react-native');
        return visible ? (
            <View testID="selection-modal">
                <Text testID="modal-title">{title}</Text>
                {children}
            </View>
        ) : null;
    }
}));

// Mock the ButtonModal component
jest.mock('../../button/ButtonModal', () => ({
    ButtonModal: ({ text, onPress }: any) => {
        const { TouchableOpacity, Text } = require('react-native');
        return (
            <TouchableOpacity testID="validate-button" onPress={onPress}>
                <Text>{text}</Text>
            </TouchableOpacity>
        );
    }
}));

// Mock the Input component
jest.mock('../../text/Input', () => ({
    Input: ({ text, setText, numeric, autofocus }: any) => {
        const { TextInput } = require('react-native');
        return (
            <TextInput
                testID="number-input"
                value={text}
                onChangeText={setText}
                keyboardType={numeric ? 'numeric' : 'default'}
                autoFocus={autofocus}
            />
        );
    }
}));

// Mock ButtonGroup from @rneui/themed
jest.mock('@rneui/themed', () => ({
    ButtonGroup: ({ buttons, selectedIndex, onPress }: any) => {
        const { View, TouchableOpacity, Text } = require('react-native');
        return (
            <View testID="button-group">
                {buttons.map((button: any, index: number) => (
                    <TouchableOpacity
                        key={index}
                        testID={`button-group-${index}`}
                        onPress={() => onPress(index)}
                        style={{ backgroundColor: selectedIndex === index ? 'blue' : 'gray' }}
                    >
                        {button}
                    </TouchableOpacity>
                ))}
            </View>
        );
    }
}));

// Mock the useTranslation hook
jest.mock('../../../hooks/useTranslation', () => ({
    useTranslation: () => ({
        t: (key: string) => {
            const translations: { [key: string]: string } = {
                'revision.under': 'Under',
                'revision.above': 'Above',
                'common.validate': 'Validate'
            };
            return translations[key] || key;
        }
    })
}));

describe('NumberSelectionModal', () => {
    const mockValidate = jest.fn();
    const mockOnRequestClose = jest.fn();

    const defaultProps = {
        visible: true,
        title: 'Select Number',
        showSelector: false,
        selectedCardsToRevise: 'number' as CardsToRevise,
        validate: mockValidate,
        onRequestClose: mockOnRequestClose,
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders correctly when visible', () => {
        const { getByTestId, getByText } = render(<NumberSelectionModal {...defaultProps} />);

        expect(getByTestId('selection-modal')).toBeTruthy();
        expect(getByText('Select Number')).toBeTruthy();
        expect(getByTestId('number-input')).toBeTruthy();
        expect(getByTestId('validate-button')).toBeTruthy();
    });

    it('does not render when not visible', () => {
        const { queryByTestId } = render(
            <NumberSelectionModal {...defaultProps} visible={false} />
        );

        expect(queryByTestId('selection-modal')).toBeNull();
    });

    it('shows selector when showSelector is true', () => {
        const { getByTestId } = render(
            <NumberSelectionModal {...defaultProps} showSelector={true} />
        );

        expect(getByTestId('button-group')).toBeTruthy();
        expect(getByTestId('button-group-0')).toBeTruthy(); // Under button
        expect(getByTestId('button-group-1')).toBeTruthy(); // Above button
    });

    it('does not show selector when showSelector is false', () => {
        const { queryByTestId } = render(
            <NumberSelectionModal {...defaultProps} showSelector={false} />
        );

        expect(queryByTestId('button-group')).toBeNull();
    });

    it('handles number input changes', () => {
        const { getByTestId } = render(<NumberSelectionModal {...defaultProps} />);

        const input = getByTestId('number-input');
        fireEvent.changeText(input, '5');

        // The input should have the new value
        expect(input.props.value).toBe('5');
    });

    it('calls validate with correct parameters when validate button is pressed (without selector)', () => {
        const { getByTestId } = render(<NumberSelectionModal {...defaultProps} />);

        const input = getByTestId('number-input');
        fireEvent.changeText(input, '10');

        const validateButton = getByTestId('validate-button');
        fireEvent.press(validateButton);

        expect(mockValidate).toHaveBeenCalledWith('number', 10, undefined);
    });

    it('calls validate with correct parameters when validate button is pressed (with selector)', () => {
        const { getByTestId } = render(
            <NumberSelectionModal {...defaultProps} showSelector={true} />
        );

        const input = getByTestId('number-input');
        fireEvent.changeText(input, '3');

        // Select "Above" option (index 1)
        const aboveButton = getByTestId('button-group-1');
        fireEvent.press(aboveButton);

        const validateButton = getByTestId('validate-button');
        fireEvent.press(validateButton);

        expect(mockValidate).toHaveBeenCalledWith('number', 3, true);
    });

    it('handles selector state changes', () => {
        const { getByTestId } = render(
            <NumberSelectionModal {...defaultProps} showSelector={true} />
        );

        // Initially "Under" should be selected (index 0)
        const underButton = getByTestId('button-group-0');
        const aboveButton = getByTestId('button-group-1');

        // Press "Above" button
        fireEvent.press(aboveButton);

        // The button group should handle the selection change
        expect(aboveButton).toBeTruthy();
    });

    it('passes correct props to Input component', () => {
        const { getByTestId } = render(<NumberSelectionModal {...defaultProps} />);

        const input = getByTestId('number-input');
        expect(input.props.keyboardType).toBe('numeric');
        expect(input.props.autoFocus).toBe(true);
    });

    it('handles different selectedCardsToRevise values', () => {
        const { getByTestId } = render(
            <NumberSelectionModal {...defaultProps} selectedCardsToRevise="step" />
        );

        const input = getByTestId('number-input');
        fireEvent.changeText(input, '2');

        const validateButton = getByTestId('validate-button');
        fireEvent.press(validateButton);

        expect(mockValidate).toHaveBeenCalledWith('step', 2, undefined);
    });

    it('handles empty number input', () => {
        const { getByTestId } = render(<NumberSelectionModal {...defaultProps} />);

        // Don't set any value in the input (empty string)
        const validateButton = getByTestId('validate-button');
        fireEvent.press(validateButton);

        // Should call validate with 0 when input is empty (parseInt('') || 0)
        expect(mockValidate).toHaveBeenCalledWith('number', 0, undefined);
    });

    it('displays correct title', () => {
        const { getByText } = render(
            <NumberSelectionModal {...defaultProps} title="Custom Title" />
        );

        expect(getByText('Custom Title')).toBeTruthy();
    });
});
