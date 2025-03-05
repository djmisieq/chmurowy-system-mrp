const nextJest = require('next/jest');

const createJestConfig = nextJest({
  // Ścieżka do katalogu Next.js
  dir: './'
});

// Konfiguracja Jest dostosowana do aplikacji Next.js
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/components/(.*)$': '<rootDir>/src/components/$1',
    '^@/app/(.*)$': '<rootDir>/src/app/$1'
  },
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/.next/']
};

module.exports = createJestConfig(customJestConfig);
