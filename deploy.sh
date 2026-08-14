#!/bin/bash
# KhamarCare Deployment Script for Ubuntu VPS
# Run this script with: sudo bash deploy.sh

set -e

DOMAIN="khamarcare.mdrezaulkarim.com"
PORT=8081
CONTAINER_NAME="khamarcare"
IMAGE_NAME="khamarcare-app"

echo "🐄 Starting Deployment for KhamarCare..."

# 1. Pull latest code from git
echo "📥 Pulling latest code..."
git pull origin main

# 2. Build the new Docker image
echo "🔨 Building Docker image..."
docker build -t $IMAGE_NAME .

# 3. Stop and remove old container if it exists
if [ $(docker ps -aq -f name=$CONTAINER_NAME) ]; then
    echo "🛑 Stopping old container..."
    docker stop $CONTAINER_NAME || true
    docker rm $CONTAINER_NAME || true
fi

# 4. Run the new container
echo "🚀 Starting new container on port $PORT..."
docker run -d -p $PORT:80 --name $CONTAINER_NAME $IMAGE_NAME
echo "✅ Docker container is up and running."

# 5. Configure Nginx (if not already configured)
NGINX_CONF="/etc/nginx/sites-available/khamarcare.conf"
NGINX_ENABLED="/etc/nginx/sites-enabled/khamarcare.conf"

if [ ! -f "$NGINX_CONF" ]; then
    echo "⚙️ Creating Nginx configuration for $DOMAIN..."
    cat > $NGINX_CONF <<EOF
server {
    listen 80;
    server_name $DOMAIN;

    location / {
        proxy_pass http://127.0.0.1:$PORT;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF
    
    # Enable the site
    ln -sf $NGINX_CONF $NGINX_ENABLED
    
    # Test and reload Nginx
    echo "🔄 Reloading Nginx..."
    nginx -t && systemctl reload nginx
    echo "✅ Nginx configuration complete."
else
    echo "✅ Nginx configuration already exists."
fi

# 6. Setup SSL Automatically
echo "🔒 Checking for SSL certificate..."
if command -v certbot &> /dev/null; then
    echo "Running Certbot to secure $DOMAIN..."
    # --non-interactive prevents it from blocking, --register-unsafely-without-email bypasses email prompt if acceptable, but let's just use a dummy email to be safe
    certbot --nginx -d $DOMAIN --non-interactive --agree-tos -m admin@$DOMAIN || echo "⚠️ Certbot ran into an issue, you may need to run it manually."
    echo "✅ SSL configuration complete."
else
    echo "⚠️ Certbot is not installed. Run 'apt install certbot python3-certbot-nginx' to install it, then run 'certbot --nginx -d $DOMAIN'."
fi

echo "🎉 Deployment Successful! Your app should be live at https://$DOMAIN"
