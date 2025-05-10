// App component test

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../App';

// Mock the nested components
jest.mock('../components/PersonalInfoForm', () => {
  return function MockPersonalInfoForm(props) {
    return <div data-testid="personal-info-form">Personal Info Form</div>;
  };
});

jest.mock('../components/ThoughtworksExperienceForm', () => {
  return function MockTWExperienceForm(props) {
    return <div data-testid="tw-experience-form">ThoughtWorks Experience Form</div>;
  };
});

jest.mock('../components/OtherExperienceForm', () => {
  return function MockOtherExperienceForm(props) {
    return <div data-testid="other-experience-form">Other Experience Form</div>;
  };
});

jest.mock('../components/SkillsForm', () => {
  return function MockSkillsForm(props) {
    return <div data-testid="skills-form">Skills Form</div>;
  };
});

jest.mock('../components/ReviewForm', () => {
  return function MockReviewForm(props) {
    return <div data-testid="review-form">Review Form</div>;
  };
});

// Mock axios
jest.mock('axios', () => ({
  get: jest.fn(() => Promise.resolve({ data: {} })),
}));

describe('App Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders app title and stepper', () => {
    render(<App />);

    // Check title is rendered
    expect(screen.getByText('ThoughtWorks Resume Builder')).toBeInTheDocument();

    // Check that the stepper has all steps
    expect(screen.getByText('Personal Information')).toBeInTheDocument();
    expect(screen.getByText('ThoughtWorks Experience')).toBeInTheDocument();
    expect(screen.getByText('Other Experience')).toBeInTheDocument();
    expect(screen.getByText('Skills')).toBeInTheDocument();
    expect(screen.getByText('Review & Submit')).toBeInTheDocument();
  });

  test('shows PersonalInfoForm initially', () => {
    render(<App />);

    // Check that the personal info form is rendered first
    expect(screen.getByTestId('personal-info-form')).toBeInTheDocument();

    // Other forms should not be visible
    expect(screen.queryByTestId('tw-experience-form')).not.toBeInTheDocument();
    expect(screen.queryByTestId('other-experience-form')).not.toBeInTheDocument();
    expect(screen.queryByTestId('skills-form')).not.toBeInTheDocument();
    expect(screen.queryByTestId('review-form')).not.toBeInTheDocument();
  });

  test('navigation buttons work correctly', () => {
    render(<App />);

    // Next button moves to the next form
    const nextButton = screen.getByText('Next');
    fireEvent.click(nextButton);

    // Now ThoughtWorks Experience form should be visible
    expect(screen.getByTestId('tw-experience-form')).toBeInTheDocument();

    // PersonalInfoForm should no longer be visible
    expect(screen.queryByTestId('personal-info-form')).not.toBeInTheDocument();

    // Back button should go back to previous form
    const backButton = screen.getByText('Back');
    fireEvent.click(backButton);

    // Now we should be back to the personal info form
    expect(screen.getByTestId('personal-info-form')).toBeInTheDocument();
  });

  test('Load Sample Data button exists', () => {
    render(<App />);

    // Check that the sample data button exists
    expect(screen.getByText('Load Sample Data')).toBeInTheDocument();
  });
});
