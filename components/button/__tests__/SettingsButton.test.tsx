import React from 'react';
import { render } from '@testing-library/react-native';
import { fireEvent } from '@testing-library/react-native';
import { SettingsButton } from '../SettingsButton';
import { router } from 'expo-router';

jest.mock('expo-router', () => ({
    router: { push: jest.fn() },
}));

describe('SettingsButton', () => {
    it('navigates to provided route on press', () => {
        const { getByTestId } = render(
            <SettingsButton color="#000" route="/settings" />
        );
        fireEvent.press(getByTestId('settings-button'));
        expect(router.push).toHaveBeenCalledWith('/settings');
    });
});
