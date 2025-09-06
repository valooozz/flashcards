import React from 'react';
import { render } from '@testing-library/react-native';
import { fireEvent } from '@testing-library/react-native';
import { BackButton } from '../BackButton';
import { router } from 'expo-router';

jest.mock('expo-router', () => ({
    router: { back: jest.fn() },
}));

describe('BackButton', () => {
    it('calls custom action when provided', () => {
        const action = jest.fn();
        const { getByTestId } = render(
            <BackButton color="#000" action={action} />
        );
        const touchable = getByTestId('back-button');
        fireEvent.press(touchable);
        expect(action).toHaveBeenCalled();
    });

    it('falls back to router.back when no action provided', () => {
        const { getByTestId } = render(<BackButton color="#000" />);
        const btn = getByTestId('back-button');
        fireEvent.press(btn);
        expect(router.back).toHaveBeenCalled();
    });
});
