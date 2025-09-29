import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import { FlashDeckButton } from '../FlashDeckButton';

describe('FlashDeckButton', () => {
    it('calls onPress when pressed', () => {
        const onPress = jest.fn();
        const { getByTestId } = render(
            <FlashDeckButton color="#ff0" onPress={onPress} />
        );

        const touchable = getByTestId('flash-deck-button');
        fireEvent.press(touchable);
        expect(onPress).toHaveBeenCalled();
    });
});


