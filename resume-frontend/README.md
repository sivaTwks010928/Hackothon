# Resume Builder Frontend

A React-based frontend for a professional resume builder application. This frontend allows users to create, edit, and generate professional resumes through a step-by-step form process.

## Features

- Multi-step form with intuitive navigation
- Personal information collection
- Work experience (ThoughtWorks and other companies)
- Skills categorization
- PDF resume generation
- Real-time preview
- Responsive design with Material-UI
- Interactive tour guide for new users

## Technology Stack

- React 19
- TypeScript
- Material-UI components
- Axios for HTTP requests
- React-Joyride for interactive tours

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone this repository:

   ```
   git clone https://github.com/sivaTwks010928/Resume-Frontend.git
   cd Resume-Frontend
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```
   This will run the app in development mode at [http://localhost:3001](http://localhost:3001).

### Connection to Backend

The frontend connects to the Resume Builder Backend API running on `http://localhost:5001`. Make sure the backend server is running before using the PDF generation features.

## Usage

1. Fill out the personal information form
2. Add your ThoughtWorks experiences
3. Add your other professional experiences
4. Categorize your skills
5. Review your information
6. Generate and download your professional resume as a PDF

## Folder Structure

```
resume-frontend/
├── public/             # Public assets
├── src/                # Source code
│   ├── components/     # React components
│   ├── types/          # TypeScript interfaces
│   ├── App.tsx         # Main application component
│   └── index.tsx       # Entry point
└── package.json        # Dependencies and scripts
```

## License

This project is licensed under the MIT License.
