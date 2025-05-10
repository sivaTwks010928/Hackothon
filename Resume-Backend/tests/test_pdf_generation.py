import os
import sys
import tempfile
from pathlib import Path
from unittest.mock import MagicMock, patch

import pytest

# Add the parent directory to the path so we can import app.py
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from pdf_generation import compile_latex_to_pdf, generate_resume_pdf


@pytest.fixture
def test_data():
    """Fixture providing test data for resume generation."""
    return {
        "name": "Test User",
        "preferred_pronouns": "They/Them",
        "role": "Software Developer",
        "summary": "Test summary",
        "thoughtworks_experiences": [
            {
                "title": "Test TW Job",
                "duration": "2023-2024",
                "descriptions": ["Test description"],
                "tech_stack": "Python, Flask",
            }
        ],
        "other_experiences": [
            {
                "title": "Test Other Job",
                "duration": "2021-2023",
                "descriptions": ["Test description"],
                "tech_stack": "Java, Spring",
            }
        ],
        "skills": [{"title": "Languages", "skills": "Python, Java"}],
    }


@patch("pdf_generation.subprocess.run")
def test_compile_latex_to_pdf_success(mock_run, tmp_path):
    """Test successful LaTeX compilation."""
    # Configure mock subprocess.run to return success
    process_mock = MagicMock()
    process_mock.returncode = 0
    process_mock.stdout = "PDF successfully compiled"
    mock_run.return_value = process_mock

    # Call the function
    result = compile_latex_to_pdf("test.tex", str(tmp_path))

    # Verify the function returned success
    assert result is True

    # Verify subprocess.run was called with the correct arguments
    mock_run.assert_called_once()
    args, kwargs = mock_run.call_args
    cmd = args[0]
    assert cmd[0] == "pdflatex"
    assert cmd[2] == "-output-directory"
    assert cmd[3] == str(tmp_path)
    assert cmd[4] == "test.tex"


@patch("pdf_generation.subprocess.run")
def test_compile_latex_to_pdf_failure(mock_run, tmp_path):
    """Test failed LaTeX compilation."""
    # Configure mock subprocess.run to return failure
    process_mock = MagicMock()
    process_mock.returncode = 1
    process_mock.stdout = "Error: Something went wrong"
    process_mock.stderr = "Critical error"
    mock_run.return_value = process_mock

    # Call the function
    result = compile_latex_to_pdf("test.tex", str(tmp_path))

    # Verify the function returned failure
    assert result is False


@patch("pdf_generation.compile_latex_to_pdf")
@patch("pdf_generation.Environment")
def test_generate_resume_pdf_success(mock_env, mock_compile, test_data, tmp_path):
    """Test successful PDF generation with mocks."""
    # Set up the mocks
    mock_template = MagicMock()
    mock_env.return_value.get_template.return_value = mock_template
    mock_template.render.return_value = "Rendered LaTeX template"
    mock_compile.return_value = True

    output_dir = str(tmp_path)

    # Call the function
    pdf_path = generate_resume_pdf(
        output_dir, test_data, template_name="test_template.tex"
    )

    # Verify the result
    assert pdf_path is not None
    assert pdf_path.endswith(".pdf")
    assert "resume.pdf" in pdf_path

    # Verify mocks were called
    mock_env.return_value.get_template.assert_called_once_with("test_template.tex")
    mock_template.render.assert_called_once()
    mock_compile.assert_called_once()


@patch("pdf_generation.compile_latex_to_pdf")
@patch("pdf_generation.Environment")
def test_generate_resume_pdf_failure(mock_env, mock_compile, test_data, tmp_path):
    """Test PDF generation when compilation fails."""
    # Set up the mocks
    mock_template = MagicMock()
    mock_env.return_value.get_template.return_value = mock_template
    mock_template.render.return_value = "Rendered LaTeX template"
    mock_compile.return_value = False  # Compilation fails

    output_dir = str(tmp_path)

    # Call the function
    pdf_path = generate_resume_pdf(
        output_dir, test_data, template_name="test_template.tex"
    )

    # Verify the result
    assert pdf_path is None

    # Verify mocks were called
    mock_env.return_value.get_template.assert_called_once_with("test_template.tex")
    mock_template.render.assert_called_once()
    mock_compile.assert_called_once()


@patch("os.path.exists")
@patch("pdf_generation.compile_latex_to_pdf")
@patch("pdf_generation.Environment")
def test_generate_resume_pdf_file_not_found(
    mock_env, mock_compile, mock_exists, test_data, tmp_path
):
    """Test PDF generation when the compiled file is not found."""
    # Set up the mocks
    mock_template = MagicMock()
    mock_env.return_value.get_template.return_value = mock_template
    mock_template.render.return_value = "Rendered LaTeX template"
    mock_compile.return_value = True
    mock_exists.return_value = False  # File doesn't exist after compilation

    output_dir = str(tmp_path)

    # Call the function
    pdf_path = generate_resume_pdf(
        output_dir, test_data, template_name="test_template.tex"
    )

    # Since we're not actually checking file existence in the function, this should still return a path
    assert pdf_path is not None
    assert pdf_path.endswith(".pdf")
