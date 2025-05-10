export interface Skill {
  title: string;
  skills: string;
}

export interface Experience {
  title: string;
  duration: string;
  descriptions: string[];
  tech_stack: string;
}

export interface ResumeFormData {
  name: string;
  preferred_pronouns: string;
  role: string;
  summary: string;
  thoughtworks_experiences: Experience[];
  other_experiences: Experience[];
  skills: Skill[];
}

export const defaultFormData: ResumeFormData = {
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
}; 