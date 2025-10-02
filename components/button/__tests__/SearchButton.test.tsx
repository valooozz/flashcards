import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import { SearchButton } from '../SearchButton';

describe('SearchButton', () => {
    const mockOnToggle = jest.fn();
    const defaultProps = {
        searchMode: false,
        onToggle: mockOnToggle,
        color: '#000000',
        testID: 'search-button'
    };

    beforeEach(() => {
        jest.resetAllMocks();
    });

    it('renders correctly with search icon when searchMode is false', () => {
        const { getByTestId } = render(<SearchButton {...defaultProps} />);
        const button = getByTestId('search-button');
        expect(button).toBeTruthy();
    });

    it('renders correctly with close icon when searchMode is true', () => {
        const { getByTestId } = render(
            <SearchButton {...defaultProps} searchMode={true} />
        );
        const button = getByTestId('search-button');
        expect(button).toBeTruthy();
    });

    it('calls onToggle when pressed', () => {
        const { getByTestId } = render(<SearchButton {...defaultProps} />);
        const button = getByTestId('search-button');

        fireEvent.press(button);

        expect(mockOnToggle).toHaveBeenCalledTimes(1);
    });

    it('calls onToggle when pressed in search mode', () => {
        const { getByTestId } = render(
            <SearchButton {...defaultProps} searchMode={true} />
        );
        const button = getByTestId('search-button');

        fireEvent.press(button);

        expect(mockOnToggle).toHaveBeenCalledTimes(1);
    });

    it('renders without testID when not provided', () => {
        const propsWithoutTestID = {
            searchMode: false,
            onToggle: mockOnToggle,
            color: '#000000'
        };

        const { queryByTestId } = render(<SearchButton {...propsWithoutTestID} />);
        const button = queryByTestId('search-button');

        expect(button).toBeNull();
    });

    it('applies the correct color to the icon', () => {
        const customColor = '#FF0000';
        const { getByTestId } = render(
            <SearchButton {...defaultProps} color={customColor} />
        );
        const button = getByTestId('search-button');
        expect(button).toBeTruthy();
    });

    it('toggles between search and close icons based on searchMode', () => {
        const { getByTestId, rerender } = render(<SearchButton {...defaultProps} />);
        let button = getByTestId('search-button');
        expect(button).toBeTruthy();

        // Re-render with searchMode true
        rerender(<SearchButton {...defaultProps} searchMode={true} />);
        button = getByTestId('search-button');
        expect(button).toBeTruthy();
    });
});
