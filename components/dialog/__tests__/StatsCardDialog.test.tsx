import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import { PaperProvider } from 'react-native-paper';
import { StatsCardDialog } from '../StatsCardDialog';

jest.mock('../../../hooks/useTranslation', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
    }),
}));

jest.mock('../../../utils/getDelay.utils', () => ({
    getDelay: jest.fn(),
}));

jest.mock('../../../utils/formatDate.utils', () => ({
    formatDate: jest.fn((v: string) => v),
}));

import { formatDate } from '../../../utils/formatDate.utils';
import { getDelay } from '../../../utils/getDelay.utils';

describe('StatsCardDialog', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders not learnt when nextRevision is empty', () => {
        (getDelay as jest.Mock).mockReturnValue(0);

        const hideDialog = jest.fn();
        const { getByText, queryByText } = render(
            <PaperProvider>
                <StatsCardDialog visible={true} hideDialog={hideDialog} learningStep={0} nextRevision="" />
            </PaperProvider>
        );

        expect(getByText('common.info')).toBeTruthy();
        expect(queryByText('card.learningStep')).toBeFalsy();
        expect(getByText('card.notLearnt')).toBeTruthy();

        fireEvent.press(getByText('common.ok'));
        expect(hideDialog).toHaveBeenCalled();
    });

    it('renders learningStep + 1 when nextRevision is not empty', () => {
        (getDelay as jest.Mock).mockReturnValue(0);

        const hideDialog = jest.fn();
        const { getByText } = render(
            <PaperProvider>
                <StatsCardDialog visible={true} hideDialog={hideDialog} learningStep={3} nextRevision="2025-01-01" />
            </PaperProvider>
        );

        expect(getByText('common.info')).toBeTruthy();
        expect(getByText('card.learningStep : 4')).toBeTruthy();
    });

    it('renders overdue message when delay < 0', () => {
        (getDelay as jest.Mock).mockReturnValue(-3);
        (formatDate as jest.Mock).mockReturnValue('2025-01-01');

        const { getByText } = render(
            <PaperProvider>
                <StatsCardDialog visible={true} hideDialog={() => { }} learningStep={1} nextRevision="2025-01-01" />
            </PaperProvider>
        );

        expect(getByText('card.nextRevision : 2025-01-01 (3 common.dayAbbreviation)')).toBeTruthy();
    });

    it('renders future delay message with plural when delay > 1', () => {
        (getDelay as jest.Mock).mockReturnValue(2);

        const { getByText } = render(
            <PaperProvider>
                <StatsCardDialog visible={true} hideDialog={() => { }} learningStep={1} nextRevision="2025-01-03" />
            </PaperProvider>
        );

        expect(getByText('2 common.dayPlural card.delayInRevisions')).toBeTruthy();
    });

    it('renders future delay message with singular when delay === 1', () => {
        (getDelay as jest.Mock).mockReturnValue(1);

        const { getByText } = render(
            <PaperProvider>
                <StatsCardDialog visible={true} hideDialog={() => { }} learningStep={1} nextRevision="2025-01-02" />
            </PaperProvider>
        );

        expect(getByText('1 common.daySingular card.delayInRevisions')).toBeTruthy();
    });

    it('renders revise today when delay === 0 and nextRevision present', () => {
        (getDelay as jest.Mock).mockReturnValue(0);

        const { getByText } = render(
            <PaperProvider>
                <StatsCardDialog visible={true} hideDialog={() => { }} learningStep={1} nextRevision="2025-01-01" />
            </PaperProvider>
        );

        expect(getByText('card.reviseToday')).toBeTruthy();
    });
});


