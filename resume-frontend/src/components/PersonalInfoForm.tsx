import React from 'react';
import {
  Typography,
  Grid,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent,
  Box,
} from '@mui/material';
import { ResumeFormData } from '../types/resume';

interface PersonalInfoFormProps {
  formData: ResumeFormData;
  setFormData: React.Dispatch<React.SetStateAction<ResumeFormData>>;
}

const pronounOptions = ['She/Her', 'He/Him', 'They/Them', 'Other'];

const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({ formData, setFormData }) => {
  const handleTextFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        Personal Information
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Tell us about yourself. This information will appear at the top of your resume. All fields
        are optional.
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            required={false}
            id="name"
            name="name"
            label="Full Name"
            fullWidth
            variant="outlined"
            value={formData.name}
            onChange={handleTextFieldChange}
            placeholder="e.g., Jane Doe"
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth variant="outlined">
            <InputLabel id="pronouns-label">Preferred Pronouns</InputLabel>
            <Select
              labelId="pronouns-label"
              id="preferred_pronouns"
              name="preferred_pronouns"
              value={formData.preferred_pronouns}
              onChange={handleSelectChange}
              label="Preferred Pronouns"
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {pronounOptions.map(option => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            required={false}
            id="role"
            name="role"
            label="Current Role / Job Title"
            fullWidth
            variant="outlined"
            value={formData.role}
            onChange={handleTextFieldChange}
            placeholder="e.g., Quality Analyst"
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            id="summary"
            name="summary"
            label="Professional Summary"
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            value={formData.summary}
            onChange={handleTextFieldChange}
            placeholder="A brief overview of your professional background and expertise..."
            helperText="A compelling summary of your professional experience and skills (3-5 sentences recommended)"
          />
        </Grid>
      </Grid>

      <Box sx={{ mt: 3, p: 2, backgroundColor: '#f9f9f9', borderRadius: 1 }}>
        <Typography variant="body2" color="text.secondary">
          <strong>Tip:</strong> Your professional summary should highlight your experience, skills,
          and unique value. Keep it concise and focused on your key strengths relevant to your
          career goals.
        </Typography>
      </Box>
    </React.Fragment>
  );
};

export default PersonalInfoForm;
