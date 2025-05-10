FROM python:3.10-slim

WORKDIR /app

# Install LaTeX dependencies
RUN apt-get update && apt-get install -y \
    texlive-latex-base \
    texlive-fonts-recommended \
    texlive-fonts-extra \
    texlive-latex-extra \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first to leverage Docker caching
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Set default environment variables
ARG FLASK_ENV=production
ENV FLASK_ENV=$FLASK_ENV
ENV FLASK_APP=app.py

# Expose the port the app runs on
EXPOSE 5001

# Command to run the application
CMD ["gunicorn", "--bind", "0.0.0.0:5001", "app:app"]
