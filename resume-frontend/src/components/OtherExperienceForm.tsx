import React from 'react';
import {
  Typography,
  Grid,
  TextField,
  Button,
  Box,
  IconButton,
  Paper,
  Divider,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { ResumeFormData, Experience } from '../types/resume';

interface OtherExperienceFormProps {
  formData: ResumeFormData;
  setFormData: React.Dispatch<React.SetStateAction<ResumeFormData>>;
}

const OtherExperienceForm: React.FC<OtherExperienceFormProps> = ({ formData, setFormData }) => {
  const handleExperienceChange = (index: number, field: keyof Experience, value: string) => {
    const updatedExperiences = [...formData.other_experiences];
    updatedExperiences[index] = {
      ...updatedExperiences[index],
      [field]: value,
    };

    setFormData({
      ...formData,
      other_experiences: updatedExperiences,
    });
  };

  const handleDescriptionChange = (expIndex: number, descIndex: number, value: string) => {
    const updatedExperiences = [...formData.other_experiences];
    const updatedDescriptions = [...updatedExperiences[expIndex].descriptions];
    updatedDescriptions[descIndex] = value;

    updatedExperiences[expIndex] = {
      ...updatedExperiences[expIndex],
      descriptions: updatedDescriptions,
    };

    setFormData({
      ...formData,
      other_experiences: updatedExperiences,
    });
  };

  const addExperience = () => {
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

  const removeExperience = (index: number) => {
    // Don't remove if it's the only one
    if (formData.other_experiences.length <= 1) {
      return;
    }

    const updatedExperiences = formData.other_experiences.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      other_experiences: updatedExperiences,
    });
  };

  const addDescription = (expIndex: number) => {
    const updatedExperiences = [...formData.other_experiences];
    updatedExperiences[expIndex] = {
      ...updatedExperiences[expIndex],
      descriptions: [...updatedExperiences[expIndex].descriptions, ''],
    };

    setFormData({
      ...formData,
      other_experiences: updatedExperiences,
    });
  };

  const removeDescription = (expIndex: number, descIndex: number) => {
    // Don't remove if it's the only one
    if (formData.other_experiences[expIndex].descriptions.length <= 1) {
      return;
    }

    const updatedExperiences = [...formData.other_experiences];
    const updatedDescriptions = updatedExperiences[expIndex].descriptions.filter(
      (_, i) => i !== descIndex
    );

    updatedExperiences[expIndex] = {
      ...updatedExperiences[expIndex],
      descriptions: updatedDescriptions,
    };

    setFormData({
      ...formData,
      other_experiences: updatedExperiences,
    });
  };

  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        Other Professional Experience
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        List your work experience at other companies. Include roles, responsibilities, and
        achievements.
      </Typography>

      {formData.other_experiences.map((exp, expIndex) => (
        <Paper key={expIndex} sx={{ p: 2, mb: 3, backgroundColor: '#f9f9f9' }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 2,
            }}
          >
            <Typography variant="subtitle1">Experience {expIndex + 1}</Typography>
            {formData.other_experiences.length > 1 && (
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
                id={`other-exp-title-${expIndex}`}
                name={`other-exp-title-${expIndex}`}
                label="Company & Role"
                fullWidth
                variant="outlined"
                value={exp.title}
                onChange={e => handleExperienceChange(expIndex, 'title', e.target.value)}
                placeholder="e.g., Senior Developer at Acme Corp"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                required
                id={`other-exp-duration-${expIndex}`}
                name={`other-exp-duration-${expIndex}`}
                label="Duration"
                fullWidth
                variant="outlined"
                value={exp.duration}
                onChange={e => handleExperienceChange(expIndex, 'duration', e.target.value)}
                placeholder="e.g., June 2019 - December 2021"
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>
                Responsibilities & Achievements
              </Typography>

              {exp.descriptions.map((desc, descIndex) => (
                <Box key={descIndex} sx={{ display: 'flex', mb: 1 }}>
                  <TextField
                    id={`other-exp-desc-${expIndex}-${descIndex}`}
                    name={`other-exp-desc-${expIndex}-${descIndex}`}
                    fullWidth
                    variant="outlined"
                    size="small"
                    value={desc}
                    onChange={e => handleDescriptionChange(expIndex, descIndex, e.target.value)}
                    placeholder="e.g., Led a team of 5 developers to deliver product X on time and under budget"
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
                id={`other-exp-tech-${expIndex}`}
                name={`other-exp-tech-${expIndex}`}
                label="Technologies Used"
                fullWidth
                variant="outlined"
                value={exp.tech_stack}
                onChange={e => handleExperienceChange(expIndex, 'tech_stack', e.target.value)}
                placeholder="e.g., Java, Spring Boot, PostgreSQL, Docker"
                helperText="Comma-separated list of technologies, frameworks, and methodologies"
              />
            </Grid>
          </Grid>

          {expIndex < formData.other_experiences.length - 1 && <Divider sx={{ my: 3 }} />}
        </Paper>
      ))}

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        <Button variant="outlined" startIcon={<AddIcon />} onClick={addExperience}>
          Add Another Experience
        </Button>
      </Box>

      <Box sx={{ mt: 3, p: 2, backgroundColor: '#f9f9f9', borderRadius: 1 }}>
        <Typography variant="body2" color="text.secondary">
          <strong>Tip:</strong> Focus on achievements that demonstrate your skills and impact. Keep
          descriptions concise but impactful, highlighting transferable skills relevant to your
          target role.
        </Typography>
      </Box>
    </React.Fragment>
  );
};

export default OtherExperienceForm;
