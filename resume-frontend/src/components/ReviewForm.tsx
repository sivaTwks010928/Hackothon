import React from 'react';
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
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { ResumeFormData } from '../types/resume';

interface ReviewFormProps {
  formData: ResumeFormData;
  setActiveStep: React.Dispatch<React.SetStateAction<number>>;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ formData, setActiveStep }) => {
  const isEmpty = (value: any): boolean => {
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

  const experienceEmpty = (exp: any): boolean => {
    return (
      isEmpty(exp.title) &&
      isEmpty(exp.duration) &&
      isEmpty(exp.descriptions) &&
      isEmpty(exp.tech_stack)
    );
  };

  const skillEmpty = (skill: any): boolean => {
    return isEmpty(skill.title) && isEmpty(skill.skills);
  };

  const navigateToSection = (step: number) => {
    if (setActiveStep) {
      setActiveStep(step);
    }
  };

  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        Review Your Information
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Please review your resume information below. Click the edit button to make changes to any
        section.
      </Typography>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2,
          }}
        >
          <Typography variant="h6">Personal Information</Typography>
          <Button startIcon={<EditIcon />} onClick={() => navigateToSection(0)} size="small">
            Edit
          </Button>
        </Box>

        {isEmpty(formData.name) && isEmpty(formData.role) && isEmpty(formData.summary) ? (
          <Typography color="text.secondary" sx={{ fontStyle: 'italic' }}>
            No personal information provided.
          </Typography>
        ) : (
          <List dense>
            {!isEmpty(formData.name) && (
              <ListItem>
                <ListItemText primary="Name" secondary={formData.name} />
              </ListItem>
            )}

            {!isEmpty(formData.preferred_pronouns) && (
              <ListItem>
                <ListItemText
                  primary="Preferred Pronouns"
                  secondary={formData.preferred_pronouns}
                />
              </ListItem>
            )}

            {!isEmpty(formData.role) && (
              <ListItem>
                <ListItemText primary="Current Role" secondary={formData.role} />
              </ListItem>
            )}

            {!isEmpty(formData.summary) && (
              <ListItem>
                <ListItemText primary="Professional Summary" secondary={formData.summary} />
              </ListItem>
            )}
          </List>
        )}
      </Paper>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2,
          }}
        >
          <Typography variant="h6">ThoughtWorks Experience</Typography>
          <Button startIcon={<EditIcon />} onClick={() => navigateToSection(1)} size="small">
            Edit
          </Button>
        </Box>

        {formData.thoughtworks_experiences.every(experienceEmpty) ? (
          <Typography color="text.secondary" sx={{ fontStyle: 'italic' }}>
            No ThoughtWorks experience provided.
          </Typography>
        ) : (
          formData.thoughtworks_experiences.map(
            (exp, index) =>
              !experienceEmpty(exp) && (
                <Box key={index} sx={{ mb: 2 }}>
                  {index > 0 && <Divider sx={{ my: 2 }} />}

                  <Typography variant="subtitle1" fontWeight="bold">
                    {exp.title || 'Untitled Position'}
                  </Typography>

                  {!isEmpty(exp.duration) && (
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      {exp.duration}
                    </Typography>
                  )}

                  {!isEmpty(exp.descriptions) && (
                    <Box sx={{ mt: 1 }}>
                      <Typography variant="body2" fontWeight="bold">
                        Responsibilities & Achievements:
                      </Typography>
                      <List dense sx={{ pl: 2 }}>
                        {exp.descriptions.map(
                          (desc, idx) =>
                            !isEmpty(desc) && (
                              <ListItem
                                key={idx}
                                sx={{
                                  display: 'list-item',
                                  listStyleType: 'disc',
                                  py: 0,
                                }}
                              >
                                <Typography variant="body2">{desc}</Typography>
                              </ListItem>
                            )
                        )}
                      </List>
                    </Box>
                  )}

                  {!isEmpty(exp.tech_stack) && (
                    <Box sx={{ mt: 1 }}>
                      <Typography variant="body2" fontWeight="bold">
                        Technologies Used:
                      </Typography>
                      <Box
                        sx={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: 0.5,
                          mt: 0.5,
                        }}
                      >
                        {exp.tech_stack
                          .split(',')
                          .map(
                            (tech, idx) =>
                              !isEmpty(tech.trim()) && (
                                <Chip
                                  key={idx}
                                  label={tech.trim()}
                                  size="small"
                                  variant="outlined"
                                />
                              )
                          )}
                      </Box>
                    </Box>
                  )}
                </Box>
              )
          )
        )}
      </Paper>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2,
          }}
        >
          <Typography variant="h6">Other Experience</Typography>
          <Button startIcon={<EditIcon />} onClick={() => navigateToSection(2)} size="small">
            Edit
          </Button>
        </Box>

        {formData.other_experiences.every(experienceEmpty) ? (
          <Typography color="text.secondary" sx={{ fontStyle: 'italic' }}>
            No other experience provided.
          </Typography>
        ) : (
          formData.other_experiences.map(
            (exp, index) =>
              !experienceEmpty(exp) && (
                <Box key={index} sx={{ mb: 2 }}>
                  {index > 0 && <Divider sx={{ my: 2 }} />}

                  <Typography variant="subtitle1" fontWeight="bold">
                    {exp.title || 'Untitled Position'}
                  </Typography>

                  {!isEmpty(exp.duration) && (
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      {exp.duration}
                    </Typography>
                  )}

                  {!isEmpty(exp.descriptions) && (
                    <Box sx={{ mt: 1 }}>
                      <Typography variant="body2" fontWeight="bold">
                        Responsibilities & Achievements:
                      </Typography>
                      <List dense sx={{ pl: 2 }}>
                        {exp.descriptions.map(
                          (desc, idx) =>
                            !isEmpty(desc) && (
                              <ListItem
                                key={idx}
                                sx={{
                                  display: 'list-item',
                                  listStyleType: 'disc',
                                  py: 0,
                                }}
                              >
                                <Typography variant="body2">{desc}</Typography>
                              </ListItem>
                            )
                        )}
                      </List>
                    </Box>
                  )}

                  {!isEmpty(exp.tech_stack) && (
                    <Box sx={{ mt: 1 }}>
                      <Typography variant="body2" fontWeight="bold">
                        Technologies Used:
                      </Typography>
                      <Box
                        sx={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: 0.5,
                          mt: 0.5,
                        }}
                      >
                        {exp.tech_stack
                          .split(',')
                          .map(
                            (tech, idx) =>
                              !isEmpty(tech.trim()) && (
                                <Chip
                                  key={idx}
                                  label={tech.trim()}
                                  size="small"
                                  variant="outlined"
                                />
                              )
                          )}
                      </Box>
                    </Box>
                  )}
                </Box>
              )
          )
        )}
      </Paper>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2,
          }}
        >
          <Typography variant="h6">Skills</Typography>
          <Button startIcon={<EditIcon />} onClick={() => navigateToSection(3)} size="small">
            Edit
          </Button>
        </Box>

        {formData.skills.every(skillEmpty) ? (
          <Typography color="text.secondary" sx={{ fontStyle: 'italic' }}>
            No skills provided.
          </Typography>
        ) : (
          formData.skills.map(
            (skill, index) =>
              !skillEmpty(skill) && (
                <Box key={index} sx={{ mb: 2 }}>
                  {index > 0 && <Divider sx={{ my: 2 }} />}

                  <Typography variant="subtitle1" fontWeight="bold">
                    {skill.title || 'Unlabeled Skill Category'}
                  </Typography>

                  {!isEmpty(skill.skills) && (
                    <Box
                      sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 0.5,
                        mt: 1,
                      }}
                    >
                      {skill.skills
                        .split(',')
                        .map(
                          (item, idx) =>
                            !isEmpty(item.trim()) && (
                              <Chip key={idx} label={item.trim()} size="small" />
                            )
                        )}
                    </Box>
                  )}
                </Box>
              )
          )
        )}
      </Paper>

      <Box sx={{ mt: 3, p: 2, backgroundColor: '#f9f9f9', borderRadius: 1 }}>
        <Typography variant="body2" color="text.secondary">
          <strong>Ready to generate?</strong> Click the 'Generate Resume' button below when you've
          reviewed all your information. You'll be able to preview your resume before downloading.
        </Typography>
      </Box>
    </React.Fragment>
  );
};

export default ReviewForm;
