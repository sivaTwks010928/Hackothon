import '@testing-library/jest-dom';

// Simple utility functions to test
const capitalizeFirstLetter = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const formatPhoneNumber = (phoneNumber) => {
  if (!phoneNumber) return '';
  // Simple format for phone numbers
  const cleaned = phoneNumber.replace(/\D/g, '');
  if (cleaned.length !== 10) return phoneNumber;
  return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
};

describe('Utility Functions', () => {
  test('capitalizeFirstLetter works correctly', () => {
    expect(capitalizeFirstLetter('hello')).toBe('Hello');
    expect(capitalizeFirstLetter('world')).toBe('World');
    expect(capitalizeFirstLetter('')).toBe('');
    expect(capitalizeFirstLetter(null)).toBe('');
  });

  test('formatPhoneNumber works correctly', () => {
    expect(formatPhoneNumber('1234567890')).toBe('(123) 456-7890');
    expect(formatPhoneNumber('123-456-7890')).toBe('(123) 456-7890');
    expect(formatPhoneNumber('(123) 456-7890')).toBe('(123) 456-7890');
    expect(formatPhoneNumber('')).toBe('');
    expect(formatPhoneNumber('12345')).toBe('12345'); // Not enough digits
  });
}); 