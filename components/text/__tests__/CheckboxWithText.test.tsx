import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import { Alert } from 'react-native';
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

    it('applies container marginTop 16 when spaceTop is true', () => {
        const { toJSON } = render(
            <CheckboxWithText isChecked={false} setIsChecked={jest.fn()} textLabel="Top" spaceTop />
        );
        const tree: any = toJSON();
        expect(tree.props.style).toEqual(expect.objectContaining({ marginTop: 16 }));
    });

    it('applies container marginTop 0 when spaceTop is false or omitted', () => {
        const { toJSON, rerender } = render(
            <CheckboxWithText isChecked={false} setIsChecked={jest.fn()} textLabel="NoTop" spaceTop={false} />
        );
        let tree: any = toJSON();
        expect(tree.props.style).toEqual(expect.objectContaining({ marginTop: 0 }));

        rerender(
            <CheckboxWithText isChecked={false} setIsChecked={jest.fn()} textLabel="NoTop" />
        );
        tree = toJSON();
        expect(tree.props.style).toEqual(expect.objectContaining({ marginTop: 0 }));
    });

    it('renders info button when textExplanation is provided', () => {
        const { getByTestId } = render(
            <CheckboxWithText
                isChecked={false}
                setIsChecked={jest.fn()}
                textLabel="HasInfo"
                textExplanation="Some details"
            />
        );
        expect(getByTestId('checkbox-info-button')).toBeTruthy();
    });

    it('does not render info button when textExplanation is not provided', () => {
        const { queryByTestId } = render(
            <CheckboxWithText isChecked={false} setIsChecked={jest.fn()} textLabel="NoInfo" />
        );
        expect(queryByTestId('checkbox-info-button')).toBeNull();
    });

    it('triggers alert when info button is pressed', () => {
        jest.spyOn(Alert, 'alert').mockImplementation(jest.fn());
        const { getByTestId } = render(
            <CheckboxWithText
                isChecked={false}
                setIsChecked={jest.fn()}
                textLabel="Info Title"
                textExplanation="Info text"
            />
        );
        fireEvent.press(getByTestId('checkbox-info-button'));
        expect(Alert.alert).toHaveBeenCalledWith('Info Title', 'Info text');
    });
});
