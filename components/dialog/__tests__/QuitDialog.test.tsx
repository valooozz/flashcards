import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import { PaperProvider } from 'react-native-paper';
import { QuitDialog } from '../QuitDialog';

jest.mock('../../../hooks/useTranslation', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
    }),
}));

const mockBack = jest.fn();
jest.mock('expo-router', () => ({
    router: {
        back: () => mockBack(),
    },
}));

describe('QuitDialog', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders title and message when visible', () => {
        const hideDialog = jest.fn();
        const saveAction = jest.fn();

        const { getByText } = render(
            <PaperProvider>
                <QuitDialog visible={true} hideDialog={hideDialog} saveAction={saveAction} />
            </PaperProvider>
        );

        expect(getByText('dialog.leave')).toBeTruthy();
        expect(getByText('dialog.notSaved')).toBeTruthy();
    });

    it('calls hideDialog when No Quit is pressed', () => {
        const hideDialog = jest.fn();
        const saveAction = jest.fn();

        const { getByText } = render(
            <PaperProvider>
                <QuitDialog visible={true} hideDialog={hideDialog} saveAction={saveAction} />
            </PaperProvider>
        );

        fireEvent.press(getByText('dialog.noQuit'));
        expect(hideDialog).toHaveBeenCalled();
        expect(mockBack).not.toHaveBeenCalled();
        expect(saveAction).not.toHaveBeenCalled();
    });

    it('calls router.back and hideDialog when Quit is pressed', () => {
        const hideDialog = jest.fn();
        const saveAction = jest.fn();

        const { getByText } = render(
            <PaperProvider>
                <QuitDialog visible={true} hideDialog={hideDialog} saveAction={saveAction} />
            </PaperProvider>
        );

        fireEvent.press(getByText('dialog.quit'));
        expect(mockBack).toHaveBeenCalled();
        expect(hideDialog).toHaveBeenCalled();
        expect(saveAction).not.toHaveBeenCalled();
    });

    it('calls saveAction and hideDialog when Save and Quit is pressed', () => {
        const hideDialog = jest.fn();
        const saveAction = jest.fn();

        const { getByText } = render(
            <PaperProvider>
                <QuitDialog visible={true} hideDialog={hideDialog} saveAction={saveAction} />
            </PaperProvider>
        );

        fireEvent.press(getByText('dialog.saveAndQuit'));
        expect(saveAction).toHaveBeenCalled();
        expect(hideDialog).toHaveBeenCalled();
        expect(mockBack).not.toHaveBeenCalled();
    });
});


