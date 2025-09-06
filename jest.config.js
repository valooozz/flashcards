module.exports = {
    preset: 'jest-expo',
    testMatch: [
        '<rootDir>/**/*.(test|spec).(ts|tsx|js|jsx)'
    ],
    setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
    testPathIgnorePatterns: ['/node_modules/'],
};
