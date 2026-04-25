# Self-Hosted Jitsi Meet Server Setup (No 5-Minute Limit)

## Overview
This guide sets up your own Jitsi Meet server on Google Cloud VPS to eliminate the 5-minute demo limit from meet.jit.si.

## ⚠️ IMPORTANT: Upgrade VPS Instance Type

The f1-micro (614 MB RAM) is **NOT sufficient** for Jitsi. You need:
- **Minimum**: e2-medium (2 vCPU, 4 GB RAM) 
- **Recommended**: e2-standard-2 (2 vCPU, 8 GB RAM)

**Cost**: ~$24-48/month, but covered by your $300 free credits for 6-12 months.

## Step 1: Create New VPS Instance

1. Go to [Google Cloud Compute Engine](https://console.cloud.google.com/compute/)
2. Click **"Create Instance"**
3. Configure:
   - **Name**: `jitsi-server`
   - **Region**: `us-central1` (or nearest to your users)
   - **Machine type**: `e2-medium` (2 vCPU, 4 GB) or `e2-standard-2` (2 vCPU, 8 GB)
   - **Boot disk**: Ubuntu 22.04 LTS, 30-50 GB
   - **Firewall**: Allow HTTP, HTTPS traffic
   - **External IP**: Create static IP (important!)

4. Click **Create**

## Step 2: Reserve Static IP Address

```bash
# In Google Cloud Console, go to:
# VPC Network > IP Addresses > Reserve External Static Address
# Name: jitsi-static-ip
# Attach to your jitsi-server instance
```

## Step 3: Configure Firewall Rules

Add these firewall rules in Google Cloud:

```bash
# Allow Jitsi video traffic (UDP 10000-20000)
gcloud compute firewall-rules create jitsi-udp \
    --allow udp:10000-20000 \
    --target-tags jitsi-server

# Allow Jitsi TCP traffic (TCP 443, 8443)
gcloud compute firewall-rules create jitsi-tcp \
    --allow tcp:443,tcp:8443 \
    --target-tags jitsi-server

# Add "jitsi-server" tag to your instance
```

## Step 4: Connect and Setup Server

```bash
# SSH into your server
gcloud compute ssh jitsi-server

# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
sudo apt install apt-transport-https ca-certificates curl gnupg lsb-release -y
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
echo "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt update
sudo apt install docker-ce docker-ce-cli containerd.io -y

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Add user to docker group
sudo usermod -aG docker $USER
newgrp docker
```

## Step 5: Setup Jitsi Meet with Docker

```bash
# Create Jitsi directory
mkdir -p ~/jitsi-meet-cfg/{web,transcripts,prosody/config,prosody/data,jicofo,jvb,jigasi,jibri}
cd ~

# Download Jitsi Docker Compose files
git clone https://github.com/jitsi/docker-jitsi-meet.git
cd docker-jitsi-meet

# Copy example env file
cp env.example .env

# Generate strong passwords
./gen-passwords.sh

# Edit .env file
nano .env
```

### Configure .env file:

```bash
# Required settings
CONFIG=~/.jitsi-meet-cfg
HTTP_PORT=80
HTTPS_PORT=443
TZ=UTC
PUBLIC_URL=https://meet.yourdomain.com  # Your domain or IP
DOCKER_HOST_ADDRESS=YOUR_SERVER_IP      # Your VPS external IP

# Jitsi components
ENABLE_AUTH=0
ENABLE_GUESTS=1
ENABLE_LOBBY=1
ENABLE_PREJOIN_PAGE=0
ENABLE_WELCOME_PAGE=0

# Video quality
RESOLUTION=720
RESOLUTION_MIN=180
START_VIDEO_MUTED=10
START_WITH_VIDEO_MUTED=false
START_AUDIO_MUTED=10
START_WITH_AUDIO_MUTED=false

# Recording (optional, needs more resources)
ENABLE_RECORDING=0
```

## Step 6: Start Jitsi Server

```bash
# Create necessary directories
mkdir -p ~/.jitsi-meet-cfg/{web,transcripts,prosody/config,prosody/data,jicofo,jvb}

# Start Jitsi
docker-compose up -d

# Check status
docker-compose ps
docker-compose logs -f
```

## Step 7: Setup Domain and SSL (Recommended)

### Option A: Using Domain Name

1. Point your domain (e.g., `meet.yourdomain.com`) to your VPS static IP
2. Jitsi Docker automatically handles SSL with Let's Encrypt

### Option B: Using IP Address (Quick Test)

```bash
# Access via IP: https://YOUR_SERVER_IP
# You'll get a SSL warning, click "Advanced" > "Proceed"
```

## Step 8: Update Frontend to Use Your Server

Edit `VideoConsultation.jsx`:

```javascript
// Change this line:
const domain = 'meet.jit.si'

// To your server IP or domain:
const domain = 'YOUR_SERVER_IP_OR_DOMAIN'  // e.g., 'meet.yourdomain.com' or '34.123.45.67'
```

## Step 9: Test Your Setup

1. Open browser: `https://YOUR_SERVER_IP_OR_DOMAIN`
2. Create a test room
3. Verify no 5-minute warning appears
4. Test with multiple participants

## Cost Management

### Instance Costs (e2-medium):
- **Monthly**: ~$24/month
- **With $300 credits**: ~12 months free
- **After credits**: Downgrade to f1-micro for other services, keep Jitsi on e2-medium

### Reduce Costs After Trial:
1. Use e2-small (2 vCPU, 2 GB) - ~$12/month
2. Schedule instance to turn off when not needed
3. Use preemptible instances for non-critical usage

## Troubleshooting

### Issue: Video/Audio Not Working
```bash
# Check firewall rules
gcloud compute firewall-rules list

# Verify ports are open
sudo netstat -tulpn | grep docker

# Restart Jitsi
docker-compose down
docker-compose up -d
```

### Issue: SSL Certificate Problems
```bash
# If using domain, ensure DNS is propagated
dig meet.yourdomain.com

# Restart containers to trigger SSL generation
docker-compose down
docker-compose up -d
```

### Issue: High Memory Usage
```bash
# Monitor resources
free -h
docker stats

# Restart if needed
docker-compose restart
```

## Quick Reference Commands

```bash
# Start Jitsi
docker-compose up -d

# Stop Jitsi
docker-compose down

# View logs
docker-compose logs -f

# Update Jitsi
docker-compose pull
docker-compose up -d

# Restart
docker-compose restart

# Check status
docker-compose ps
```

## Next Steps After Setup

1. ✅ Test video calls (no 5-minute limit!)
2. ✅ Update Curalink frontend with your Jitsi domain
3. ✅ Deploy Curalink backend on same VPS or separate f1-micro
4. ✅ Set up monitoring and alerts
5. ✅ Configure backups

## Alternative: Use 8x8 Jitsi (Paid)

If self-hosting is too complex:
- **8x8 Jitsi as a Service**: Starts at $0/month (limited) to $99/month
- No server management needed
- No 5-minute limit
- Sign up at: https://jaas.8x8.vc

This self-hosted solution will completely eliminate the 5-minute demo limit from your Curalink video consultations!
