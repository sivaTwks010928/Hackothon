import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../App';

// Mock axios to prevent API calls during tests
jest.mock('axios', () => ({
  get: jest.fn(() => Promise.resolve({ data: {} })),
  post: jest.fn(() => Promise.resolve({ data: {} })),
}));

// Basic mock for window.alert
window.alert = jest.fn();

describe('App component', () => {
  test('renders without crashing', () => {
    // This test just ensures App renders without throwing an error
    // Using { fallback: null } to avoid any potential rendering issues
    render(<App />);
  });
}); 