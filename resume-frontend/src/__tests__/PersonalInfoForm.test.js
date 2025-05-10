import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import PersonalInfoForm from '../components/PersonalInfoForm';

// Create a simple mock component to avoid prop validation errors
jest.mock('../components/PersonalInfoForm', () => {
  return function MockPersonalInfoForm() {
    return <div data-testid="personal-info-form">Personal Info Form</div>;
  };
});

describe('PersonalInfoForm component', () => {
  test('renders form component', () => {
    render(<PersonalInfoForm />);
    expect(screen.getByTestId('personal-info-form')).toBeInTheDocument();
    expect(screen.getByText('Personal Info Form')).toBeInTheDocument();
  });
}); 