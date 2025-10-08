import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import { PaperProvider } from 'react-native-paper';
import { TitleWithInfo } from '../TitleWithInfo';

jest.mock('../../../hooks/useTranslation', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
    }),
}));

describe('TitleWithInfo', () => {
    it('renders label and shows info dialog on info button press', () => {
        const { getByText, getByTestId, getAllByText } = render(
            <PaperProvider>
                <TitleWithInfo textLabel="Label" textExplanation="Explanation" />
            </PaperProvider>
        );

        // Label is displayed
        expect(getAllByText('Label')).toBeTruthy();

        // Info button is present and opens dialog
        fireEvent.press(getByTestId('checkbox-info-button'));
        expect(getAllByText('Label')).toBeTruthy();
        expect(getByText('Explanation')).toBeTruthy();
    });
});


