import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import { PaperProvider } from 'react-native-paper';
import { LanguagePickerModal } from '../LanguagePickerModal';

describe('LanguagePickerModal', () => {
    it('renders title and triggers onSelect for English', () => {
        const onSelect = jest.fn();
        const { getByText } = render(
            <PaperProvider>
                <LanguagePickerModal visible={true} onSelect={onSelect} />
            </PaperProvider>
        );

        expect(getByText('Choose your language / Choisis ta langue')).toBeTruthy();

        fireEvent.press(getByText('English'));
        expect(onSelect).toHaveBeenCalledWith('en');
    });

    it('triggers onSelect for French', () => {
        const onSelect = jest.fn();
        const { getByText } = render(
            <PaperProvider>
                <LanguagePickerModal visible={true} onSelect={onSelect} />
            </PaperProvider>
        );

        fireEvent.press(getByText('Français'));
        expect(onSelect).toHaveBeenCalledWith('fr');
    });
});


