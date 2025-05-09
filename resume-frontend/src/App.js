import React, { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import PersonalInfoForm from './components/PersonalInfoForm';
import ThoughtworksExperienceForm from './components/ThoughtworksExperienceForm';
import OtherExperienceForm from './components/OtherExperienceForm';
import SkillsForm from './components/SkillsForm';
import ReviewForm from './components/ReviewForm';
import axios from 'axios';

// Backend API URL from environment variables
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

const theme = createTheme({
  palette: {
    primary: {
      main: '#0F6A8B',
    },
    secondary: {
      main: '#E7332B',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
  },
});

const steps = [
  'Personal Information',
  'ThoughtWorks Experience',
  'Other Experience',
  'Skills',
  'Review & Submit',
];

function getStepContent(step, formData, setFormData, setActiveStep) {
  switch (step) {
    case 0:
      return <PersonalInfoForm formData={formData} setFormData={setFormData} />;
    case 1:
      return <ThoughtworksExperienceForm formData={formData} setFormData={setFormData} />;
    case 2:
      return <OtherExperienceForm formData={formData} setFormData={setFormData} />;
    case 3:
      return <SkillsForm formData={formData} setFormData={setFormData} />;
    case 4:
      return <ReviewForm formData={formData} setActiveStep={setActiveStep} />;
    default:
      return 'Unknown step';
  }
}

function App() {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    preferred_pronouns: '',
    role: '',
    summary: '',
    thoughtworks_experiences: [
      {
        title: '',
        duration: '',
        descriptions: [''],
        tech_stack: '',
      },
    ],
    other_experiences: [
      {
        title: '',
        duration: '',
        descriptions: [''],
        tech_stack: '',
      },
    ],
    skills: [
      {
        title: '',
        skills: '',
      },
    ],
  });

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
    setFormData({
      name: '',
      preferred_pronouns: '',
      role: '',
      summary: '',
      thoughtworks_experiences: [
        {
          title: '',
          duration: '',
          descriptions: [''],
          tech_stack: '',
        },
      ],
      other_experiences: [
        {
          title: '',
          duration: '',
          descriptions: [''],
          tech_stack: '',
        },
      ],
      skills: [
        {
          title: '',
          skills: '',
        },
      ],
    });
  };

  const loadSampleData = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/sample-data`);
      setFormData(response.data);
    } catch (err) {
      console.error('Error loading sample data:', err);
      alert('Failed to load sample data. Please ensure the backend server is running.');
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="App">
        <Container component="main" maxWidth="md">
          <Typography variant="h3" component="h1" align="center" gutterBottom sx={{ mt: 4 }} className="app-title">
            ThoughtWorks Resume Builder
          </Typography>
          
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
            <Button 
              variant="outlined" 
              color="primary" 
              onClick={loadSampleData}
              className="sample-data-btn"
            >
              Load Sample Data
            </Button>
          </Box>
          
          <Box className="stepper-container" sx={{ width: '100%', mb: 4 }}>
            <Stepper activeStep={activeStep} alternativeLabel>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>
          
          <Box className="form-container" sx={{ mt: 2, mb: 4 }}>
            {getStepContent(activeStep, formData, setFormData, setActiveStep)}
          </Box>
          
          <Box className="navigation-btns" sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
            <Button
              color="primary"
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{ mr: 1 }}
            >
              Back
            </Button>
            <Box sx={{ flex: '1 1 auto' }} />
            <Button
              variant="contained"
              color="primary"
              onClick={handleNext}
              disabled={activeStep === steps.length - 1}
            >
              {activeStep === steps.length - 2 ? 'Review' : 'Next'}
            </Button>
          </Box>
        </Container>
      </div>
    </ThemeProvider>
  );
}

export default App; 