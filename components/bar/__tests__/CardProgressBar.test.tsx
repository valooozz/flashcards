import React from 'react';
import { render } from '@testing-library/react-native';
import { CardProgressBar } from '../CardProgressBar';

describe('CardProgressBar', () => {
    it('applies provided width and color', () => {
        const { getByTestId } = render(
            <CardProgressBar width={'50%'} color={'#123456'} />
        );
        const bar = getByTestId('card-progress-bar');
        expect(bar.props.style).toEqual(
            expect.objectContaining({ width: '50%', backgroundColor: '#123456' })
        );
    });

    it('rounds right corners when width is not 100%', () => {
        const { getByTestId } = render(
            <CardProgressBar width={'75%'} color={'#000'} />
        );
        const bar = getByTestId('card-progress-bar');
        expect(bar.props.style).toEqual(
            expect.objectContaining({ borderTopRightRadius: 10, borderBottomRightRadius: 10 })
        );
    });

    it('does not round right corners when width is 100%', () => {
        const { getByTestId } = render(
            <CardProgressBar width={'100%'} color={'#000'} />
        );
        const bar = getByTestId('card-progress-bar');
        expect(bar.props.style).toEqual(
            expect.objectContaining({ borderTopRightRadius: 0, borderBottomRightRadius: 0 })
        );
    });
});
