import React from 'react';
import {
  Typography,
  Grid,
  TextField,
  Button,
  Box,
  IconButton,
  Paper,
  Divider
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { ResumeFormData, Experience } from '../types/resume';

interface ThoughtworksExperienceFormProps {
  formData: ResumeFormData;
  setFormData: React.Dispatch<React.SetStateAction<ResumeFormData>>;
}

const ThoughtworksExperienceForm: React.FC<ThoughtworksExperienceFormProps> = ({ formData, setFormData }) => {
  
  const handleExperienceChange = (index: number, field: keyof Experience, value: string) => {
    const updatedExperiences = [...formData.thoughtworks_experiences];
    updatedExperiences[index] = {
      ...updatedExperiences[index],
      [field]: value
    };
    
    setFormData({
      ...formData,
      thoughtworks_experiences: updatedExperiences
    });
  };

  const handleDescriptionChange = (expIndex: number, descIndex: number, value: string) => {
    const updatedExperiences = [...formData.thoughtworks_experiences];
    const updatedDescriptions = [...updatedExperiences[expIndex].descriptions];
    updatedDescriptions[descIndex] = value;
    
    updatedExperiences[expIndex] = {
      ...updatedExperiences[expIndex],
      descriptions: updatedDescriptions
    };
    
    setFormData({
      ...formData,
      thoughtworks_experiences: updatedExperiences
    });
  };

  const addExperience = () => {
    setFormData({
      ...formData,
      thoughtworks_experiences: [
        ...formData.thoughtworks_experiences,
        {
          title: '',
          duration: '',
          descriptions: [''],
          tech_stack: ''
        }
      ]
    });
  };

  const removeExperience = (index: number) => {
    // Don't remove if it's the only one
    if (formData.thoughtworks_experiences.length <= 1) {
      return;
    }
    
    const updatedExperiences = formData.thoughtworks_experiences.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      thoughtworks_experiences: updatedExperiences
    });
  };

  const addDescription = (expIndex: number) => {
    const updatedExperiences = [...formData.thoughtworks_experiences];
    updatedExperiences[expIndex] = {
      ...updatedExperiences[expIndex],
      descriptions: [...updatedExperiences[expIndex].descriptions, '']
    };
    
    setFormData({
      ...formData,
      thoughtworks_experiences: updatedExperiences
    });
  };

  const removeDescription = (expIndex: number, descIndex: number) => {
    // Don't remove if it's the only one
    if (formData.thoughtworks_experiences[expIndex].descriptions.length <= 1) {
      return;
    }
    
    const updatedExperiences = [...formData.thoughtworks_experiences];
    const updatedDescriptions = updatedExperiences[expIndex].descriptions.filter((_, i) => i !== descIndex);
    
    updatedExperiences[expIndex] = {
      ...updatedExperiences[expIndex],
      descriptions: updatedDescriptions
    };
    
    setFormData({
      ...formData,
      thoughtworks_experiences: updatedExperiences
    });
  };

  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        ThoughtWorks Experience
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        List your work experience at ThoughtWorks. Include project roles, responsibilities, and achievements.
      </Typography>
      
      {formData.thoughtworks_experiences.map((exp, expIndex) => (
        <Paper key={expIndex} sx={{ p: 2, mb: 3, backgroundColor: '#f9f9f9' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="subtitle1">Experience {expIndex + 1}</Typography>
            {formData.thoughtworks_experiences.length > 1 && (
              <IconButton 
                aria-label="delete" 
                color="error"
                onClick={() => removeExperience(expIndex)}
              >
                <DeleteIcon />
              </IconButton>
            )}
          </Box>
          
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                id={`tw-exp-title-${expIndex}`}
                name={`tw-exp-title-${expIndex}`}
                label="Project/Role Title"
                fullWidth
                variant="outlined"
                value={exp.title}
                onChange={(e) => handleExperienceChange(expIndex, 'title', e.target.value)}
                placeholder="e.g., Full-Stack Developer on Project Alpha"
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                required
                id={`tw-exp-duration-${expIndex}`}
                name={`tw-exp-duration-${expIndex}`}
                label="Duration"
                fullWidth
                variant="outlined"
                value={exp.duration}
                onChange={(e) => handleExperienceChange(expIndex, 'duration', e.target.value)}
                placeholder="e.g., January 2022 - Present"
              />
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>
                Responsibilities & Achievements
              </Typography>
              
              {exp.descriptions.map((desc, descIndex) => (
                <Box key={descIndex} sx={{ display: 'flex', mb: 1 }}>
                  <TextField
                    id={`tw-exp-desc-${expIndex}-${descIndex}`}
                    name={`tw-exp-desc-${expIndex}-${descIndex}`}
                    fullWidth
                    variant="outlined"
                    size="small"
                    value={desc}
                    onChange={(e) => handleDescriptionChange(expIndex, descIndex, e.target.value)}
                    placeholder="e.g., Implemented key feature X that improved Y by Z%"
                    sx={{ mr: 1 }}
                  />
                  {exp.descriptions.length > 1 && (
                    <IconButton 
                      aria-label="delete description" 
                      color="error"
                      onClick={() => removeDescription(expIndex, descIndex)}
                      size="small"
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  )}
                </Box>
              ))}
              
              <Button 
                startIcon={<AddIcon />} 
                onClick={() => addDescription(expIndex)}
                sx={{ mt: 1 }}
                size="small"
              >
                Add Description
              </Button>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                id={`tw-exp-tech-${expIndex}`}
                name={`tw-exp-tech-${expIndex}`}
                label="Technologies Used"
                fullWidth
                variant="outlined"
                value={exp.tech_stack}
                onChange={(e) => handleExperienceChange(expIndex, 'tech_stack', e.target.value)}
                placeholder="e.g., React, TypeScript, Node.js, AWS"
                helperText="Comma-separated list of technologies, frameworks, and methodologies"
              />
            </Grid>
          </Grid>
          
          {expIndex < formData.thoughtworks_experiences.length - 1 && (
            <Divider sx={{ my: 3 }} />
          )}
        </Paper>
      ))}
      
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        <Button 
          variant="outlined" 
          startIcon={<AddIcon />} 
          onClick={addExperience}
        >
          Add Another ThoughtWorks Experience
        </Button>
      </Box>
      
      <Box sx={{ mt: 3, p: 2, backgroundColor: '#f9f9f9', borderRadius: 1 }}>
        <Typography variant="body2" color="text.secondary">
          <strong>Tip:</strong> Be specific about your role and contributions on each project. 
          Quantify achievements where possible (e.g., "Reduced load time by 40%").
        </Typography>
      </Box>
    </React.Fragment>
  );
};

export default ThoughtworksExperienceForm; 