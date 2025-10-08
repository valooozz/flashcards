import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import { PaperProvider } from 'react-native-paper';
import { StatsDeckDialog } from '../StatsDeckDialog';

jest.mock('../../../hooks/useTranslation', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
    }),
}));

describe('StatsDeckDialog', () => {
    it('renders stats values and calls hideDialog on OK', () => {
        const hideDialog = jest.fn();

        const { getByText } = render(
            <PaperProvider>
                <StatsDeckDialog
                    visible={true}
                    hideDialog={hideDialog}
                    nbCardsLearnt={12}
                    nbCardsToLearn={8}
                    progress={0.34567}
                />
            </PaperProvider>
        );

        expect(getByText('common.stats')).toBeTruthy();
        expect(getByText('deck.cardsLearnt : 12')).toBeTruthy();
        expect(getByText('deck.cardsToLearn : 8')).toBeTruthy();
        expect(getByText('deck.progress : 34.57 %')).toBeTruthy();

        fireEvent.press(getByText('common.ok'));
        expect(hideDialog).toHaveBeenCalled();
    });
});


