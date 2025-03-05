// Import biblioteki rozszerzającej możliwości testowe
import '@testing-library/jest-dom';

// Mock dla 'next/navigation'
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}));

// Mock dla 'axios'
jest.mock('axios');

// Wyciszenie ostrzeżeń konsoli podczas testów
console.error = jest.fn();
