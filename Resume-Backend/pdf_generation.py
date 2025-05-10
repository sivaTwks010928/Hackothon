import os
import re
import subprocess
from pathlib import Path

from jinja2 import Environment, FileSystemLoader


def escape_latex(text):
    """Escape LaTeX special characters."""
    if not text:
        return ""

    conv = {
        "&": r"\\&",
        "%": r"\\%",
        "$": r"\\$",
        "#": r"\\#",
        "_": r"\\_",
        "{": r"\\{",
        "}": r"\\}",
        "~": r"\\textasciitilde{}",
        "^": r"\\textasciicircum{}",
        "\\\\": r"\\textbackslash{}",
    }
    regex = re.compile("|".join(re.escape(str(key)) for key in conv.keys()))
    return regex.sub(lambda match: conv[match.group()], text)


def compile_latex_to_pdf(tex_file, output_dir):
    """Compile the LaTeX file to PDF."""
    command = [
        "pdflatex",
        "-interaction=nonstopmode",
        "-output-directory",
        output_dir,
        tex_file,
    ]
    result = subprocess.run(command, capture_output=True, text=True)
    if result.returncode != 0:
        print(f"Error compiling LaTeX file {tex_file}:")
        print(result.stdout)
        print(result.stderr)
        return False
    return True


def sanitize_data(data):
    """Recursively escape special chars in data."""
    if isinstance(data, str):
        # Special handling for C# language reference
        data = data.replace("C#", "C\\#")
        return escape_latex(data)
    elif isinstance(data, list):
        return [sanitize_data(item) for item in data]
    elif isinstance(data, dict):
        return {key: sanitize_data(value) for key, value in data.items()}
    return data


def generate_resume_pdf(output_dir, data, template_name="twks_resume_template.tex"):
    """Generate a PDF from the resume data."""
    # Using Path to get the directory of the current file
    current_dir = os.path.dirname(os.path.abspath(__file__))
    env = Environment(
        loader=FileSystemLoader(os.path.join(current_dir, "templates")),
        autoescape=False,
    )
    template = env.get_template(template_name)

    sanitized_data = sanitize_data(data)
    filled_tex = template.render(**sanitized_data)

    # Create a temporary directory for output
    Path(output_dir).mkdir(parents=True, exist_ok=True)
    tex_path = os.path.join(output_dir, "resume.tex")
    pdf_path = tex_path.replace(".tex", ".pdf")

    with open(tex_path, "w") as f:
        f.write(filled_tex)

    success = compile_latex_to_pdf(str(tex_path), output_dir)
    if success:
        print(f"✅ PDF successfully generated at: {pdf_path}")
        return pdf_path
    else:
        print("❌ Failed to generate PDF.")
        return None
