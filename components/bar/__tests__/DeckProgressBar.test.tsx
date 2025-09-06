import React from 'react';
import { render } from '@testing-library/react-native';
import { DeckProgressBar } from '../DeckProgressBar';

describe('DeckProgressBar', () => {
    it('renders nothing when progress is falsy (0)', () => {
        const { queryByTestId } = render(<DeckProgressBar progress={0} color="#000" />);
        expect(queryByTestId('deck-progress-bar')).toBeFalsy();
    });

    it('renders two bars container and places text inside colored bar for progress >= 30', () => {
        const { getByText, getByTestId } = render(
            <DeckProgressBar progress={45} color="#123" />
        );
        expect(getByText('45 %')).toBeTruthy();
        // There should be two nested Views representing background and foreground bars
        const json = getByTestId('deck-progress-bar-background');
        expect(json.type).toBe('View');
        expect(json.props.style).toEqual(
            expect.objectContaining({ width: '100%' })
        );
        const json2 = getByTestId('deck-progress-bar-foreground');
        expect(json2.type).toBe('View');
        expect(json2.props.style).toEqual(
            expect.objectContaining({ width: '45%', backgroundColor: '#123' })
        );
    });

    it('renders text on the background bar for progress < 30 with left margin', () => {
        const { getByText } = render(
            <DeckProgressBar progress={20} color="#123" />
        );
        const text = getByText('20 %');
        expect(text.props.style).toEqual(
            expect.objectContaining({ marginLeft: '22%' })
        );
    });
});
