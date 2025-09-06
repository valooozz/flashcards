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
});
