import React from 'react';
import { Typography, Grid, TextField, Box, Button, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

const SkillsForm = ({ formData, setFormData }) => {
  const handleAddSkillCategory = () => {
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

  const handleRemoveSkillCategory = index => {
    const newSkills = [...formData.skills];
    newSkills.splice(index, 1);

    setFormData({
      ...formData,
      skills: newSkills.length ? newSkills : [{ title: '', skills: '' }],
    });
  };

  const handleSkillChange = (index, field, value) => {
    const newSkills = [...formData.skills];
    newSkills[index] = {
      ...newSkills[index],
      [field]: value,
    };

    setFormData({
      ...formData,
      skills: newSkills,
    });
  };

  const suggestedCategories = [
    'Programming Languages',
    'Automation Tools',
    'Testing Frameworks',
    'Continuous Integration/Continuous Deployment',
    'Project Management Tools',
    'Databases',
    'API Testing Tools',
    'Performance Testing Tools',
    'Security Testing Tools',
    'Mobile Testing',
    'Certifications',
    'Methodologies',
  ];

  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        Skills
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Add your technical and professional skills by category. All fields are optional.
      </Typography>

      <Box sx={{ mb: 3, p: 2, backgroundColor: '#f5f8fa', borderRadius: 1 }}>
        <Typography variant="body2" color="text.secondary">
          <strong>Suggested categories:</strong> {suggestedCategories.join(', ')}
        </Typography>
      </Box>

      {formData.skills.map((skill, index) => (
        <Box
          key={index}
          sx={{
            mb: 3,
            p: 3,
            border: '1px solid #e0e0e0',
            borderRadius: 2,
            position: 'relative',
          }}
        >
          {formData.skills.length > 1 && (
            <IconButton
              aria-label="delete skill category"
              onClick={() => handleRemoveSkillCategory(index)}
              sx={{ position: 'absolute', top: 10, right: 10 }}
              color="error"
              size="small"
            >
              <DeleteIcon />
            </IconButton>
          )}

          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                id={`skill-title-${index}`}
                label="Skill Category"
                fullWidth
                variant="outlined"
                value={skill.title}
                onChange={e => handleSkillChange(index, 'title', e.target.value)}
                placeholder="e.g., Programming Languages"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                id={`skill-list-${index}`}
                label="Skills"
                fullWidth
                multiline
                rows={2}
                variant="outlined"
                value={skill.skills}
                onChange={e => handleSkillChange(index, 'skills', e.target.value)}
                placeholder="e.g., Java, JavaScript, Python, C#"
                helperText="Comma-separated list of skills in this category"
              />
            </Grid>
          </Grid>
        </Box>
      ))}

      <Button
        variant="outlined"
        startIcon={<AddIcon />}
        onClick={handleAddSkillCategory}
        sx={{ my: 2 }}
        fullWidth
      >
        Add Skill Category
      </Button>

      <Box sx={{ mt: 3, p: 2, backgroundColor: '#f9f9f9', borderRadius: 1 }}>
        <Typography variant="body2" color="text.secondary">
          <strong>Tip:</strong> Group your skills by category to make them more readable. List the
          most relevant and advanced skills first within each category.
        </Typography>
      </Box>
    </React.Fragment>
  );
};

export default SkillsForm;
