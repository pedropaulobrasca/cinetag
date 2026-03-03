/** @type {import('jest').Config} */
const config = {
  preset: 'ts-jest',
  testEnvironment: 'jest-environment-jsdom',
  rootDir: '.',
  testMatch: ['**/src/**/*.spec.tsx', '**/src/**/*.spec.ts'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|svg)$': '<rootDir>/src/__mocks__/fileMock.ts',
    '^.*/lib/api$': '<rootDir>/src/__mocks__/api.ts',
    '^.*/lib/tmdb$': '<rootDir>/src/__mocks__/tmdb.ts',
  },
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', { tsconfig: { jsx: 'react-jsx', esModuleInterop: true } }],
  },
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
};

module.exports = config;
