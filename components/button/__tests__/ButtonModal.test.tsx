import React from 'react';
import { render } from '@testing-library/react-native';
import { fireEvent } from '@testing-library/react-native';
import { ButtonModal } from '../ButtonModal';

describe('ButtonModal', () => {
    it('renders text and handles press', () => {
        const onPress = jest.fn();
        const { getByText, getByTestId } = render(
            <ButtonModal text="Confirm" onPress={onPress} />
        );
        expect(getByText('Confirm')).toBeTruthy();
        fireEvent.press(getByTestId('button-modal'));
        expect(onPress).toHaveBeenCalled();
    });
});
