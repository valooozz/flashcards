import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { AddButton } from '../AddButton';

describe('AddButton', () => {
    it('calls onPress when pressed', () => {
        const onPress = jest.fn();
        const { getByTestId } = render(
            <AddButton icon="pluscircle" size={24} color="#000" onPress={onPress} />
        );

        const touchable = getByTestId('add-button');
        fireEvent.press(touchable);
        expect(onPress).toHaveBeenCalled();
    });
});
