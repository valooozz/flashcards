import { render } from '@testing-library/react-native';
import React from 'react';
import { Text } from 'react-native';
import { Toolbar } from '../Toolbar';

describe('Toolbar', () => {
    it('renders children correctly', () => {
        const { queryByText } = render(
            <Toolbar>
                <Text>Test Content</Text>
            </Toolbar>
        );

        expect(queryByText('Test Content')).toBeTruthy();
    });

    it('applies rightButton style when childrenOnTheRight is true', () => {
        const { queryByText, getByTestId } = render(
            <Toolbar childrenOnTheRight={true}>
                <Text>Right Content</Text>
            </Toolbar>
        );

        expect(queryByText('Right Content')).toBeTruthy();

        const toolbarChildrenContainer = getByTestId('toolbar-children-container');
        expect(toolbarChildrenContainer.props.style).toEqual(
            expect.objectContaining({ marginLeft: 'auto' })
        );
    });

    it('does not apply rightButton style when childrenOnTheRight is false', () => {
        const { queryByTestId } = render(
            <Toolbar childrenOnTheRight={false}>
                <Text>Left Content</Text>
            </Toolbar>
        );

        expect(queryByTestId('toolbar-children-container')).toBeFalsy();
    });

    it('applies marginRight when addMarginRight is true', () => {
        const { getByTestId } = render(
            <Toolbar addMarginRight={true}>
                <Text>Test Content</Text>
            </Toolbar>
        );

        const toolbar = getByTestId('toolbar');
        expect(toolbar.props.style).toEqual(
            expect.objectContaining({ marginRight: 24 })
        );
    });

    it('does not apply marginRight when addMarginRight is false', () => {
        const { getByTestId } = render(
            <Toolbar addMarginRight={false}>
                <Text>Test Content</Text>
            </Toolbar>
        );

        const toolbar = getByTestId('toolbar');
        expect(toolbar.props.style).toEqual(
            expect.objectContaining({ marginRight: 0 })
        );
    });

    it('handles multiple children correctly', () => {
        const { queryByText } = render(
            <Toolbar>
                <Text>First Child</Text>
                <Text>Second Child</Text>
            </Toolbar>
        );

        expect(queryByText('First Child')).toBeTruthy();
        expect(queryByText('Second Child')).toBeTruthy();
    });

    it('combines addMarginRight and childrenOnTheRight correctly', () => {
        const { getByTestId } = render(
            <Toolbar addMarginRight={true} childrenOnTheRight={true}>
                <Text testID="test-content">Test Content</Text>
            </Toolbar>
        );

        const toolbar = getByTestId('toolbar');
        expect(toolbar.props.style).toEqual(
            expect.objectContaining({ marginRight: 24 })
        );

        const toolbarChildrenContainer = getByTestId('toolbar-children-container');
        expect(toolbarChildrenContainer.props.style).toEqual(
            expect.objectContaining({ marginLeft: 'auto' })
        );
    });
});
