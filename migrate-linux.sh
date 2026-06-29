#!/bin/bash

# ==============================================================================
# KMG Training Management System (TMS) - Linux Migration & Service Setup Script
# ==============================================================================
#
# This script automates and documents the migration of KMG TMS from Windows to
# a Linux server environment (e.g., Ubuntu/Debian) using standard 'nohup' processes.
#
# Usage:
#   chmod +x migrate-linux.sh
#   ./migrate-linux.sh
#

echo "=== Starting Linux Migration Setup (nohup Mode) ==="

# 1. Check for Node.js and NPM
echo "Checking prerequisites..."
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed. Please install Node.js v18+."
    exit 1
fi
if ! command -v npm &> /dev/null; then
    echo "ERROR: NPM is not installed. Please install npm."
    exit 1
fi
echo "Node.js version: $(node -v)"
echo "NPM version: $(npm -v)"

# 2. Setup configurations
echo "Initializing environment files..."

# Get Local IP Address
LOCAL_IP=$(hostname -I | awk '{print $1}')
if [ -z "$LOCAL_IP" ]; then
    LOCAL_IP="localhost"
fi
echo "Detected Server Local IP: $LOCAL_IP"

# Backend configuration (.env)
cat <<EOT > server/.env
PORT=5001
NODE_ENV=production
MONGODB_URI=mongodb+srv://mohammedsuhail100506:mongo10@cluster0.zjpg81g.mongodb.net/kmg_tms
JWT_SECRET=super_secret_kms_tms_jwt_access_key_2026
JWT_ACCESS_EXPIRY=8h
JWT_REFRESH_SECRET=super_secret_kms_tms_jwt_refresh_key_2026
JWT_REFRESH_EXPIRY=7d
FRONTEND_URL=http://$LOCAL_IP:5173
MAX_FILE_SIZE_MB=10
UPLOAD_TEMP_DIR=./uploads/temp
DEFAULT_FY_START_MONTH=4
EOT
echo "Created server/.env (pointing to http://$LOCAL_IP:5173)"

# Frontend configuration (.env)
cat <<EOT > client/.env
VITE_API_URL=http://$LOCAL_IP:5001/api/v1
EOT
echo "Created client/.env (pointing to http://$LOCAL_IP:5001/api/v1)"

# 3. Install dependencies
echo "Installing server dependencies..."
cd server
npm install --omit=dev
cd ..

echo "Installing client dependencies..."
cd client
npm install
cd ..

echo "=== Linux Migration Setup Complete ==="
echo ""
echo "--------------------------------------------------------"
echo "HOW TO START SERVICES ON LINUX (via nohup):"
echo "--------------------------------------------------------"
echo "To start the backend server in background:"
echo "  cd server"
echo "  nohup node server.js > backend.log 2>&1 &"
echo ""
echo "To start the frontend client in background:"
echo "  cd client"
echo "  nohup npm run dev -- --host > client.log 2>&1 &"
echo ""
echo "--------------------------------------------------------"
echo "HOW TO RESTART/STOP SERVICES ON LINUX:"
echo "--------------------------------------------------------"
echo "To stop the backend service (port 5001):"
echo "  fuser -k 5001/tcp"
echo ""
echo "To stop the frontend service (port 5173):"
echo "  fuser -k 5173/tcp"
echo ""
echo "To restart both services (stop then start):"
echo "  fuser -k 5001/tcp 5173/tcp"
echo "  cd server && nohup node server.js > backend.log 2>&1 &"
echo "  cd ../client && nohup npm run dev -- --host > client.log 2>&1 &"
echo "--------------------------------------------------------"
