#!/bin/bash

# Self-Hosted Jitsi Meet Server Setup Script
# Run this on your Google Cloud VPS to eliminate the 5-minute video call limit

set -e

echo "🎥 Setting up Self-Hosted Jitsi Meet Server"
echo "============================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    echo -e "${RED}❌ Please run as root or with sudo${NC}"
    exit 1
fi

# Get server IP
SERVER_IP=$(curl -s ifconfig.me)
echo -e "${GREEN}✓ Server IP: $SERVER_IP${NC}"

# Update system
echo -e "\n${YELLOW}📦 Updating system packages...${NC}"
apt update && apt upgrade -y

# Install dependencies
echo -e "\n${YELLOW}📦 Installing dependencies...${NC}"
apt install -y apt-transport-https ca-certificates curl gnupg lsb-release software-properties-common

# Install Docker
echo -e "\n${YELLOW}🐳 Installing Docker...${NC}"
if ! command -v docker &> /dev/null; then
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
    echo "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null
    apt update
    apt install -y docker-ce docker-ce-cli containerd.io
    systemctl enable docker
    systemctl start docker
    echo -e "${GREEN}✓ Docker installed${NC}"
else
    echo -e "${GREEN}✓ Docker already installed${NC}"
fi

# Install Docker Compose
echo -e "\n${YELLOW}🐳 Installing Docker Compose...${NC}"
if ! command -v docker-compose &> /dev/null; then
    curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
    ln -sf /usr/local/bin/docker-compose /usr/bin/docker-compose
    echo -e "${GREEN}✓ Docker Compose installed${NC}"
else
    echo -e "${GREEN}✓ Docker Compose already installed${NC}"
fi

# Create Jitsi directory
echo -e "\n${YELLOW}📁 Setting up Jitsi directories...${NC}"
mkdir -p /opt/jitsi-meet
cd /opt/jitsi-meet

# Download Jitsi Docker files
echo -e "\n${YELLOW}📥 Downloading Jitsi Meet...${NC}"
if [ ! -d "docker-jitsi-meet" ]; then
    git clone https://github.com/jitsi/docker-jitsi-meet.git
fi
cd docker-jitsi-meet

# Get latest stable version
git checkout stable-7439

# Generate passwords
echo -e "\n${YELLOW}🔐 Generating secure passwords...${NC}"
./gen-passwords.sh

# Create environment file
echo -e "\n${YELLOW}⚙️  Creating configuration...${NC}"
cat > .env << EOF
# Jitsi Meet Configuration
CONFIG=~/.jitsi-meet-cfg
HTTP_PORT=80
HTTPS_PORT=443
TZ=UTC
PUBLIC_URL=https://$SERVER_IP
DOCKER_HOST_ADDRESS=$SERVER_IP

# Security
ENABLE_AUTH=0
ENABLE_GUESTS=1
ENABLE_LOBBY=1
ENABLE_PREJOIN_PAGE=0
ENABLE_WELCOME_PAGE=0

# Video Quality
RESOLUTION=720
RESOLUTION_MIN=180
START_VIDEO_MUTED=10
START_WITH_VIDEO_MUTED=false
START_AUDIO_MUTED=10
START_WITH_AUDIO_MUTED=false

# JVB Configuration
JVB_PORT=10000
JVB_TCP_HARVESTER_DISABLED=true
JVB_TCP_PORT=4443
JVB_TCP_MAPPED_PORT=4443
JVB_STUN_SERVERS=meet-jit-si-turn.jitsi.net:443
JVB_ADAPTIVE_LASTN=true
JVB_ADAPTIVE_LASTN_TOP_USRS=4
JVB_LASTN=4
EOF

echo -e "${GREEN}✓ Configuration created${NC}"

# Create necessary directories
echo -e "\n${YELLOW}📁 Creating data directories...${NC}"
mkdir -p ~/.jitsi-meet-cfg/{web,transcripts,prosody/config,prosody/data,jicofo,jvb}

# Start Jitsi
echo -e "\n${YELLOW}🚀 Starting Jitsi Meet server...${NC}"
docker-compose up -d

# Wait for services to start
echo -e "\n${YELLOW}⏳ Waiting for services to start (30 seconds)...${NC}"
sleep 30

# Check status
echo -e "\n${YELLOW}📊 Checking service status...${NC}"
if docker-compose ps | grep -q "Up"; then
    echo -e "${GREEN}✓ Jitsi Meet is running!${NC}"
else
    echo -e "${RED}❌ Something went wrong. Checking logs...${NC}"
    docker-compose logs --tail=50
    exit 1
fi

# Configure firewall
echo -e "\n${YELLOW}🔥 Configuring firewall...${NC}"
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow 10000/udp
ufw allow 4443/tcp
ufw --force enable

echo -e "${GREEN}✓ Firewall configured${NC}"

# Display success message
echo -e "\n${GREEN}============================================${NC}"
echo -e "${GREEN}🎉 Jitsi Meet Server Setup Complete!${NC}"
echo -e "${GREEN}============================================${NC}"
echo -e "\n📍 Access your server at:"
echo -e "   ${YELLOW}https://$SERVER_IP${NC}"
echo -e "\n📋 Next steps:"
echo -e "   1. Open browser and test: https://$SERVER_IP"
echo -e "   2. Update frontend .env: VITE_JITSI_DOMAIN=$SERVER_IP"
echo -e "   3. Rebuild and deploy your frontend"
echo -e "\n🔧 Useful commands:"
echo -e "   docker-compose ps          - Check status"
echo -e "   docker-compose logs -f     - View logs"
echo -e "   docker-compose restart     - Restart services"
echo -e "   docker-compose down        - Stop services"
echo -e "\n⚠️  IMPORTANT:"
echo -e "   - This setup uses HTTP (not HTTPS) by default"
echo -e "   - For production, configure a domain and SSL certificate"
echo -e "   - The 5-minute limit is now REMOVED! 🎉"
echo -e "\n${GREEN}============================================${NC}"

# Create a simple status check script
cat > /usr/local/bin/jitsi-status << 'EOF'
#!/bin/bash
cd /opt/jitsi-meet/docker-jitsi-meet
docker-compose ps
EOF
chmod +x /usr/local/bin/jitsi-status

echo -e "\n💡 Run 'jitsi-status' anytime to check server status"
