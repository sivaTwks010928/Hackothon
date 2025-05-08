import os
import sys
import pytest
import tempfile
from pathlib import Path

# Add the parent directory to the path so tests can import app.py
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

@pytest.fixture
def sample_resume_data():
    """Fixture providing sample resume data for tests."""
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
                "tech_stack": "Python, Flask"
            }
        ],
        "other_experiences": [
            {
                "title": "Test Other Job",
                "duration": "2021-2023",
                "descriptions": ["Test description"],
                "tech_stack": "Java, Spring"
            }
        ],
        "skills": [
            {"title": "Languages", "skills": "Python, Java"}
        ]
    }

@pytest.fixture
def latex_special_chars():
    """Fixture providing strings with LaTeX special characters."""
    return {
        "simple": "Test & % $ # _ { } ~ ^",
        "csharp": "C# programming language",
        "complex": "Special chars: & % $ # _ { } ~ ^ \\ with C# code"
    }

@pytest.fixture
def temp_output_dir():
    """Fixture providing a temporary directory for test outputs."""
    with tempfile.TemporaryDirectory() as temp_dir:
        yield temp_dir 