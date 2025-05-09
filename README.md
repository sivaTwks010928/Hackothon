# Resume Builder Application

A full-stack application for building ThoughtWorks branded resumes with a professional PDF output.

## Architecture

- **Frontend**: React application with Material UI
- **Backend**: Flask API with LaTeX PDF generation
- **Deployment**: AWS ECS (Fargate) via Terraform
- **CI/CD**: GitHub Actions

## Local Development

### Prerequisites

- Docker and Docker Compose
- Node.js 16+
- Python 3.10+
- AWS CLI (for deployment)

### Running Locally

The simplest way to run the application locally is using the start script:

```bash
chmod +x start.sh
./start.sh
```

This will:
1. Check and kill any existing backend service running on port 5001
2. Start the backend server in a Python virtual environment
3. Install all dependencies for both frontend and backend
4. Start the frontend development server

### Using Docker Compose

You can use Docker Compose for a containerized application:

```bash
docker-compose up
```

#### Development vs Production Mode

Docker Compose can be configured for two modes:

1. **Production Mode (default)**: 
   - Uses the regular Dockerfiles
   - Builds optimized, production-ready containers
   - More stable but doesn't support hot reloading
   - Frontend runs on Nginx, backend on Gunicorn

2. **Development Mode**:
   - Uses `Dockerfile.dev` for both services
   - Supports hot reloading (code changes reflect immediately)
   - To use development mode, uncomment the development configuration in `docker-compose.yml`

The application will be available at:
- Frontend: http://localhost:3001
- Backend API: http://localhost:5001

## CI/CD Pipeline

This project uses GitHub Actions for CI/CD, which:

1. Builds Docker images for both frontend and backend
2. Pushes images to Amazon ECR
3. Deploys infrastructure using Terraform
4. Updates ECS services with new image versions

### Setting up the Pipeline

Add the following secrets to your GitHub repository:

- `AWS_ACCESS_KEY_ID`: Your AWS access key
- `AWS_SECRET_ACCESS_KEY`: Your AWS secret key
- `AWS_REGION`: AWS region (e.g., us-east-1)

## Infrastructure

The infrastructure is managed with Terraform and includes:

- VPC with public and private subnets
- Application Load Balancer
- ECS Cluster with Fargate tasks
- ECR repositories for Docker images
- CloudWatch Logs
- Security Groups
- IAM roles and policies

### Initial Terraform Setup

Before the first GitHub Actions run, you need to:

1. Create an S3 bucket for Terraform state:

```bash
aws s3 mb s3://resume-builder-tf-state
```

2. Create the ECR repositories:

```bash
aws ecr create-repository --repository-name resume-frontend
aws ecr create-repository --repository-name resume-backend
```

## Deployment

The application is automatically deployed when changes are pushed to the main branch.

For manual deployment:

1. Build and push Docker images:

```bash
# Login to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <your-aws-account-id>.dkr.ecr.us-east-1.amazonaws.com

# Build and push backend
cd Resume-Backend
docker build -t <your-ecr-repo-url>/resume-backend:latest .
docker push <your-ecr-repo-url>/resume-backend:latest

# Build and push frontend
cd ../resume-frontend
docker build -t <your-ecr-repo-url>/resume-frontend:latest .
docker push <your-ecr-repo-url>/resume-frontend:latest
```

2. Apply Terraform changes:

```bash
cd ../terraform
terraform init
terraform apply
```

## Accessing the Application

After deployment, the application will be available at the Load Balancer DNS name, which can be found in the Terraform outputs:

```bash
cd terraform
terraform output load_balancer_dns
``` 