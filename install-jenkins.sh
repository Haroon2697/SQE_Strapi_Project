#!/bin/bash
# Jenkins Installation Script for Ubuntu
# Run this script with: bash install-jenkins.sh

set -e

echo "🚀 Starting Jenkins Installation..."
echo ""

# Step 1: Install Java
echo "📦 Step 1: Installing Java..."
sudo apt update
sudo apt install -y openjdk-17-jdk

# Verify Java installation
echo "✅ Java installed:"
java -version
echo ""

# Step 2: Add Jenkins repository
echo "📦 Step 2: Adding Jenkins repository..."
curl -fsSL https://pkg.jenkins.io/debian-stable/jenkins.io-2023.key | sudo tee /usr/share/keyrings/jenkins-keyring.asc > /dev/null
echo deb [signed-by=/usr/share/keyrings/jenkins-keyring.asc] https://pkg.jenkins.io/debian-stable binary/ | sudo tee /etc/apt/sources.list.d/jenkins.list > /dev/null
sudo apt update

# Step 3: Install Jenkins
echo "📦 Step 3: Installing Jenkins..."
sudo apt install -y jenkins

# Step 4: Start and enable Jenkins
echo "📦 Step 4: Starting Jenkins service..."
sudo systemctl start jenkins
sudo systemctl enable jenkins

# Step 5: Add Jenkins to Docker group
echo "📦 Step 5: Configuring Docker access..."
sudo usermod -aG docker jenkins
sudo systemctl restart jenkins

# Step 6: Wait for Jenkins to start
echo "⏳ Waiting for Jenkins to start..."
sleep 10

# Step 7: Get initial admin password
echo ""
echo "✅ Jenkins Installation Complete!"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📋 NEXT STEPS:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "1. Open your browser and go to:"
echo "   http://localhost:8080"
echo ""
echo "2. Get the initial admin password:"
echo "   sudo cat /var/lib/jenkins/secrets/initialAdminPassword"
echo ""
echo "3. Paste the password in Jenkins setup page"
echo ""
echo "4. Install suggested plugins"
echo ""
echo "5. Create admin user"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check if Jenkins is running
if curl -s http://localhost:8080 > /dev/null 2>&1; then
    echo "✅ Jenkins is running on http://localhost:8080"
else
    echo "⏳ Jenkins is starting... Please wait a moment and check http://localhost:8080"
fi

echo ""
echo "📝 For detailed setup instructions, see: JENKINS_SETUP.md"
echo ""

