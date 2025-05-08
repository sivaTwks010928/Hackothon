#!/usr/bin/env bash
set -e

# Determine the script directory (project root)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Start backend server
echo "Starting backend server..."
cd "$SCRIPT_DIR/Resume-Backend"
source venv-new/bin/activate
echo "Installing backend dependencies (allowing system package override)..."
python -m pip install --break-system-packages -r requirements.txt
python app.py &
BACKEND_PID=$!

# Start frontend server
echo "Starting frontend server..."
cd "$SCRIPT_DIR/resume-frontend"
echo "Installing frontend dependencies..."
npm install --legacy-peer-deps
echo "Installing compatible AJV versions to fix module resolution..."
npm install ajv@6.12.6 ajv-keywords@3.5.2 --legacy-peer-deps
npm start

# When frontend server stops, shut down backend server
echo "Stopping backend server..."
kill $BACKEND_PID 