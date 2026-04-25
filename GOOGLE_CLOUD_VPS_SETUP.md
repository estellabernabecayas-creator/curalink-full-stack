# Google Cloud VPS Setup Guide for Curalink Project

## Overview
This guide shows how to set up a free VPS on Google Cloud Platform using your $300 free credits to avoid the 5-minute limit for your Curalink healthcare application.

## Prerequisites
- Google Cloud Platform account with $300 free credits
- Your Curalink project (Node.js backend + React frontend)

## Step 1: Create Google Cloud Account

1. Visit [Google Cloud Console](https://console.cloud.google.com/getting-started)
2. Click **"Try For Free"**
3. Fill out all required information including valid credit card
4. **Important**: Google won't charge your card even if you use all $300 credits
5. Your free trial starts with $300 credit valid for 90 days

## Step 2: Set Up Free VPS (f1-micro instance)

### Instance Configuration
1. Go to [Compute Engine](https://console.cloud.google.com/compute/)
2. Click **"Create Instance"**
3. Configure with these settings:

**Basic Settings:**
- **Name**: `curalink-vps`
- **Region**: `us-central1` (Iowa) OR `us-east1` (South Carolina) OR `us-west1` (Oregon)
- **Machine type**: `f1-micro` (1 shared CPU, 614 MB RAM)
- **Series**: `N1`

**Boot Disk:**
- **Operating System**: Ubuntu 22.04 LTS
- **Size**: 30 GB (included in free tier)

**Firewall**: 
- Check both **"Allow HTTP"** and **"Allow HTTPS"**

**CRITICAL**: Verify it shows "Free usage time: 720 hours/month" before creating!

## Step 3: Connect to VPS via SSH

1. After instance creation, click the **SSH** dropdown
2. Select **"Open in browser window"**
3. You'll get a terminal session in your browser

## Step 4: Setup VPS Environment

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js (v18+)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install Git
sudo apt install git -y

# Install PM2 for process management
sudo npm install -g pm2

# Install Nginx for reverse proxy
sudo apt install nginx -y

# Start and enable Nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

## Step 5: Deploy Your Curalink Application

### Clone Your Project
```bash
# Clone your repository (replace with your actual repo)
git clone https://github.com/yourusername/curalink-full-stack.git
cd curalink-full-stack
```

### Setup Backend
```bash
cd backend
npm install

# Create production .env file
cp .env.example .env
# Edit .env with your production values
nano .env
```

### Setup Frontend
```bash
cd ../frontend
npm install
npm run build
```

## Step 6: Configure PM2

Create `ecosystem.config.js` in project root:

```javascript
module.exports = {
  apps: [
    {
      name: 'curalink-backend',
      script: './backend/server.js',
      cwd: './backend',
      env: {
        NODE_ENV: 'production',
        PORT: 4000
      }
    },
    {
      name: 'curalink-frontend',
      script: 'npx',
      args: 'serve -s dist -l 3000',
      cwd: './frontend',
      env: {
        NODE_ENV: 'production'
      }
    }
  ]
};
```

Start applications:
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

## Step 7: Configure Nginx Reverse Proxy

Create Nginx config:
```bash
sudo nano /etc/nginx/sites-available/curalink
```

Add this configuration:
```nginx
server {
    listen 80;
    server_name your-domain.com;  # Replace with your domain or IP

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
```

Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/curalink /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## Step 8: Setup SSL Certificate (Optional but Recommended)

```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d your-domain.com
```

## Step 9: Monitor and Maintain

### Check application status:
```bash
pm2 status
pm2 logs
```

### Check system resources:
```bash
free -h
df -h
htop
```

### Restart applications if needed:
```bash
pm2 restart all
```

## Important Notes

### Free Tier Limits:
- **f1-micro instance**: Always free (in US regions)
- **30 GB storage**: Always free
- **1 GB/month egress traffic**: Always free
- **$300 credit**: Valid for 90 days

### Cost Management:
1. Monitor your billing dashboard regularly
2. Set up billing alerts
3. Stay within free tier limits after credits expire
4. The f1-micro instance remains free even after trial ends

### Security:
- Use strong passwords
- Keep system updated
- Configure firewall properly
- Use HTTPS in production

### Performance Tips:
- The f1-micro has limited resources (614 MB RAM)
- Monitor memory usage with `pm2 monit`
- Consider optimizing your application for low memory usage
- Use swap file if needed (2 GB recommended)

## Troubleshooting

### Common Issues:
1. **Instance not starting**: Check region selection (must be US regions)
2. **Application crashes**: Check logs with `pm2 logs`
3. **High memory usage**: Restart with `pm2 restart all`
4. **Nginx errors**: Check config with `sudo nginx -t`

### Getting Help:
- Google Cloud documentation
- PM2 documentation
- Nginx documentation

This setup will keep your Curalink application running 24/7 without the 5-minute limit, using Google's free tier and your $300 credits for any additional resources needed.
