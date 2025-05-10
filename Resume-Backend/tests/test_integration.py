import json
import os
import sys
from pathlib import Path
from unittest.mock import MagicMock, patch

import pytest

# Add the parent directory to the path so we can import modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
import pdf_generation
from app import app, escape_latex, sanitize_data


@pytest.fixture
def client():
    """Create a test client for the Flask app."""
    with app.test_client() as client:
        yield client


@pytest.fixture
def sample_resume_data():
    """Sample resume data fixture for tests."""
    return {
        "name": "Integration Test User",
        "preferred_pronouns": "They/Them",
        "role": "Software Developer",
        "summary": "Testing the integration between Flask and PDF generation",
        "thoughtworks_experiences": [
            {
                "title": "Integration Tester",
                "duration": "2023-2024",
                "descriptions": ["Tested integrations between components"],
                "tech_stack": "Python, Flask, pytest",
            }
        ],
        "other_experiences": [
            {
                "title": "Previous Tester",
                "duration": "2021-2023",
                "descriptions": ["Tested other systems"],
                "tech_stack": "Java, JUnit",
            }
        ],
        "skills": [
            {"title": "Testing", "skills": "Integration, Unit, System"},
            {"title": "Languages", "skills": "Python, Java, JavaScript"},
        ],
    }


def test_end_to_end_resume_flow(client, sample_resume_data):
    """Test the complete flow from API request to PDF generation."""
    # First, test the sample-data endpoint
    sample_response = client.get("/api/sample-data")
    assert sample_response.status_code == 200
    assert "name" in sample_response.json
    assert "skills" in sample_response.json

    # Use patch to mock the PDF generation but still test the processing path
    with patch("app.generate_resume_pdf") as mock_generate_pdf:
        # Setup the mock to return a "successful" PDF path
        mock_generate_pdf.return_value = "/tmp/test/fake_resume.pdf"

        # Mock os.path.exists to return True for our fake path
        with patch("os.path.exists", return_value=True):
            # Mock open() to provide test PDF content
            with patch("builtins.open", new_callable=MagicMock) as mock_open:
                # Configure the mock to return PDF content
                mock_file = MagicMock()
                mock_file.read.return_value = b"%PDF-fake test pdf content"
                mock_open.return_value.__enter__.return_value = mock_file

                # Send a POST request to generate a PDF
                response = client.post(
                    "/api/generate-pdf",
                    json=sample_resume_data,
                    headers={"Content-Type": "application/json"},
                )

                # Assert the API call was successful
                assert response.status_code == 200
                assert response.mimetype == "application/pdf"
                assert response.data.startswith(b"%PDF")

                # Verify that generate_resume_pdf was called
                mock_generate_pdf.assert_called_once()


def test_integration_with_pdf_module_mocking():
    """
    Test the integration between app.py and pdf_generation.py
    using mocks for the actual PDF generation component.
    """
    test_data = {
        "name": "Test User",
        "role": "Developer",
        "skills": [{"title": "Languages", "skills": "Python"}],
    }

    # Mock the template loading and rendering in pdf_generation
    with patch("jinja2.Environment.get_template") as mock_get_template:
        # Set up the mock template
        mock_template = MagicMock()
        mock_template.render.return_value = "Mocked LaTeX Content"
        mock_get_template.return_value = mock_template

        # Mock the subprocess call in pdf_generation
        with patch("pdf_generation.subprocess.run") as mock_run:
            # Configure subprocess.run to "succeed"
            mock_process = MagicMock()
            mock_process.returncode = 0
            mock_run.return_value = mock_process

            # Mock os path functions
            with patch("os.path.exists", return_value=True):
                # Mock the file open operations
                with patch("builtins.open", MagicMock()):
                    # Call the PDF generation function directly with test data
                    pdf_path = pdf_generation.generate_resume_pdf(
                        "/tmp/test", test_data
                    )

                    # Verify pdf_path is returned correctly when generation succeeds
                    assert pdf_path.endswith(".pdf")

                    # Verify subprocess.run was called with pdflatex
                    mock_run.assert_called_once()
                    cmd_args = mock_run.call_args[0][0]
                    assert "pdflatex" in cmd_args

                    # Test the failure case by changing mock behavior
                    mock_process.returncode = 1
                    pdf_path = pdf_generation.generate_resume_pdf(
                        "/tmp/test", test_data
                    )

                    # Should return None on failure
                    assert pdf_path is None


@patch("app.generate_resume_pdf")
def test_end_to_end_error_handling(mock_generate_pdf, client, sample_resume_data):
    """Test the error handling path in the application flow."""
    # Configure the mock to simulate an error in PDF generation
    mock_generate_pdf.return_value = None

    # Send a POST request to generate a PDF
    response = client.post(
        "/api/generate-pdf",
        json=sample_resume_data,
        headers={"Content-Type": "application/json"},
    )

    # Assert the API reports an error
    assert response.status_code == 500
    assert "error" in response.json

    # Test with an exception
    mock_generate_pdf.side_effect = Exception("Test error message")

    # Send a POST request to generate a PDF
    response = client.post(
        "/api/generate-pdf",
        json=sample_resume_data,
        headers={"Content-Type": "application/json"},
    )

    # Assert the API reports an error with the exception message
    assert response.status_code == 500
    assert "error" in response.json
    assert "Test error message" in response.json["error"]
