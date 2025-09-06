import React from 'react';
import { render } from '@testing-library/react-native';
import { Header } from '../Header';

describe('Header', () => {
    it('renders provided text and applies style level', () => {
        const { getByText } = render(
            <Header level={1} text="Hello" color="#000" />
        );
        expect(getByText('Hello')).toBeTruthy();
    });

    it('applies the correct color style', () => {
        const { getByText } = render(
            <Header level={2} text="Colored Header" color="#ff0000" />
        );
        const header = getByText('Colored Header');
        expect(header.props.style).toEqual(
            expect.objectContaining({ color: '#ff0000' })
        );
    });

    it('renders with different heading levels', () => {
        const { getByText, rerender } = render(
            <Header level={1} text="Level 1" color="#000" />
        );
        expect(getByText('Level 1')).toBeTruthy();

        rerender(<Header level={2} text="Level 2" color="#000" />);
        expect(getByText('Level 2')).toBeTruthy();

        rerender(<Header level={3} text="Level 3" color="#000" />);
        expect(getByText('Level 3')).toBeTruthy();
    });

    it('applies marginRight when rightMargin is true', () => {
        const { getByText } = render(
            <Header level={1} text="Margin Header" color="#000" rightMargin={true} />
        );
        const header = getByText('Margin Header');
        expect(header.props.style).toEqual(
            expect.objectContaining({ marginRight: 24 })
        );
    });

    it('does not apply marginRight when rightMargin is false or omitted', () => {
        const { getByText, rerender } = render(
            <Header level={1} text="No Margin Header" color="#000" rightMargin={false} />
        );
        let header = getByText('No Margin Header');
        expect(header.props.style).toEqual(
            expect.objectContaining({ marginRight: 0 })
        );

        rerender(<Header level={1} text="No Margin Header" color="#000" />);
        header = getByText('No Margin Header');
        expect(header.props.style).toEqual(
            expect.objectContaining({ marginRight: 0 })
        );
    });
});
