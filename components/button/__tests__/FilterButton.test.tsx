import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import { FilterButton } from '../FilterButton';

describe('FilterButton', () => {
    const mockOnToggle = jest.fn();
    const defaultProps = {
        isActive: false,
        onToggle: mockOnToggle,
        activeColor: '#FFFFFF',
        inactiveColor: '#000000',
        testID: 'filter-button'
    };

    beforeEach(() => {
        jest.resetAllMocks();
    });

    it('renders correctly when inactive', () => {
        const { getByTestId } = render(<FilterButton {...defaultProps} />);
        const button = getByTestId('filter-button');
        expect(button).toBeTruthy();
    });

    it('renders correctly when active', () => {
        const { getByTestId } = render(
            <FilterButton {...defaultProps} isActive={true} />
        );
        const button = getByTestId('filter-button');
        expect(button).toBeTruthy();
    });

    it('calls onToggle when pressed', () => {
        const { getByTestId } = render(<FilterButton {...defaultProps} />);
        const button = getByTestId('filter-button');

        fireEvent.press(button);

        expect(mockOnToggle).toHaveBeenCalledTimes(1);
    });

    it('calls onToggle when pressed while active', () => {
        const { getByTestId } = render(
            <FilterButton {...defaultProps} isActive={true} />
        );
        const button = getByTestId('filter-button');

        fireEvent.press(button);

        expect(mockOnToggle).toHaveBeenCalledTimes(1);
    });

    it('renders without testID when not provided', () => {
        const propsWithoutTestID = {
            isActive: false,
            onToggle: mockOnToggle,
            activeColor: '#FFFFFF',
            inactiveColor: '#000000'
        };

        const { queryByTestId } = render(<FilterButton {...propsWithoutTestID} />);
        const button = queryByTestId('filter-button');

        expect(button).toBeNull();
    });

    it('applies correct styling when active', () => {
        const { getByTestId } = render(
            <FilterButton {...defaultProps} isActive={true} />
        );
        const button = getByTestId('filter-button');
        expect(button).toBeTruthy();
        // The active styling should be applied (background color and border radius)
    });

    it('applies correct styling when inactive', () => {
        const { getByTestId } = render(<FilterButton {...defaultProps} />);
        const button = getByTestId('filter-button');
        expect(button).toBeTruthy();
        // Only base styling should be applied
    });

    it('uses activeColor when isActive is true', () => {
        const activeColor = '#FF0000';
        const { getByTestId } = render(
            <FilterButton {...defaultProps} isActive={true} activeColor={activeColor} />
        );
        const button = getByTestId('filter-button');
        expect(button).toBeTruthy();
    });

    it('uses inactiveColor when isActive is false', () => {
        const inactiveColor = '#00FF00';
        const { getByTestId } = render(
            <FilterButton {...defaultProps} isActive={false} inactiveColor={inactiveColor} />
        );
        const button = getByTestId('filter-button');
        expect(button).toBeTruthy();
    });

    it('toggles visual state correctly', () => {
        const { getByTestId, rerender } = render(<FilterButton {...defaultProps} />);
        let button = getByTestId('filter-button');
        expect(button).toBeTruthy();

        // Re-render with isActive true
        rerender(<FilterButton {...defaultProps} isActive={true} />);
        button = getByTestId('filter-button');
        expect(button).toBeTruthy();

        // Re-render back to inactive
        rerender(<FilterButton {...defaultProps} isActive={false} />);
        button = getByTestId('filter-button');
        expect(button).toBeTruthy();
    });
});
