#!/bin/bash

# Curalink Deployment Script for Google Cloud VPS
# This script automates the deployment process

echo "🚀 Starting Curalink deployment on Google Cloud VPS..."

# Update system
echo "📦 Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install Node.js 18.x
echo "📦 Installing Node.js..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install essential packages
echo "📦 Installing Git, PM2, and Nginx..."
sudo apt install git -y
sudo npm install -g pm2
sudo apt install nginx -y

# Start and enable Nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# Clone or update project
if [ -d "curalink-full-stack" ]; then
    echo "📁 Updating existing project..."
    cd curalink-full-stack
    git pull origin main
else
    echo "📁 Cloning project repository..."
    git clone https://github.com/yourusername/curalink-full-stack.git
    cd curalink-full-stack
fi

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install

# Check if .env exists, create if not
if [ ! -f ".env" ]; then
    echo "⚙️  Creating .env file from template..."
    cp .env.example .env
    echo "⚠️  Please edit backend/.env with your production values!"
fi

cd ..

# Install frontend dependencies and build
echo "📦 Installing frontend dependencies..."
cd frontend
npm install
echo "🏗️  Building frontend for production..."
npm run build

# Install serve for production
npm install -g serve

cd ..

# Start applications with PM2
echo "🚀 Starting applications with PM2..."
pm2 start ecosystem.config.js
pm2 save
pm2 startup

# Setup Nginx configuration
echo "⚙️  Setting up Nginx configuration..."
sudo tee /etc/nginx/sites-available/curalink > /dev/null << 'EOF'
server {
    listen 80;
    server_name _;  # Replace with your domain or IP

    # Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend API
    location /api/ {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

# Enable Nginx site
sudo ln -sf /etc/nginx/sites-available/curalink /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Test and restart Nginx
sudo nginx -t
if [ $? -eq 0 ]; then
    sudo systemctl restart nginx
    echo "✅ Nginx configuration successful!"
else
    echo "❌ Nginx configuration error!"
    exit 1
fi

# Setup firewall
echo "🔥 Setting up firewall..."
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw --force enable

# Display status
echo "📊 Deployment status:"
echo "=================="
pm2 status
echo ""
echo "🌐 Your application should be accessible at:"
echo "   http://$(curl -s ifconfig.me)"
echo ""
echo "📋 Useful commands:"
echo "   pm2 status          - Check application status"
echo "   pm2 logs            - View application logs"
echo "   pm2 restart all     - Restart all applications"
echo "   sudo systemctl status nginx - Check Nginx status"
echo ""
echo "✅ Deployment completed successfully!"
echo "⚠️  Remember to:"
echo "   1. Edit backend/.env with your production values"
echo "   2. Set up your domain name if desired"
echo "   3. Configure SSL certificate with certbot for HTTPS"
