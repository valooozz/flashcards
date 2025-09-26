import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Alert } from 'react-native';
import { BackButton } from '../BackButton';
import { router } from 'expo-router';

jest.mock('expo-router', () => ({
    router: { back: jest.fn() },
}));

describe('BackButton', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    it('calls custom action when provided', () => {
        const action = jest.fn();
        const { getByTestId } = render(
            <BackButton color="#000" simpleAction={action} />
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

    it('shows confirmation dialog when saveAction is provided and triggers save on confirm', () => {
        const saveAction = jest.fn();
        const alertSpy = jest.spyOn(Alert, 'alert').mockImplementation(() => {});

        const { getByTestId } = render(<BackButton color="#000" saveAction={saveAction} />);
        fireEvent.press(getByTestId('back-button'));

        expect(alertSpy).toHaveBeenCalledTimes(1);
        const call = alertSpy.mock.calls[0];
        const buttons = call[2] as any[];
        // press "save and quit" (third button)
        buttons[2].onPress();
        expect(saveAction).toHaveBeenCalled();

        alertSpy.mockRestore();
    });

    it('confirmation dialog "quit" triggers router.back', () => {
        const saveAction = jest.fn();
        const alertSpy = jest.spyOn(Alert, 'alert').mockImplementation(() => {});

        const { getByTestId } = render(<BackButton color="#000" saveAction={saveAction} />);
        fireEvent.press(getByTestId('back-button'));

        const buttons = (alertSpy.mock.calls[0][2] as any[]);
        // press "quit" (second button)
        buttons[1].onPress();
        expect(router.back).toHaveBeenCalled();

        alertSpy.mockRestore();
    });

    it('pressing button with saveAction does not auto-navigate before choosing an option', () => {
        const saveAction = jest.fn();
        const alertSpy = jest.spyOn(Alert, 'alert').mockImplementation(() => {});

        const { getByTestId } = render(<BackButton color="#000" saveAction={saveAction} />);
        fireEvent.press(getByTestId('back-button'));

        expect(alertSpy).toHaveBeenCalled();
        expect(router.back).not.toHaveBeenCalled();
        expect(saveAction).not.toHaveBeenCalled();

        alertSpy.mockRestore();
    });
});
