import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import { PaperProvider } from 'react-native-paper';
import { InfoButton } from '../InfoButton';

describe('InfoButton', () => {
    it('opens dialog and shows provided title and text on press', () => {
        const { getByTestId, getByText } = render(
            <PaperProvider>
                <InfoButton textLabel="My Label" textExplanation="My explanation" />
            </PaperProvider>
        );

        fireEvent.press(getByTestId('checkbox-info-button'));

        expect(getByText('My Label')).toBeTruthy();
        expect(getByText('My explanation')).toBeTruthy();
    });
});
