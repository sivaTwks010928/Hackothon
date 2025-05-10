# Backend Tests for Resume Builder

This directory contains tests for the Resume Builder backend Flask application.

## Test Structure

- `test_app.py`: Tests for the Flask application routes and API endpoints
- `test_pdf_generation.py`: Tests for the PDF generation functionality with mocks
- `conftest.py`: Common test fixtures and configuration

## Running the Tests

Make sure you're in the virtual environment:

```bash
# From the backend directory
source venv-new/bin/activate
```

Install test dependencies:

```bash
pip install -r requirements.txt
```

### Running All Tests

```bash
python -m pytest
```

### Running with Coverage

```bash
python -m pytest --cov=.
```

For a coverage report:

```bash
python -m pytest --cov=. --cov-report=html
```

This will generate an HTML report in the `htmlcov` directory.

### Running Specific Tests

```bash
# Run a specific test file
python -m pytest tests/test_app.py

# Run a specific test function
python -m pytest tests/test_app.py::test_home_route
```

## Test Requirements

All tests use pytest. Required packages:
- pytest
- pytest-mock
- coverage

## Notes

- The tests use mocks to avoid actual PDF generation during testing
- The Flask app is tested in isolation without an actual server
- We use fixtures to provide common test data and setup 