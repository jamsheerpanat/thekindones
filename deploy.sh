#!/bin/bash

# --- CONFIGURATION ---
VPS_USER="root"
VPS_IP="76.13.76.173"
VPS_PATH="/var/www/thekindones"
PM2_NAME="thekindones"
# ---------------------

echo "🚀 Starting Deployment Process..."

# 1. Local Git Operations
echo "📦 Step 1: Committing and Pushing to GitHub..."
git add .

# Get commit message from argument or prompt
if [ -z "$1" ]; then
    read -p "📝 Enter commit message: " msg
else
    msg="$1"
fi

if [ -z "$msg" ]; then
    msg="Deploying updates: $(date)"
fi

git commit -m "$msg"
git push origin main

if [ $? -ne 0 ]; then
    echo "❌ Git push failed. Deployment aborted."
    exit 1
fi

# 2. VPS Operations via SSH
echo "🌐 Step 2: Connecting to VPS ($VPS_IP) for deployment..."

ssh -t $VPS_USER@$VPS_IP << EOF
  set -e
  cd $VPS_PATH
  
  echo "📥 Pulling latest code from GitHub..."
  git pull origin main
  
  echo "🛠️ Installing dependencies..."
  npm install
  
  echo "🗄️ Syncing database schema..."
  npx prisma generate
  npx prisma db push --accept-data-loss
  
  echo "🏗️ Building the application (this may take a minute)..."
  npm run build
  
  echo "🔄 Restarting application with PM2..."
  pm2 restart $PM2_NAME || pm2 start npm --name "$PM2_NAME" -- start
  
  echo "🔍 Checking Nginx status..."
  sudo systemctl status nginx --no-pager
  
  echo "✅ Deployment on VPS finished successfully!"
  exit
EOF

echo "✨ All Done! Your changes are live at https://octolabs.cloud"
