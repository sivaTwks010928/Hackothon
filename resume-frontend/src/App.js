import React, { useState, useEffect } from 'react';
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
import CircularProgress from '@mui/material/CircularProgress';
import Modal from '@mui/material/Modal';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import InfoIcon from '@mui/icons-material/Info';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import Joyride, { STATUS } from 'react-joyride';

// Backend API URL
const API_URL = 'http://localhost:5001';

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

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90%',
  maxWidth: '1000px',
  maxHeight: '90vh',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  overflow: 'auto',
};

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [pdfBlob, setPdfBlob] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [runTour, setRunTour] = useState(false);
  const [isFirstVisit, setIsFirstVisit] = useState(true);
  const [skipTourOpen, setSkipTourOpen] = useState(false);

  // Tour steps
  const tourSteps = [
    {
      target: '.app-title',
      content: 'Welcome to the ThoughtWorks Resume Builder! This tool will help you create a professional resume in ThoughtWorks format.',
      disableBeacon: true,
    },
    {
      target: '.sample-data-btn',
      content: 'Click here to load sample data that will help you understand what information to include in each field.',
    },
    {
      target: '.stepper-container',
      content: 'The form is divided into steps. Fill out each section and use the Next and Back buttons to navigate.',
    },
    {
      target: '.form-container',
      content: 'Enter your information in each form section. All fields have helpful placeholders to guide you.',
    },
    {
      target: '.navigation-btns',
      content: 'Use these buttons to navigate between form sections.',
    },
    {
      target: '.help-btn',
      content: 'Click here anytime to restart this tour.',
    }
  ];

  useEffect(() => {
    // Check if this is the first visit
    const visited = localStorage.getItem('visitedBefore');
    if (!visited) {
      // First time visitor
      setIsFirstVisit(true);
      setSkipTourOpen(true);
      localStorage.setItem('visitedBefore', 'true');
    } else {
      setIsFirstVisit(false);
    }
  }, []);

  const handleJoyrideCallback = (data) => {
    const { status } = data;
    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      setRunTour(false);
    }
  };

  const startTour = () => {
    setRunTour(true);
    setSkipTourOpen(false);
  };

  const skipTour = () => {
    setSkipTourOpen(false);
  };

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
    setSuccess('');
    setError('');
    setPdfBlob(null);
  };

  const loadSampleData = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/sample-data`);
      setFormData(response.data);
      // Show information dialog
      setConfirmOpen(true);
    } catch (err) {
      console.error('Error loading sample data:', err);
      setError('Failed to load sample data. Please ensure the backend server is running.');
    }
  };

  const handlePreview = async () => {
    setIsSubmitting(true);
    setError('');
    
    try {
      console.log('Generating preview with form data:', formData);
      const response = await axios.post(`${API_URL}/api/generate-pdf`, formData, {
        responseType: 'blob', // Important: set the response type to blob
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 30000 // 30 seconds timeout
      });
      
      console.log('Response received:', response.status);
      
      // Create a blob URL for the PDF
      const pdfBlobUrl = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      setPdfBlob(pdfBlobUrl);
      setPreviewOpen(true);
    } catch (err) {
      console.error('Error details:', err);
      
      // Check for specific error types
      if (err.code === 'ECONNREFUSED') {
        setError('Could not connect to the backend server. Please ensure it is running at http://localhost:5001');
      } else if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        setError(`Server error: ${err.response.status} - ${err.response.data.error || 'Unknown error'}`);
      } else if (err.request) {
        // The request was made but no response was received
        setError('No response received from server. Please check if the backend is running.');
      } else {
        // Something happened in setting up the request that triggered an Error
        setError(`Error: ${err.message}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async () => {
    // First preview the resume
    await handlePreview();
    
    // If preview was successful, set success message
    if (pdfBlob) {
      setSuccess('Your resume has been generated successfully! You can download it now.');
      
      // Advance to the final step if not already there
      if (activeStep !== steps.length) {
        setActiveStep(steps.length);
      }
    }
  };

  const handleClosePreview = () => {
    setPreviewOpen(false);
  };

  const handleCloseConfirm = () => {
    setConfirmOpen(false);
  };

  const handleDownloadPdf = () => {
    if (pdfBlob) {
      // Create a temporary link element and trigger the download
      const link = document.createElement('a');
      link.href = pdfBlob;
      link.download = `${formData.name.replace(/\s+/g, '_')}_resume.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      
      {/* Joyride Tour */}
      <Joyride
        steps={tourSteps}
        run={runTour}
        continuous={true}
        showProgress={true}
        showSkipButton={true}
        callback={handleJoyrideCallback}
        styles={{
          options: {
            zIndex: 10000,
            primaryColor: '#0F6A8B',
          }
        }}
      />
      
      {/* First Visit Dialog */}
      <Dialog
        open={skipTourOpen}
        onClose={skipTour}
      >
        <DialogTitle>Welcome to ThoughtWorks Resume Builder</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Would you like to take a quick tour to learn how to use this application?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={skipTour} color="primary">
            Skip Tour
          </Button>
          <Button onClick={startTour} color="primary" variant="contained" autoFocus>
            Start Tour
          </Button>
        </DialogActions>
      </Dialog>

      <Container component="main" maxWidth="md" sx={{ mb: 4 }}>
        <Box
          sx={{
            mt: 5,
            p: 4,
            backgroundColor: 'white',
            borderRadius: 2,
            boxShadow: 1,
            position: 'relative',
          }}
        >
          <Box sx={{ position: 'absolute', top: 10, right: 10 }}>
            <Tooltip title="Show tour guide">
              <IconButton 
                color="primary" 
                className="help-btn"
                onClick={() => setRunTour(true)}
              >
                <HelpOutlineIcon />
              </IconButton>
            </Tooltip>
          </Box>
          
          <Typography component="h1" variant="h4" align="center" gutterBottom className="app-title">
            ThoughtWorks Resume Builder
          </Typography>
          
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
            <Button
              variant="outlined"
              color="secondary"
              onClick={loadSampleData}
              startIcon={<InfoIcon />}
              className="sample-data-btn"
            >
              Load Sample Data
            </Button>
          </Box>
          
          <Box className="stepper-container">
            <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 5 }}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>
          
          <React.Fragment>
            {activeStep === steps.length ? (
              <React.Fragment>
                <Typography variant="h5" gutterBottom>
                  {success ? 'Resume generation complete!' : 'Processing your resume...'}
                </Typography>
                <Typography variant="subtitle1">
                  {success 
                    ? success 
                    : 'We are preparing your resume. This may take a moment...'}
                </Typography>
                {isSubmitting && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                    <CircularProgress />
                  </Box>
                )}
                {error && (
                  <Typography variant="body2" color="error" sx={{ mt: 2 }}>
                    {error}
                  </Typography>
                )}
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                  <Button onClick={handleReset} sx={{ mr: 1 }}>
                    Create Another Resume
                  </Button>
                  {pdfBlob && (
                    <>
                      <Button 
                        variant="outlined" 
                        color="primary" 
                        onClick={() => setPreviewOpen(true)}
                        sx={{ mr: 1 }}
                      >
                        Preview
                      </Button>
                      <Button 
                        variant="contained" 
                        color="primary" 
                        onClick={handleDownloadPdf}
                      >
                        Download PDF
                      </Button>
                    </>
                  )}
                </Box>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <Box className="form-container">
                  {getStepContent(activeStep, formData, setFormData, setActiveStep)}
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }} className="navigation-btns">
                  {activeStep !== 0 && (
                    <Button onClick={handleBack} sx={{ mr: 1 }}>
                      Back
                    </Button>
                  )}
                  
                  {activeStep === steps.length - 1 && (
                    <Button
                      variant="outlined"
                      onClick={handlePreview}
                      disabled={isSubmitting}
                      sx={{ mr: 1 }}
                    >
                      Preview Resume
                    </Button>
                  )}
                  
                  <Button
                    variant="contained"
                    onClick={
                      activeStep === steps.length - 1 ? handleSubmit : handleNext
                    }
                    disabled={isSubmitting}
                  >
                    {activeStep === steps.length - 1 ? 'Generate Resume' : 'Next'}
                  </Button>
                </Box>
              </React.Fragment>
            )}
          </React.Fragment>
        </Box>
      </Container>

      {/* PDF Preview Modal */}
      <Dialog
        open={previewOpen}
        onClose={handleClosePreview}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          Resume Preview
          <IconButton
            aria-label="close"
            onClick={handleClosePreview}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
            }}
          >
            &times;
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {pdfBlob ? (
            <iframe 
              src={pdfBlob} 
              width="100%" 
              height="600px" 
              title="Resume Preview"
              style={{ border: 'none' }}
            />
          ) : (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePreview}>Close</Button>
          <Button onClick={handleDownloadPdf} variant="contained" color="primary">
            Download
          </Button>
        </DialogActions>
      </Dialog>

      {/* Sample Data Loaded Confirmation Dialog */}
      <Dialog
        open={confirmOpen}
        onClose={handleCloseConfirm}
      >
        <DialogTitle>Sample Data Loaded</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Sample data has been loaded to help you understand the type of information to include in each field. 
            You can now navigate through the form and modify the sample data with your own information.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirm} color="primary" autoFocus>
            Got it
          </Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
}

export default App; 