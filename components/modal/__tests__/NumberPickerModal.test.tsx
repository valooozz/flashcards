import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import { PaperProvider } from 'react-native-paper';
import { NumberPickerModal } from '../NumberPickerModal';

describe('NumberPickerModal', () => {
    const items = [1, 2, 3, 4, 5];

    it('renders with default title and shows items when visible', () => {
        const onSelect = jest.fn();
        const onClose = jest.fn();

        const { getByText } = render(
            <PaperProvider>
                <NumberPickerModal
                    visible={true}
                    items={items}
                    selectedItem={3}
                    onSelect={onSelect}
                    onClose={onClose}
                />
            </PaperProvider>
        );

        // Default title
        expect(getByText('Select Number')).toBeTruthy();

        // Items rendered
        expect(getByText('1')).toBeTruthy();
        expect(getByText('5')).toBeTruthy();
    });

    it('uses custom title and calls onSelect and onClose when an item is pressed', () => {
        const onSelect = jest.fn();
        const onClose = jest.fn();

        const { getByText } = render(
            <PaperProvider>
                <NumberPickerModal
                    visible={true}
                    title="Pick a number"
                    items={items}
                    selectedItem={2}
                    onSelect={onSelect}
                    onClose={onClose}
                />
            </PaperProvider>
        );

        expect(getByText('Pick a number')).toBeTruthy();

        fireEvent.press(getByText('4'));
        expect(onSelect).toHaveBeenCalledWith(4);
        expect(onClose).toHaveBeenCalled();
    });
});


