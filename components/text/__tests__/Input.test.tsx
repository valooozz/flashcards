import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Input } from '../Input';
import { TextInput } from 'react-native';

describe('Input', () => {
    it('renders with provided text value', () => {
        const { getByDisplayValue } = render(
            <Input text="hello" setText={jest.fn()} />
        );
        expect(getByDisplayValue('hello')).toBeTruthy();
    });

    it('calls setText when text changes', () => {
        const setText = jest.fn();
        const { getByDisplayValue, rerender } = render(
            <Input text="" setText={setText} />
        );

        const input = getByDisplayValue('');
        fireEvent.changeText(input, 'new value');
        expect(setText).toHaveBeenCalledWith('new value');

        // ensure controlled value can update
        rerender(<Input text="new value" setText={setText} />);
        expect(getByDisplayValue('new value')).toBeTruthy();
    });

    it('uses numeric keyboard when numeric is true', () => {
        const { getByDisplayValue } = render(
            <Input text="123" setText={jest.fn()} numeric />
        );
        const input = getByDisplayValue('123');
        expect(input.props.keyboardType).toBe('numeric');
    });

    it('uses default keyboard when numeric is false or omitted', () => {
        const { getByDisplayValue, rerender } = render(
            <Input text="abc" setText={jest.fn()} numeric={false} />
        );
        let input = getByDisplayValue('abc');
        expect(input.props.keyboardType).toBe('default');

        rerender(<Input text="abc" setText={jest.fn()} />);
        input = getByDisplayValue('abc');
        expect(input.props.keyboardType).toBe('default');
    });

    it('applies underline style when underline is true', () => {
        const { getByDisplayValue } = render(
            <Input text="u" setText={jest.fn()} underline />
        );
        const input = getByDisplayValue('u');
        expect(input.props.style).toEqual(
            expect.objectContaining({ textDecorationLine: 'underline' })
        );
    });

    it('does not apply underline when underline is false or omitted', () => {
        const { getByDisplayValue, rerender } = render(
            <Input text="n" setText={jest.fn()} underline={false} />
        );
        let input = getByDisplayValue('n');
        expect(input.props.style).toEqual(
            expect.objectContaining({ textDecorationLine: 'none' })
        );

        rerender(<Input text="n" setText={jest.fn()} />);
        input = getByDisplayValue('n');
        expect(input.props.style).toEqual(
            expect.objectContaining({ textDecorationLine: 'none' })
        );
    });

    it('forwards ref via innerRef', () => {
        const ref = React.createRef<TextInput>();
        render(<Input text="x" setText={jest.fn()} innerRef={ref} />);
        expect(ref.current).toBeTruthy();
    });

    it('sets autoFocus prop', () => {
        const { getByDisplayValue, rerender } = render(
            <Input text="a" setText={jest.fn()} autofocus />
        );
        let input = getByDisplayValue('a');
        expect(input.props.autoFocus).toBe(true);

        rerender(<Input text="a" setText={jest.fn()} autofocus={false} />);
        input = getByDisplayValue('a');
        expect(input.props.autoFocus).toBe(false);
    });
});
