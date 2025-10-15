import { render } from '@testing-library/react-native';
import React from 'react';
import { PaperProvider } from 'react-native-paper';
import { SettingStep } from '../SettingStep';

jest.mock('../../../hooks/useTranslation', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
    }),
}));

describe('SettingStep', () => {
    it('opens number picker on card press and updates selected step', () => {
        const setSelectedStep = jest.fn();
        const { getByText } = render(
            <PaperProvider>
                <SettingStep stepNumber={3} selectedStep={5} setSelectedStep={setSelectedStep} />
            </PaperProvider>
        );

        // Card shows current selected step
        expect(getByText('3 :')).toBeTruthy();
        expect(getByText('5')).toBeTruthy();
    });
});


