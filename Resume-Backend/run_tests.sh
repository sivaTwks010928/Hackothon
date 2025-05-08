#!/bin/bash

# Activate the virtual environment
source venv-new/bin/activate

# Run the tests with coverage
python -m pytest --cov=. --cov-report=term-missing tests/

# Generate HTML coverage report
echo "Generating HTML coverage report..."
python -m pytest --cov=. --cov-report=html tests/

echo "Tests completed. HTML coverage report is available in the htmlcov directory."
echo "Open htmlcov/index.html in your browser to view the report." 