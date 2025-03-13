/**
 * Konfiguracja środowiska testowego
 * 
 * Ten plik jest automatycznie ładowany przez Jest przed każdym testem.
 */

// Dodanie rozszerzeń do testowania komponentów React
import '@testing-library/jest-dom';

// Mock dla funkcji IntersectionObserver (używanej przez niektóre komponenty UI)
class MockIntersectionObserver {
  readonly root: Element | null;
  readonly rootMargin: string;
  readonly thresholds: ReadonlyArray<number>;
  
  constructor() {
    this.root = null;
    this.rootMargin = '';
    this.thresholds = [];
  }
  
  disconnect() {
    return null;
  }
  
  observe() {
    return null;
  }
  
  takeRecords() {
    return [];
  }
  
  unobserve() {
    return null;
  }
}

global.IntersectionObserver = MockIntersectionObserver;

// Mock dla funkcji localStorage (używanej w aplikacji)
const localStorageMock = (function() {
  let store: Record<string, string> = {};
  
  return {
    getItem(key: string) {
      return store[key] || null;
    },
    setItem(key: string, value: string) {
      store[key] = value.toString();
    },
    removeItem(key: string) {
      delete store[key];
    },
    clear() {
      store = {};
    }
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

// Mock dla funkcji ResizeObserver (używanej przez niektóre komponenty UI)
class MockResizeObserver {
  constructor(callback: ResizeObserverCallback) {
    // Do nothing
  }
  
  disconnect() {
    return null;
  }
  
  observe() {
    return null;
  }
  
  unobserve() {
    return null;
  }
}

global.ResizeObserver = MockResizeObserver as any;

// Dodanie globalnego mocka dla react-use (używane w niektórych komponentach)
jest.mock('react-use', () => {
  const originalModule = jest.requireActual('react-use');
  
  return {
    ...originalModule,
    // Przykład mocka dla useMedia
    useMedia: jest.fn().mockReturnValue(true),
    // Dodaj więcej mocków jeśli będą potrzebne
  };
});

// Wyciszenie ostrzeżeń konsoli podczas testów
// (przydatne aby zredukować szum w konsoli podczas uruchamiania testów)
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

console.error = (...args: any[]) => {
  if (
    /Warning: ReactDOM.render is no longer supported in React 18/.test(args[0]) ||
    /Warning: Function components cannot be given refs/.test(args[0]) ||
    /Warning: validateDOMNesting/.test(args[0])
  ) {
    return;
  }
  originalConsoleError(...args);
};

console.warn = (...args: any[]) => {
  if (
    /Warning: React does not recognize the/.test(args[0]) ||
    /Warning: The tag <.*> is unrecognized in this browser/.test(args[0])
  ) {
    return;
  }
  originalConsoleWarn(...args);
};

afterAll(() => {
  console.error = originalConsoleError;
  console.warn = originalConsoleWarn;
});
