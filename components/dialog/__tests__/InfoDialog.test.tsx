import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import { PaperProvider } from 'react-native-paper';
import { InfoDialog } from '../InfoDialog';

jest.mock('../../../hooks/useTranslation', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
    }),
}));

describe('InfoDialog', () => {
    it('renders title and text when visible', () => {
        const hideDialog = jest.fn();
        const { getByText } = render(
            <PaperProvider>
                <InfoDialog visible={true} hideDialog={hideDialog} title="Hello" text="World" />
            </PaperProvider>
        );

        expect(getByText('Hello')).toBeTruthy();
        expect(getByText('World')).toBeTruthy();
    });

    it('calls hideDialog when OK is pressed', () => {
        const hideDialog = jest.fn();
        const { getByText } = render(
            <PaperProvider>
                <InfoDialog visible={true} hideDialog={hideDialog} title="Title" text="Body" />
            </PaperProvider>
        );

        fireEvent.press(getByText('common.ok'));
        expect(hideDialog).toHaveBeenCalled();
    });
});


