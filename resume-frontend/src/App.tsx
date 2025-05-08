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
import axios from 'axios';
import CircularProgress from '@mui/material/CircularProgress';
import Modal from '@mui/material/Modal';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import Joyride, { STATUS, CallBackProps } from 'react-joyride';

// Import components
import PersonalInfoForm from './components/PersonalInfoForm';
import ThoughtworksExperienceForm from './components/ThoughtworksExperienceForm';
import OtherExperienceForm from './components/OtherExperienceForm';
import SkillsForm from './components/SkillsForm';
import ReviewForm from './components/ReviewForm';

// Import types
import { ResumeFormData, defaultFormData } from './types/resume';

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

const getStepContent = (
  step: number, 
  formData: ResumeFormData, 
  setFormData: React.Dispatch<React.SetStateAction<ResumeFormData>>, 
  setActiveStep: React.Dispatch<React.SetStateAction<number>>
) => {
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
};

const App: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [formData, setFormData] = useState<ResumeFormData>(defaultFormData);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [pdfBlob, setPdfBlob] = useState<string | null>(null);
  const [previewOpen, setPreviewOpen] = useState<boolean>(false);
  const [confirmOpen, setConfirmOpen] = useState<boolean>(false);
  const [runTour, setRunTour] = useState<boolean>(false);
  const [isFirstVisit, setIsFirstVisit] = useState<boolean>(true);
  const [skipTourOpen, setSkipTourOpen] = useState<boolean>(false);

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

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status } = data;
    if (status === 'finished' || status === 'skipped') {
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
    setFormData(defaultFormData);
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
    } catch (err: any) {
      console.error('Error details:', err);
      
      // Check for specific error types
      if (err.code === 'ECONNREFUSED') {
        setError('Could not connect to the backend server. Please ensure it is running at http://localhost:5001');
      } else if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        setError(`Server error: ${err.response.status} - ${err.response.data?.error || 'Unknown error'}`);
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
      
      {/* Tour guide */}
      <Joyride
        steps={tourSteps}
        run={runTour}
        continuous
        showSkipButton
        styles={{
          options: {
            primaryColor: theme.palette.primary.main,
          }
        }}
        callback={handleJoyrideCallback}
      />
      
      {/* Skip tour dialog */}
      <Dialog
        open={skipTourOpen}
        onClose={skipTour}
        aria-labelledby="tour-dialog-title"
        aria-describedby="tour-dialog-description"
      >
        <DialogTitle id="tour-dialog-title">
          Welcome to the Resume Builder!
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="tour-dialog-description">
            Would you like to take a quick tour to learn how this tool works?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={skipTour} color="primary">
            Skip Tour
          </Button>
          <Button onClick={startTour} color="primary" variant="contained" autoFocus>
            Take Tour
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Sample data dialog */}
      <Dialog
        open={confirmOpen}
        onClose={handleCloseConfirm}
        aria-labelledby="sample-dialog-title"
        aria-describedby="sample-dialog-description"
      >
        <DialogTitle id="sample-dialog-title">
          Sample Data Loaded
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="sample-dialog-description">
            Sample data has been loaded into the form fields. This is example data to help you understand the format expected in each field. Please review and replace with your own information.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirm} color="primary" autoFocus>
            Got it
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* PDF Preview Modal */}
      <Modal
        open={previewOpen}
        onClose={handleClosePreview}
        aria-labelledby="pdf-preview-title"
        aria-describedby="pdf-preview-description"
      >
        <Box sx={modalStyle}>
          <Typography id="pdf-preview-title" variant="h6" component="h2" gutterBottom>
            Resume Preview
          </Typography>
          {pdfBlob ? (
            <Box component="iframe" 
              src={pdfBlob} 
              sx={{ 
                width: '100%', 
                height: '70vh', 
                border: 'none' 
              }}
              title="Resume PDF preview"
            />
          ) : (
            <Typography>Loading preview...</Typography>
          )}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button onClick={handleClosePreview} sx={{ mr: 1 }}>
              Close
            </Button>
            {pdfBlob && (
              <Button 
                variant="contained" 
                color="primary" 
                onClick={handleDownloadPdf}
              >
                Download PDF
              </Button>
            )}
          </Box>
        </Box>
      </Modal>
      
      <Container component="main" maxWidth="md" sx={{ mb: 4 }}>
        <Box
          sx={{
            my: 4,
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            backgroundColor: 'white',
            borderRadius: 2,
            boxShadow: 1,
          }}
        >
          <Typography component="h1" variant="h4" align="center" className="app-title" gutterBottom>
            Resume Builder
          </Typography>
          <Typography variant="body1" align="center" color="text.secondary" sx={{ mb: 3 }}>
            Create a professional resume in minutes. Follow the steps below to generate your resume.
          </Typography>
          
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%', mb: 4 }}>
            <Button 
              variant="outlined" 
              color="primary" 
              onClick={loadSampleData}
              className="sample-data-btn"
              sx={{ mr: 1 }}
            >
              Load Sample Data
            </Button>
            
            <Tooltip title="Take a tour of the application">
              <IconButton 
                aria-label="help" 
                onClick={startTour}
                color="primary"
                className="help-btn"
              >
                <HelpOutlineIcon />
              </IconButton>
            </Tooltip>
          </Box>
          
          <Box sx={{ width: '100%' }} className="stepper-container">
            <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
            
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
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default App; 