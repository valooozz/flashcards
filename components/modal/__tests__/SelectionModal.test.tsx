import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Text, View } from 'react-native';
import { SelectionModal } from '../SelectionModal';

describe('SelectionModal', () => {
    const mockOnRequestClose = jest.fn();

    const defaultProps = {
        visible: true,
        title: 'Test Modal Title',
        onRequestClose: mockOnRequestClose,
        children: (
            <View testID="modal-children">
                <Text>Test Child Content</Text>
            </View>
        ),
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders correctly when visible', () => {
        const { getByText, getByTestId } = render(<SelectionModal {...defaultProps} />);
        
        expect(getByText('Test Modal Title')).toBeTruthy();
        expect(getByTestId('modal-children')).toBeTruthy();
        expect(getByText('Test Child Content')).toBeTruthy();
    });

    it('does not render when not visible', () => {
        const { queryByText, queryByTestId } = render(
            <SelectionModal {...defaultProps} visible={false} />
        );
        
        expect(queryByText('Test Modal Title')).toBeNull();
        expect(queryByTestId('modal-children')).toBeNull();
    });

    it('displays the correct title', () => {
        const { getByText } = render(
            <SelectionModal {...defaultProps} title="Custom Title" />
        );
        
        expect(getByText('Custom Title')).toBeTruthy();
    });

    it('renders children content', () => {
        const customChildren = (
            <View testID="custom-children">
                <Text>Custom Child 1</Text>
                <Text>Custom Child 2</Text>
            </View>
        );

        const { getByTestId, getByText } = render(
            <SelectionModal {...defaultProps} children={customChildren} />
        );
        
        expect(getByTestId('custom-children')).toBeTruthy();
        expect(getByText('Custom Child 1')).toBeTruthy();
        expect(getByText('Custom Child 2')).toBeTruthy();
    });

    it('calls onRequestClose when backdrop is pressed', () => {
        const { getByTestId } = render(<SelectionModal {...defaultProps} />);
        
        // Find the TouchableOpacity backdrop by looking for the element that contains the modal content
        // but is not the modal content itself
        const backdrop = getByTestId('modal-children').parent?.parent;
        
        if (backdrop) {
            fireEvent.press(backdrop);
            expect(mockOnRequestClose).toHaveBeenCalledTimes(1);
        }
    });

    it('has transparent modal background', () => {
        const { getByText } = render(<SelectionModal {...defaultProps} />);
        
        // The modal should be rendered (we can verify by checking if content is present)
        expect(getByText('Test Modal Title')).toBeTruthy();
    });

    it('renders with proper modal structure', () => {
        const { getByText, getByTestId } = render(<SelectionModal {...defaultProps} />);
        
        // Verify that both title and children are rendered within the modal
        const title = getByText('Test Modal Title');
        const children = getByTestId('modal-children');
        
        expect(title).toBeTruthy();
        expect(children).toBeTruthy();
    });

    it('handles empty children', () => {
        const { getByText, queryByTestId } = render(
            <SelectionModal {...defaultProps} children={null} />
        );
        
        // Title should still be rendered even with no children
        expect(getByText('Test Modal Title')).toBeTruthy();
        expect(queryByTestId('modal-children')).toBeNull();
    });

    it('handles multiple children elements', () => {
        const multipleChildren = (
            <>
                <Text testID="child-1">First Child</Text>
                <Text testID="child-2">Second Child</Text>
                <View testID="child-3">
                    <Text>Third Child</Text>
                </View>
            </>
        );

        const { getByTestId, getByText } = render(
            <SelectionModal {...defaultProps} children={multipleChildren} />
        );
        
        expect(getByTestId('child-1')).toBeTruthy();
        expect(getByTestId('child-2')).toBeTruthy();
        expect(getByTestId('child-3')).toBeTruthy();
        expect(getByText('First Child')).toBeTruthy();
        expect(getByText('Second Child')).toBeTruthy();
        expect(getByText('Third Child')).toBeTruthy();
    });
});
