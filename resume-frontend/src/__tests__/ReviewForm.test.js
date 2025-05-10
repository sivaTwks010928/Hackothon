// ReviewForm test file

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ReviewForm from '../components/ReviewForm';

// Mock axios
jest.mock('axios', () => ({
  post: jest.fn(),
}));

// Mock the API utility function
jest.mock('../utils/api', () => ({
  getApiEndpoint: jest.fn(path => `http://mock-api/api/${path}`),
}));

// Mock URL.createObjectURL
window.URL.createObjectURL = jest.fn(() => 'mock-pdf-url');

describe('ReviewForm Component', () => {
  // Sample form data for testing
  const mockFormData = {
    name: 'Test User',
    preferred_pronouns: 'They/Them',
    role: 'Software Developer',
    summary: 'Test summary',
    thoughtworks_experiences: [
      {
        title: 'Test TW Job',
        duration: '2023-2024',
        descriptions: ['Test description'],
        tech_stack: 'React, Node.js',
      },
    ],
    other_experiences: [
      {
        title: 'Test Other Job',
        duration: '2021-2023',
        descriptions: ['Test description'],
        tech_stack: 'Python, Django',
      },
    ],
    skills: [{ title: 'Languages', skills: 'JavaScript, Python' }],
  };

  // Mock setActiveStep function
  const mockSetActiveStep = jest.fn();

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
  });

  test('renders review form with all sections', () => {
    render(<ReviewForm formData={mockFormData} setActiveStep={mockSetActiveStep} />);

    // Check that all sections are rendered
    expect(screen.getByText('Personal Information')).toBeInTheDocument();
    expect(screen.getByText('ThoughtWorks Experience')).toBeInTheDocument();
    expect(screen.getByText('Other Experience')).toBeInTheDocument();
    expect(screen.getByText('Skills')).toBeInTheDocument();

    // Check that the preview and download buttons are rendered
    expect(screen.getByText('Preview Resume')).toBeInTheDocument();
    expect(screen.getByText('Download PDF')).toBeInTheDocument();
  });

  test('displays form data correctly', () => {
    render(<ReviewForm formData={mockFormData} setActiveStep={mockSetActiveStep} />);

    // Check personal info
    expect(screen.getByText('Test User')).toBeInTheDocument();
    expect(screen.getByText('They/Them')).toBeInTheDocument();
    expect(screen.getByText('Software Developer')).toBeInTheDocument();
    expect(screen.getByText('Test summary')).toBeInTheDocument();

    // Check experiences
    expect(screen.getByText('Test TW Job')).toBeInTheDocument();
    expect(screen.getByText('Test Other Job')).toBeInTheDocument();
  });

  test('navigates to correct section when Edit button is clicked', () => {
    render(<ReviewForm formData={mockFormData} setActiveStep={mockSetActiveStep} />);

    // Click on the first Edit button (Personal Information)
    const editButtons = screen.getAllByText('Edit');
    fireEvent.click(editButtons[0]);

    // Check that setActiveStep was called with the correct index
    expect(mockSetActiveStep).toHaveBeenCalledWith(0);

    // Click on the second Edit button (TW Experience)
    fireEvent.click(editButtons[1]);
    expect(mockSetActiveStep).toHaveBeenCalledWith(1);
  });
});
