// API Test file

import { getApiEndpoint } from '../utils/api';
import '@testing-library/jest-dom';

describe('API Utility Functions', () => {
  test('getApiEndpoint handles path formatting correctly', () => {
    // Test that paths with or without leading slashes are handled the same way
    const withSlash = getApiEndpoint('/sample-data');
    const withoutSlash = getApiEndpoint('sample-data');

    // They should produce identical results
    expect(withSlash).toEqual(withoutSlash);

    // Both should end with the path
    expect(withSlash.endsWith('sample-data')).toBe(true);

    // Both should include /api/ in the URL
    expect(withSlash.includes('/api/')).toBe(true);
  });

  test('getApiEndpoint handles nested paths correctly', () => {
    const result = getApiEndpoint('nested/path');

    // Should include the nested path
    expect(result.endsWith('nested/path')).toBe(true);

    // Should include /api/ in the URL
    expect(result.includes('/api/')).toBe(true);
  });

  test('getApiEndpoint returns a valid URL', () => {
    const result = getApiEndpoint('sample-data');

    // Should be a valid URL
    expect(() => new URL(result)).not.toThrow();

    // By default should use localhost
    expect(result.includes('localhost') || result.includes('127.0.0.1')).toBe(true);
  });
});
