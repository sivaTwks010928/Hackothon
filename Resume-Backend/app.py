import os
import json
import subprocess
from pathlib import Path
from jinja2 import Environment, FileSystemLoader
import re
from flask import Flask, request, jsonify, send_file, Response, g
from flask_cors import CORS
import tempfile
import shutil

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Utility functions from generate_twks_resume_latex.py
def escape_latex(text):
    """Escape LaTeX special characters."""
    if not text:
        return ""
    
    conv = {
        '&': r'\\&',
        '%': r'\\%',
        '$': r'\\$',
        '#': r'\\#',
        '_': r'\\_',
        '{': r'\\{',
        '}': r'\\}',
        '~': r'\\textasciitilde{}',
        '^': r'\\textasciicircum{}',
        '\\\\': r'\\textbackslash{}',
    }
    regex = re.compile('|'.join(re.escape(str(key)) for key in conv.keys()))
    return regex.sub(lambda match: conv[match.group()], text)


def compile_latex_to_pdf(tex_file, output_dir):
    """Compile the LaTeX file to PDF."""
    command = ["pdflatex", "-interaction=nonstopmode", "-output-directory", output_dir, tex_file]
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


def generate_resume_pdf(data, template_name='twks_resume_template.tex', output_dir='output'):
    """Generate a PDF from the resume data."""
    env = Environment(loader=FileSystemLoader(os.path.join(os.path.dirname(__file__), 'templates')), autoescape=False)
    template = env.get_template(template_name)

    sanitized_data = sanitize_data(data)
    filled_tex = template.render(**sanitized_data)

    # Create a temporary directory for output
    Path(output_dir).mkdir(parents=True, exist_ok=True)
    tex_path = os.path.join(output_dir, 'resume.tex')
    pdf_path = tex_path.replace('.tex', '.pdf')

    with open(tex_path, 'w') as f:
        f.write(filled_tex)

    success = compile_latex_to_pdf(str(tex_path), output_dir)
    if success:
        print(f"✅ PDF successfully generated at: {pdf_path}")
        return pdf_path
    else:
        print("❌ Failed to generate PDF.")
        return None


