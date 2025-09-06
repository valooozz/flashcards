import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { CheckboxWithText } from '../CheckboxWithText';

jest.mock('expo-checkbox', () => {
    const React = require('react');
    const { Pressable } = require('react-native');
    return ({ value, onValueChange, style }: any) => (
        <Pressable testID="checkbox" accessibilityRole="checkbox" style={style} onPress={() => onValueChange(!value)} />
    );
});

describe('CheckboxWithText', () => {
    it('renders the provided text label', () => {
        const { getByText } = render(
            <CheckboxWithText isChecked={false} setIsChecked={jest.fn()} textLabel="Label" />
        );
        expect(getByText('Label')).toBeTruthy();
    });

    it('calls setIsChecked when checkbox is pressed', () => {
        const setIsChecked = jest.fn();
        const { getByTestId } = render(
            <CheckboxWithText isChecked={false} setIsChecked={setIsChecked} textLabel="Click" />
        );
        const checkbox = getByTestId('checkbox');
        fireEvent.press(checkbox);
        expect(setIsChecked).toHaveBeenCalledWith(true);
    });

    it('passes marginTop when spaceTop is true to checkbox and text', () => {
        const { getByTestId, getByText } = render(
            <CheckboxWithText isChecked={false} setIsChecked={jest.fn()} textLabel="Top" spaceTop />
        );
        const checkbox = getByTestId('checkbox');
        const text = getByText('Top');
        expect(checkbox.props.style).toEqual(expect.objectContaining({ marginTop: 16 }));
        expect(text.props.style).toEqual(expect.objectContaining({ marginTop: 16 }));
    });

    it('uses marginTop 0 when spaceTop is false or omitted', () => {
        const { getByTestId, getByText, rerender } = render(
            <CheckboxWithText isChecked={false} setIsChecked={jest.fn()} textLabel="NoTop" spaceTop={false} />
        );
        let checkbox = getByTestId('checkbox');
        let text = getByText('NoTop');
        expect(checkbox.props.style).toEqual(expect.objectContaining({ marginTop: 0 }));
        expect(text.props.style).toEqual(expect.objectContaining({ marginTop: 0 }));

        rerender(<CheckboxWithText isChecked={false} setIsChecked={jest.fn()} textLabel="NoTop" />);
        checkbox = getByTestId('checkbox');
        text = getByText('NoTop');
        expect(checkbox.props.style).toEqual(expect.objectContaining({ marginTop: 0 }));
        expect(text.props.style).toEqual(expect.objectContaining({ marginTop: 0 }));
    });
});
