import React from 'react';
import { 
  Typography, 
  Grid, 
  TextField, 
  Box, 
  Button, 
  IconButton 
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

const OtherExperienceForm = ({ formData, setFormData }) => {
  const handleAddExperience = () => {
    setFormData({
      ...formData,
      other_experiences: [
        ...formData.other_experiences,
        {
          title: '',
          duration: '',
          descriptions: [''],
          tech_stack: '',
        },
      ],
    });
  };

  const handleRemoveExperience = (index) => {
    const newExperiences = [...formData.other_experiences];
    newExperiences.splice(index, 1);
    
    setFormData({
      ...formData,
      other_experiences: newExperiences.length 
        ? newExperiences 
        : [{ title: '', duration: '', descriptions: [''], tech_stack: '' }],
    });
  };

  const handleExperienceChange = (index, event) => {
    const { name, value } = event.target;
    const newExperiences = [...formData.other_experiences];
    newExperiences[index] = {
      ...newExperiences[index],
      [name]: value,
    };
    
    setFormData({
      ...formData,
      other_experiences: newExperiences,
    });
  };

  const handleAddDescription = (expIndex) => {
    const newExperiences = [...formData.other_experiences];
    newExperiences[expIndex].descriptions.push('');
    
    setFormData({
      ...formData,
      other_experiences: newExperiences,
    });
  };

  const handleRemoveDescription = (expIndex, descIndex) => {
    const newExperiences = [...formData.other_experiences];
    newExperiences[expIndex].descriptions.splice(descIndex, 1);
    
    if (newExperiences[expIndex].descriptions.length === 0) {
      newExperiences[expIndex].descriptions = [''];
    }
    
    setFormData({
      ...formData,
      other_experiences: newExperiences,
    });
  };

  const handleDescriptionChange = (expIndex, descIndex, value) => {
    const newExperiences = [...formData.other_experiences];
    newExperiences[expIndex].descriptions[descIndex] = value;
    
    setFormData({
      ...formData,
      other_experiences: newExperiences,
    });
  };

  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        Other Professional Experience
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Add your experience from previous employers. All fields are optional.
      </Typography>

      {formData.other_experiences.map((experience, expIndex) => (
        <Box 
          key={expIndex} 
          sx={{ 
            mb: 4, 
            p: 3, 
            border: '1px solid #e0e0e0', 
            borderRadius: 2,
            position: 'relative'
          }}
        >
          {formData.other_experiences.length > 1 && (
            <IconButton
              aria-label="delete experience"
              onClick={() => handleRemoveExperience(expIndex)}
              sx={{ position: 'absolute', top: 10, right: 10 }}
              color="error"
              size="small"
            >
              <DeleteIcon />
            </IconButton>
          )}
          
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            Experience {expIndex + 1}
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} sm={8}>
              <TextField
                id={`title-${expIndex}`}
                name="title"
                label="Company & Job Title"
                fullWidth
                variant="outlined"
                value={experience.title}
                onChange={(e) => handleExperienceChange(expIndex, e)}
                placeholder="e.g., Tech Solutions Corp - Senior Test Analyst"
              />
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <TextField
                id={`duration-${expIndex}`}
                name="duration"
                label="Duration"
                fullWidth
                variant="outlined"
                value={experience.duration}
                onChange={(e) => handleExperienceChange(expIndex, e)}
                placeholder="e.g., Jan 2020 - Dec 2021"
              />
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>
                Description / Responsibilities
              </Typography>
              
              {experience.descriptions.map((description, descIndex) => (
                <Box key={descIndex} sx={{ display: 'flex', mb: 2 }}>
                  <TextField
                    fullWidth
                    multiline
                    variant="outlined"
                    value={description}
                    onChange={(e) => handleDescriptionChange(expIndex, descIndex, e.target.value)}
                    placeholder={`Responsibility or achievement ${descIndex + 1}`}
                    size="small"
                  />
                  
                  {experience.descriptions.length > 1 && (
                    <IconButton
                      aria-label="delete description"
                      onClick={() => handleRemoveDescription(expIndex, descIndex)}
                      color="error"
                      size="small"
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  )}
                </Box>
              ))}
              
              <Button
                startIcon={<AddIcon />}
                onClick={() => handleAddDescription(expIndex)}
                size="small"
                sx={{ mt: 1 }}
              >
                Add Description
              </Button>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                id={`tech-stack-${expIndex}`}
                name="tech_stack"
                label="Tech Stack / Skills Used"
                fullWidth
                variant="outlined"
                value={experience.tech_stack}
                onChange={(e) => handleExperienceChange(expIndex, e)}
                placeholder="e.g., Cucumber, Gherkin, Selenium Grid, Jenkins, Docker"
                helperText="Comma-separated list of technologies and tools used"
              />
            </Grid>
          </Grid>
        </Box>
      ))}
      
      <Button
        variant="outlined"
        startIcon={<AddIcon />}
        onClick={handleAddExperience}
        sx={{ my: 2 }}
        fullWidth
      >
        Add Another Experience
      </Button>
      
      <Box sx={{ mt: 3, p: 2, backgroundColor: '#f9f9f9', borderRadius: 1 }}>
        <Typography variant="body2" color="text.secondary">
          <strong>Tip:</strong> Include only relevant experience that showcases your skills and career progression.
          Try to focus on accomplishments and results rather than day-to-day tasks.
        </Typography>
      </Box>
    </React.Fragment>
  );
};

export default OtherExperienceForm; 