# Sample data for testing
sample_data = {
    "name": "Janani P",
    "preferred_pronouns": "She/Her",
    "role": "Quality Analyst",
    "summary": (
        "Janani P, a seasoned Quality Analyst at Thoughtworks, boasts an impressive track record "
        "of over 18 months of hands-on experience in software testing and quality assurance. Her career "
        "is marked by her adeptness in navigating complex software lifecycles and her dedication to "
        "enhancing product quality through innovative automation strategies and rigorous testing protocols. "
        "With a profound expertise in automation testing tools and methodologies, she has significantly "
        "contributed to various high-stakes projects, ensuring software reliability and client satisfaction."
    ),
    "thoughtworks_experiences": [
        {
            "title": "Advanced Enterprise Solutions - QA Lead",
            "duration": "January 2024 - Present",
            "descriptions": [
                "In her current role as QA Lead, Janani oversees a team of 10 QA engineers, directing comprehensive testing strategies for advanced enterprise-level software solutions. Her leadership has been pivotal in reshaping the testing framework to incorporate continuous integration and delivery, which has drastically reduced the regression testing cycle time by 40%.",
                "She has successfully implemented a shift-left testing approach, integrating early testing processes that involve collaboration between developers, testers, and users to ensure early detection of defects. This approach has not only improved the product quality but has also reduced the cost of fixing bugs by catching them early in the development process.",
                "Under her guidance, her team has developed a proprietary automated testing tool that leverages machine learning to predict areas of high risk and dynamically allocate testing resources. This tool has been instrumental in optimizing testing efforts and has been recognized by industry experts at several tech conferences.",
                "Janani has also curated a series of workshops and training programs for junior testers, focusing on the latest testing technologies and best practices. Her efforts have greatly enhanced team competency and maintained high morale, leading to a 30% increase in team productivity.",
                "Her strategic foresight in adopting new technologies and methodologies has been crucial in maintaining the company's competitive edge, ensuring that they stay ahead in the rapidly evolving tech landscape."
            ],
            "tech_stack": "Selenium, Jenkins, Python, Java, TestNG, Machine Learning"
        },
        {
            "title": "Fintech Innovations - Automation Tester",
            "duration": "June 2023 - December 2023",
            "descriptions": [
                "Janani played a key role in a fintech project where she designed and executed automation scripts for a complex financial application that handles real-time transaction processing. Her expertise in Selenium and Python was critical in developing robust test suites that ensured the application's reliability and performance under peak loads.",
                "Her innovative testing strategies, including the use of data-driven and keyword-driven frameworks, allowed for flexible and extensive coverage of numerous test scenarios, which significantly reduced unforeseen operational risks post-deployment.",
                "She was actively involved in cross-functional meetings, providing insightful feedback and suggestions that have led to improvements in application security and user interface design, greatly enhancing user satisfaction and security measures.",
                "Janani's detailed documentation and reports on testing outcomes have provided valuable insights for ongoing optimization, helping the product team prioritize feature updates and bug fixes effectively.",
                "Her commitment to quality and her ability to work under tight deadlines were highly commended by the project stakeholders, setting a benchmark for future projects within the company."
            ],
            "tech_stack": "Selenium, Python, JIRA, Postman, REST Assured"
        }
    ],
    "other_experiences": [
        {
            "title": "Tech Solutions Corp - Senior Test Analyst",
            "duration": "January 2022 - May 2023",
            "descriptions": [
                "At Tech Solutions Corp, Janani was responsible for leading the QA efforts for a suite of high-availability, mission-critical software products. Her role involved extensive collaboration with international teams to synchronize testing activities and ensure a unified approach to quality.",
                "She developed an automated test environment from the ground up, which supported continuous testing and integration. This environment reduced the product's time to market by accelerating the testing phases and improving feedback loops for the development team.",
                "Her proactive approach to incorporating user feedback into the early stages of testing helped in tailoring the products to better meet the customer needs, which significantly enhanced customer satisfaction and loyalty.",
                "Janani's ability to quickly adapt to new testing tools and technologies allowed her to continuously improve the testing practices at Tech Solutions Corp, keeping them up-to-date with industry standards.",
                "Her contributions were critical during the regulatory compliance audits, where her detailed understanding of compliance requirements ensured that all software products met stringent standards, avoiding potential legal and financial repercussions."
            ],
            "tech_stack": "Cucumber, Gherkin, Selenium Grid, Jenkins, Docker"
        },
        {
            "title": "Innovative Web Solutions - QA Consultant",
            "duration": "March 2020 - December 2021",
            "descriptions": [
                "Janani was a key consultant at Innovative Web Solutions, where she led the quality assurance for several web-based applications. Her role involved designing and implementing a comprehensive test strategy that covered all aspects of web security, usability, and performance.",
                "She introduced an innovative automated testing framework that utilized Selenium and Cucumber, enhancing the company's testing capabilities and allowing for more rigorous and systematic testing procedures.",
                "Her efforts in streamlining the communication between the development and QA teams resulted in a more efficient bug tracking and resolution process, which improved the overall development cycle time by 25%.",
                "Janani also played a crucial role in client engagements, providing technical expertise and assurance about the product's quality, which helped in securing several key contracts and fostering long-term client relationships.",
                "Her commitment to maintaining up-to-date industry knowledge and best practices not only enhanced her team's capabilities but also positioned the company as a leader in quality assurance for web solutions."
            ],
            "tech_stack": "Selenium, Cucumber, JavaScript, Jenkins, AWS"
        }
    ],
    "skills": [
        {"title": "Programming Languages", "skills": "Java, JavaScript, Python, C#"},
        {"title": "Automation Tools", "skills": "Selenium, Appium, Jenkins, Maven"},
        {"title": "Testing Frameworks", "skills": "TestNG, JUnit, Mockito"},
        {"title": "Continuous Integration/Continuous Deployment", "skills": "Jenkins, GitLab CI, CircleCI"},
        {"title": "Project Management Tools", "skills": "JIRA, Asana, Trello"},
        {"title": "Databases", "skills": "MySQL, PostgreSQL, MongoDB"},
        {"title": "API Testing Tools", "skills": "Postman, Swagger, REST Assured"},
        {"title": "Performance Testing Tools", "skills": "JMeter, LoadRunner"},
        {"title": "Security Testing Tools", "skills": "OWASP, ZAP"},
        {"title": "Mobile Testing", "skills": "Appium, Mobile Device Management, Cross-Browser Testing"},
        {"title": "Certifications", "skills": "ISTQB Certified Tester, Certified Selenium Professional"}
    ]
}


# API routes
@app.route('/')
def home():
    return jsonify({"message": "Resume Builder API is running!"})


@app.route('/api/generate-pdf', methods=['POST'])
def generate_pdf():
    # Create a temporary directory for output
    temp_dir = None

    try:
        # Get JSON data from request
        data = request.json
        if not data:
            return jsonify({"error": "No data provided"}), 400

        # Create a temporary directory for output
        temp_dir = tempfile.mkdtemp()
        
        # Generate the PDF
        pdf_path = generate_resume_pdf(data, output_dir=temp_dir)
        
        if not pdf_path or not os.path.exists(pdf_path):
            if temp_dir and os.path.exists(temp_dir):
                shutil.rmtree(temp_dir)
            return jsonify({"error": "Failed to generate PDF"}), 500

        # Read the file content
        with open(pdf_path, 'rb') as f:
            pdf_content = f.read()
        
        # Clean up the temporary directory
        if temp_dir and os.path.exists(temp_dir):
            shutil.rmtree(temp_dir)
            
        # Create response with PDF content
        response = Response(pdf_content, mimetype='application/pdf')
        response.headers['Content-Disposition'] = 'attachment; filename=resume.pdf'
        return response

    except Exception as e:
        if temp_dir and os.path.exists(temp_dir):
            shutil.rmtree(temp_dir)
        return jsonify({"error": str(e)}), 500


@app.route('/api/sample-data', methods=['GET'])
def get_sample_data():
    return jsonify(sample_data)


if __name__ == '__main__':
    # Ensure required directories exist
    os.makedirs(os.path.join(os.path.dirname(__file__), 'templates'), exist_ok=True)
    os.makedirs(os.path.join(os.path.dirname(__file__), 'static'), exist_ok=True)
    
    # Run the Flask app
    app.run(debug=True, host='0.0.0.0', port=5001) 