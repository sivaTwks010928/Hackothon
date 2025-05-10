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
import { ResumeFormData, Skill } from '../types/resume';

interface SkillsFormProps {
  formData: ResumeFormData;
  setFormData: React.Dispatch<React.SetStateAction<ResumeFormData>>;
}

const SkillsForm: React.FC<SkillsFormProps> = ({ formData, setFormData }) => {
  const handleSkillChange = (index: number, field: keyof Skill, value: string) => {
    const updatedSkills = [...formData.skills];
    updatedSkills[index] = {
      ...updatedSkills[index],
      [field]: value,
    };

    setFormData({
      ...formData,
      skills: updatedSkills,
    });
  };

  const addSkillCategory = () => {
    setFormData({
      ...formData,
      skills: [
        ...formData.skills,
        {
          title: '',
          skills: '',
        },
      ],
    });
  };

  const removeSkillCategory = (index: number) => {
    // Don't remove if it's the only one
    if (formData.skills.length <= 1) {
      return;
    }

    const updatedSkills = formData.skills.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      skills: updatedSkills,
    });
  };

  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        Skills & Expertise
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        List your professional skills grouped by category (e.g., Programming Languages, Tools,
        Methodologies).
      </Typography>

      {formData.skills.map((skillCategory, index) => (
        <Paper key={index} sx={{ p: 2, mb: 3, backgroundColor: '#f9f9f9' }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 2,
            }}
          >
            <Typography variant="subtitle1">Skill Category {index + 1}</Typography>
            {formData.skills.length > 1 && (
              <IconButton
                aria-label="delete"
                color="error"
                onClick={() => removeSkillCategory(index)}
              >
                <DeleteIcon />
              </IconButton>
            )}
          </Box>

          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                required
                id={`skill-title-${index}`}
                name={`skill-title-${index}`}
                label="Category Title"
                fullWidth
                variant="outlined"
                value={skillCategory.title}
                onChange={e => handleSkillChange(index, 'title', e.target.value)}
                placeholder="e.g., Programming Languages"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                required
                id={`skill-list-${index}`}
                name={`skill-list-${index}`}
                label="Skills"
                fullWidth
                multiline
                rows={2}
                variant="outlined"
                value={skillCategory.skills}
                onChange={e => handleSkillChange(index, 'skills', e.target.value)}
                placeholder="e.g., JavaScript, TypeScript, Python, Java"
                helperText="Comma-separated list of skills in this category"
              />
            </Grid>
          </Grid>

          {index < formData.skills.length - 1 && <Divider sx={{ my: 3 }} />}
        </Paper>
      ))}

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        <Button variant="outlined" startIcon={<AddIcon />} onClick={addSkillCategory}>
          Add Another Skill Category
        </Button>
      </Box>

      <Box sx={{ mt: 3, p: 2, backgroundColor: '#f9f9f9', borderRadius: 1 }}>
        <Typography variant="body2" color="text.secondary">
          <strong>Tip:</strong> Group similar skills together under meaningful category headings.
          List the most relevant and proficient skills first within each category.
        </Typography>
      </Box>
    </React.Fragment>
  );
};

export default SkillsForm;
