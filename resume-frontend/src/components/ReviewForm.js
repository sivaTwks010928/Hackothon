import React, { useState } from 'react';
import { 
  Typography, 
  Box, 
  Button, 
  Divider,
  List,
  ListItem,
  ListItemText,
  Paper,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import PreviewIcon from '@mui/icons-material/Preview';
import DownloadIcon from '@mui/icons-material/Download';
import axios from 'axios';
import { getApiEndpoint } from '../utils/api';

// Backend API URL from environment variables
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

const ReviewForm = ({ formData, setActiveStep }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [pdfBlob, setPdfBlob] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  const isEmpty = (value) => {
    if (value === null || value === undefined) return true;
    if (typeof value === 'string') return value.trim() === '';
    if (Array.isArray(value)) {
      if (value.length === 0) return true;
      if (value.length === 1) {
        const item = value[0];
        if (typeof item === 'object') {
          return Object.values(item).every(val => {
            if (Array.isArray(val)) {
              return val.length === 0 || (val.length === 1 && val[0] === '');
            }
            return val === '';
          });
        }
        return item === '';
      }
      return false;
    }
    if (typeof value === 'object') return Object.keys(value).length === 0;
    return false;
  };

  const experienceEmpty = (exp) => {
    return (
      isEmpty(exp.title) && 
      isEmpty(exp.duration) && 
      isEmpty(exp.descriptions) && 
      isEmpty(exp.tech_stack)
    );
  };
  
  const skillEmpty = (skill) => {
    return isEmpty(skill.title) && isEmpty(skill.skills);
  };

  const navigateToSection = (step) => {
    if (setActiveStep) {
      setActiveStep(step);
    }
  };

  const handlePreview = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      console.log('Generating preview with form data:', formData);
      
      const response = await axios.post(getApiEndpoint('generate-pdf'), formData, {
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
      setIsLoading(false);
    }
  };

  const handleClosePreview = () => {
    setPreviewOpen(false);
  };

  const handleDownloadPdf = () => {
    if (pdfBlob) {
      // Create a temporary link element and trigger the download
      const link = document.createElement('a');
      link.href = pdfBlob;
      link.download = `${formData.name.replace(/\s+/g, '_') || 'resume'}_resume.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      // If no PDF blob exists yet, generate it first
      handlePreview().then(() => {
        if (pdfBlob) {
          const link = document.createElement('a');
          link.href = pdfBlob;
          link.download = `${formData.name.replace(/\s+/g, '_') || 'resume'}_resume.pdf`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      });
    }
  };

  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        Review Your Resume
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Please review your resume information before generating the PDF. Use the Edit buttons to go back and make changes.
      </Typography>
      
      <Paper elevation={0} variant="outlined" sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="h6">Personal Information</Typography>
          <Button 
            startIcon={<EditIcon />} 
            size="small"
            onClick={() => navigateToSection(0)}
          >
            Edit
          </Button>
        </Box>
        <Divider sx={{ mb: 2 }} />
        
        <List dense>
          <ListItem>
            <ListItemText 
              primary="Name" 
              secondary={formData.name || "Not provided"} 
              secondaryTypographyProps={{ 
                color: isEmpty(formData.name) ? 'text.disabled' : 'text.primary' 
              }}
            />
          </ListItem>
          
          <ListItem>
            <ListItemText 
              primary="Preferred Pronouns" 
              secondary={formData.preferred_pronouns || "Not provided"} 
              secondaryTypographyProps={{ 
                color: isEmpty(formData.preferred_pronouns) ? 'text.disabled' : 'text.primary' 
              }}
            />
          </ListItem>
          
          <ListItem>
            <ListItemText 
              primary="Role" 
              secondary={formData.role || "Not provided"} 
              secondaryTypographyProps={{ 
                color: isEmpty(formData.role) ? 'text.disabled' : 'text.primary' 
              }}
            />
          </ListItem>
          
          <ListItem>
            <ListItemText 
              primary="Summary" 
              secondary={formData.summary || "Not provided"} 
              secondaryTypographyProps={{ 
                color: isEmpty(formData.summary) ? 'text.disabled' : 'text.primary' 
              }}
            />
          </ListItem>
        </List>
      </Paper>
      
      <Paper elevation={0} variant="outlined" sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="h6">ThoughtWorks Experience</Typography>
          <Button 
            startIcon={<EditIcon />} 
            size="small"
            onClick={() => navigateToSection(1)}
          >
            Edit
          </Button>
        </Box>
        <Divider sx={{ mb: 2 }} />
        
        {formData.thoughtworks_experiences.some(exp => !experienceEmpty(exp)) ? (
          formData.thoughtworks_experiences.map((exp, index) => (
            !experienceEmpty(exp) && (
              <Box key={index} sx={{ mb: 3 }}>
                <Typography variant="subtitle1" fontWeight="bold">
                  {exp.title || "Untitled Position"}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {exp.duration || "No duration specified"}
                </Typography>
                
                {exp.descriptions && exp.descriptions.length > 0 && exp.descriptions[0] !== '' && (
                  <List dense sx={{ pl: 2 }}>
                    {exp.descriptions.map((desc, i) => (
                      <ListItem key={i} sx={{ display: 'list-item', listStyleType: 'disc' }}>
                        <ListItemText primary={desc} />
                      </ListItem>
                    ))}
                  </List>
                )}
                
                {!isEmpty(exp.tech_stack) && (
                  <Box sx={{ mt: 1 }}>
                    <Typography variant="body2" fontWeight="bold">
                      Technologies: 
                    </Typography>
                    <Typography variant="body2">
                      {exp.tech_stack}
                    </Typography>
                  </Box>
                )}
                
                {index < formData.thoughtworks_experiences.filter(e => !experienceEmpty(e)).length - 1 && (
                  <Divider sx={{ my: 2 }} />
                )}
              </Box>
            )
          ))
        ) : (
          <Typography variant="body2" color="text.disabled">
            No ThoughtWorks experience added
          </Typography>
        )}
      </Paper>
      
      <Paper elevation={0} variant="outlined" sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="h6">Other Experience</Typography>
          <Button 
            startIcon={<EditIcon />} 
            size="small"
            onClick={() => navigateToSection(2)}
          >
            Edit
          </Button>
        </Box>
        <Divider sx={{ mb: 2 }} />
        
        {formData.other_experiences.some(exp => !experienceEmpty(exp)) ? (
          formData.other_experiences.map((exp, index) => (
            !experienceEmpty(exp) && (
              <Box key={index} sx={{ mb: 3 }}>
                <Typography variant="subtitle1" fontWeight="bold">
                  {exp.title || "Untitled Position"}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {exp.duration || "No duration specified"}
                </Typography>
                
                {exp.descriptions && exp.descriptions.length > 0 && exp.descriptions[0] !== '' && (
                  <List dense sx={{ pl: 2 }}>
                    {exp.descriptions.map((desc, i) => (
                      <ListItem key={i} sx={{ display: 'list-item', listStyleType: 'disc' }}>
                        <ListItemText primary={desc} />
                      </ListItem>
                    ))}
                  </List>
                )}
                
                {!isEmpty(exp.tech_stack) && (
                  <Box sx={{ mt: 1 }}>
                    <Typography variant="body2" fontWeight="bold">
                      Technologies: 
                    </Typography>
                    <Typography variant="body2">
                      {exp.tech_stack}
                    </Typography>
                  </Box>
                )}
                
                {index < formData.other_experiences.filter(e => !experienceEmpty(e)).length - 1 && (
                  <Divider sx={{ my: 2 }} />
                )}
              </Box>
            )
          ))
        ) : (
          <Typography variant="body2" color="text.disabled">
            No other experience added
          </Typography>
        )}
      </Paper>
      
      <Paper elevation={0} variant="outlined" sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="h6">Skills</Typography>
          <Button 
            startIcon={<EditIcon />} 
            size="small"
            onClick={() => navigateToSection(3)}
          >
            Edit
          </Button>
        </Box>
        <Divider sx={{ mb: 2 }} />
        
        {formData.skills.some(skill => !skillEmpty(skill)) ? (
          formData.skills.map((skill, index) => (
            !skillEmpty(skill) && (
              <Box key={index} sx={{ mb: 2 }}>
                <Typography variant="subtitle2" fontWeight="bold">
                  {skill.title}:
                </Typography>
                <Box sx={{ mt: 1 }}>
                  {skill.skills.split(',').map((item, i) => (
                    item.trim() && (
                      <Chip 
                        key={i} 
                        label={item.trim()} 
                        size="small" 
                        sx={{ mr: 0.5, mb: 0.5 }} 
                      />
                    )
                  ))}
                </Box>
              </Box>
            )
          ))
        ) : (
          <Typography variant="body2" color="text.disabled">
            No skills added
          </Typography>
        )}
      </Paper>
      
      <Box sx={{ mt: 3, p: 2, backgroundColor: '#f9f9f9', borderRadius: 1, mb: 4 }}>
        <Typography variant="body2" color="text.secondary">
          <strong>Tip:</strong> Before generating your resume, make sure all sections are filled out with accurate information. 
          You can preview your resume before downloading the final PDF.
        </Typography>
      </Box>

      {/* Preview and Download Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 4, mb: 2 }}>
        <Button 
          variant="outlined" 
          color="primary" 
          startIcon={<PreviewIcon />}
          onClick={handlePreview}
          disabled={isLoading}
        >
          {isLoading ? 'Generating...' : 'Preview Resume'}
        </Button>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<DownloadIcon />}
          onClick={handleDownloadPdf}
          disabled={isLoading}
        >
          Download PDF
        </Button>
      </Box>

      {/* Error message */}
      {error && (
        <Typography color="error" align="center" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}

      {/* Loading indicator */}
      {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <CircularProgress size={24} />
        </Box>
      )}

      {/* PDF Preview Dialog */}
      <Dialog
        open={previewOpen}
        onClose={handleClosePreview}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>Resume Preview</DialogTitle>
        <DialogContent>
          {pdfBlob && (
            <iframe
              src={pdfBlob}
              width="100%"
              height="600px"
              title="Resume Preview"
              style={{ border: 'none' }}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePreview} color="primary">
            Close
          </Button>
          <Button onClick={handleDownloadPdf} color="primary" variant="contained" startIcon={<DownloadIcon />}>
            Download
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};

export default ReviewForm; 