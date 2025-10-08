import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import { PaperProvider } from 'react-native-paper';
import { ModalButton } from '../ModalButton';

describe('ModalButton', () => {
    it('renders label and calls onPress when pressed', () => {
        const onPress = jest.fn();
        const { getByText } = render(
            <PaperProvider>
                <ModalButton text="Confirm" variant="primary" onPress={onPress} />
            </PaperProvider>
        );

        const button = getByText('Confirm');
        expect(button).toBeTruthy();
        fireEvent.press(button);
        expect(onPress).toHaveBeenCalled();
    });

    it('calls onPressIn when pressed in', () => {
        const onPressIn = jest.fn();
        const { getByText } = render(
            <PaperProvider>
                <ModalButton text="Hold" variant="secondary" onPressIn={onPressIn} />
            </PaperProvider>
        );

        const button = getByText('Hold');
        fireEvent(button, 'pressIn');
        expect(onPressIn).toHaveBeenCalled();
    });
});


