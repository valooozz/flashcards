import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import { SelectionOption } from '../../../types/SelectionOption';
import { ButtonSelectionModal } from '../ButtonSelectionModal';

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
            <TouchableOpacity testID={`button-${text}`} onPress={onPress}>
                <Text>{text}</Text>
            </TouchableOpacity>
        );
    }
}));

describe('ButtonSelectionModal', () => {
    const mockOnRequestClose = jest.fn();
    const mockOption1Press = jest.fn();
    const mockOption2Press = jest.fn();

    const mockOptions: SelectionOption[] = [
        { label: 'Option 1', onPress: mockOption1Press },
        { label: 'Option 2', onPress: mockOption2Press },
    ];

    const defaultProps = {
        visible: true,
        title: 'Test Modal',
        options: mockOptions,
        onRequestClose: mockOnRequestClose,
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders correctly when visible', () => {
        const { getByTestId, getByText } = render(<ButtonSelectionModal {...defaultProps} />);

        expect(getByTestId('selection-modal')).toBeTruthy();
        expect(getByText('Test Modal')).toBeTruthy();
        expect(getByText('Option 1')).toBeTruthy();
        expect(getByText('Option 2')).toBeTruthy();
    });

    it('does not render when not visible', () => {
        const { queryByTestId } = render(
            <ButtonSelectionModal {...defaultProps} visible={false} />
        );

        expect(queryByTestId('selection-modal')).toBeNull();
    });

    it('renders all provided options as buttons', () => {
        const { getByTestId } = render(<ButtonSelectionModal {...defaultProps} />);

        expect(getByTestId('button-Option 1')).toBeTruthy();
        expect(getByTestId('button-Option 2')).toBeTruthy();
    });

    it('calls option onPress when button is pressed', () => {
        const { getByTestId } = render(<ButtonSelectionModal {...defaultProps} />);

        fireEvent.press(getByTestId('button-Option 1'));
        expect(mockOption1Press).toHaveBeenCalledTimes(1);

        fireEvent.press(getByTestId('button-Option 2'));
        expect(mockOption2Press).toHaveBeenCalledTimes(1);
    });

    it('passes correct props to SelectionModal', () => {
        const { getByTestId, getByText } = render(<ButtonSelectionModal {...defaultProps} />);

        expect(getByTestId('selection-modal')).toBeTruthy();
        expect(getByText('Test Modal')).toBeTruthy();
    });

    it('handles empty options array', () => {
        const { getByTestId, queryByTestId } = render(
            <ButtonSelectionModal {...defaultProps} options={[]} />
        );

        expect(getByTestId('selection-modal')).toBeTruthy();
        expect(queryByTestId('button-Option 1')).toBeNull();
        expect(queryByTestId('button-Option 2')).toBeNull();
    });
});
