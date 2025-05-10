import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../App';

// Mock all the components for simplified testing
jest.mock('../components/PersonalInfoForm', () => {
  return function MockPersonalInfoForm({ formData, setFormData }) {
    const updateName = () => {
      setFormData({ ...formData, name: 'John Doe' });
    };

    return (
      <div data-testid="personal-info-form">
        Personal Info Form
        <button onClick={updateName}>Set Name</button>
        <div data-testid="name-display">{formData.name}</div>
      </div>
    );
  };
});

jest.mock('../components/ThoughtworksExperienceForm', () => {
  return function MockTWExperienceForm({ formData, setFormData }) {
    const updateExperience = () => {
      setFormData({
        ...formData,
        thoughtworks_experiences: [
          {
            title: 'Software Developer',
            duration: '2022-2024',
            descriptions: ['Built awesome software'],
            tech_stack: 'React, Node.js',
          },
        ],
      });
    };

    return (
      <div data-testid="tw-experience-form">
        TW Experience Form
        <button onClick={updateExperience}>Add Experience</button>
      </div>
    );
  };
});

jest.mock('../components/OtherExperienceForm', () => {
  return function MockOtherExperienceForm({ formData, setFormData }) {
    const updateExperience = () => {
      setFormData({
        ...formData,
        other_experiences: [
          {
            title: 'Previous Role',
            duration: '2020-2022',
            descriptions: ['Did great work'],
            tech_stack: 'Python, Django',
          },
        ],
      });
    };

    return (
      <div data-testid="other-experience-form">
        Other Experience Form
        <button onClick={updateExperience}>Add Experience</button>
      </div>
    );
  };
});

jest.mock('../components/SkillsForm', () => {
  return function MockSkillsForm({ formData, setFormData }) {
    const updateSkills = () => {
      setFormData({
        ...formData,
        skills: [
          {
            title: 'Programming Languages',
            skills: 'JavaScript, Python, Java',
          },
        ],
      });
    };

    return (
      <div data-testid="skills-form">
        Skills Form
        <button onClick={updateSkills}>Add Skills</button>
      </div>
    );
  };
});

jest.mock('../components/ReviewForm', () => {
  return function MockReviewForm({ formData, setActiveStep }) {
    return (
      <div data-testid="review-form">
        Review Form
        <div data-testid="form-data-display">{JSON.stringify(formData)}</div>
        <button data-testid="preview-button">Preview Resume</button>
        <button data-testid="download-button">Download PDF</button>
      </div>
    );
  };
});

// Sample data for mocking API responses
const sampleData = {
  name: 'Sample User',
  preferred_pronouns: 'They/Them',
  role: 'Sample Role',
  summary: 'Sample summary',
  thoughtworks_experiences: [
    {
      title: 'Sample TW Experience',
      duration: '2022-2024',
      descriptions: ['Sample work'],
      tech_stack: 'Sample tech',
    },
  ],
  other_experiences: [
    {
      title: 'Sample Other Experience',
      duration: '2020-2022',
      descriptions: ['Sample work'],
      tech_stack: 'Sample tech',
    },
  ],
  skills: [
    {
      title: 'Sample Skill Category',
      skills: 'Sample skills',
    },
  ],
};

// Mock axios - use actual module export structure
jest.mock('axios', () => ({
  get: jest.fn(() => Promise.resolve({ data: sampleData })),
  post: jest.fn(() =>
    Promise.resolve({
      status: 200,
      data: new Blob(['fake pdf content'], { type: 'application/pdf' }),
    })
  ),
  isCancel: jest.fn(),
  CancelToken: {
    source: jest.fn(),
  },
}));

// Mock the API utility
jest.mock('../utils/api', () => ({
  getApiEndpoint: jest.fn(path => `http://test-api/api/${path}`),
}));

// Mock URL.createObjectURL
window.URL.createObjectURL = jest.fn(() => 'mock-pdf-url');

// Mock window.alert to prevent errors
window.alert = jest.fn();

describe('Resume Builder Integration Flow', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Complete form flow from personal info to review', async () => {
    render(<App />);

    // Step 1: Personal Info
    expect(screen.getByTestId('personal-info-form')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Set Name'));
    fireEvent.click(screen.getByText('Next'));

    // Step 2: TW Experience
    expect(screen.getByTestId('tw-experience-form')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Add Experience'));
    fireEvent.click(screen.getByText('Next'));

    // Step 3: Other Experience
    expect(screen.getByTestId('other-experience-form')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Add Experience'));
    fireEvent.click(screen.getByText('Next'));

    // Step 4: Skills
    expect(screen.getByTestId('skills-form')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Add Skills'));
    fireEvent.click(screen.getByText('Review'));

    // Step 5: Review - verify all data is present
    expect(screen.getByTestId('review-form')).toBeInTheDocument();

    const formDataDisplay = screen.getByTestId('form-data-display').textContent;
    const formData = JSON.parse(formDataDisplay);

    // Check that data from all steps is present
    expect(formData.name).toBe('John Doe');
    expect(formData.thoughtworks_experiences[0].title).toBe('Software Developer');
    expect(formData.other_experiences[0].title).toBe('Previous Role');
    expect(formData.skills[0].title).toBe('Programming Languages');
  });

  test('Load Sample Data functionality', async () => {
    // Import the real axios to mock it properly
    const axios = require('axios');

    // Set up axios mock to return our sample data
    axios.get.mockResolvedValueOnce({ data: sampleData });

    render(<App />);

    // Click the Load Sample Data button
    await act(async () => {
      fireEvent.click(screen.getByText('Load Sample Data'));
    });

    // Wait for axios to be called
    expect(axios.get).toHaveBeenCalled();

    // Verify the data was loaded into the form without navigating
    // by checking the name display in the personal info form
    await waitFor(() => {
      // Navigate to review to see the data in the display element
      fireEvent.click(screen.getByText('Next')); // To TW Experience
      fireEvent.click(screen.getByText('Next')); // To Other Experience
      fireEvent.click(screen.getByText('Next')); // To Skills
      fireEvent.click(screen.getByText('Review')); // To Review

      const formDataDisplay = screen.getByTestId('form-data-display').textContent;
      const formData = JSON.parse(formDataDisplay);

      // Verify sample data is present in form data
      expect(formData.name).toBe('Sample User');
      expect(formData.role).toBe('Sample Role');
      expect(formData.thoughtworks_experiences[0].title).toBe('Sample TW Experience');
    });
  });
});
