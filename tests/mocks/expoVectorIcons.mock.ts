// Mock Expo vector icon components to avoid loading fonts in test environment
jest.mock('@expo/vector-icons/AntDesign', () => {
    const React = require('react');
    return ({ name, size, color }: any) => null;
});

jest.mock('@expo/vector-icons/MaterialIcons', () => {
    const React = require('react');
    return ({ name, size, color }: any) => null;
});

jest.mock('@expo/vector-icons/MaterialCommunityIcons', () => {
    const React = require('react');
    return ({ name, size, color }: any) => null;
});
