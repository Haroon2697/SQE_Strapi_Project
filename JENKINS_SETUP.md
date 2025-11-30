# 🚀 Jenkins Setup Guide for CI/CD Pipeline

## 📋 Overview

This project uses **multi-tool CI/CD**:
- **GitHub Actions**: Handles CI (Continuous Integration)
  - Lint, Build, Unit Tests, Integration Tests, E2E Tests, Docker Build & Push
- **Jenkins**: Handles CD (Continuous Deployment)
  - Pulls Docker image, Deploys to Staging, Health Checks

## ✅ Prerequisites

1. Jenkins server installed and running
2. Docker installed on Jenkins server
3. Docker Hub account (for pulling images)
4. GitHub repository access

## 🔧 Step-by-Step Jenkins Setup

### Step 1: Install Jenkins (if not already installed)

#### On Ubuntu/Debian:
```bash
sudo apt update
sudo apt install openjdk-11-jdk
wget -q -O - https://pkg.jenkins.io/debian/jenkins.io-2023.key | sudo apt-key add -
sudo sh -c 'echo deb http://pkg.jenkins.io/debian-stable binary/ > /etc/apt/sources.list.d/jenkins.list'
sudo apt update
sudo apt install jenkins
sudo systemctl start jenkins
sudo systemctl enable jenkins
```

#### On macOS:
```bash
brew install jenkins
brew services start jenkins
```

#### On Windows:
Download from: https://www.jenkins.io/download/

### Step 2: Access Jenkins

1. Open browser: `http://localhost:8080`
2. Get initial admin password:
   ```bash
   sudo cat /var/lib/jenkins/secrets/initialAdminPassword
   ```
3. Install suggested plugins
4. Create admin user

### Step 3: Install Required Jenkins Plugins

Go to: **Manage Jenkins → Manage Plugins → Available**

Install these plugins:
- ✅ **Pipeline** (usually pre-installed)
- ✅ **Docker Pipeline** (for Docker commands)
- ✅ **GitHub Integration** (optional, for webhooks)
- ✅ **Credentials Binding** (for Docker Hub credentials)

### Step 4: Configure Docker Hub Credentials

1. Go to: **Manage Jenkins → Manage Credentials**
2. Click: **Add Credentials**
3. Configure:
   - **Kind**: Username with password
   - **Scope**: Global
   - **Username**: Your Docker Hub username
   - **Password**: Your Docker Hub password/token
   - **ID**: `dockerhub-username` (must match Jenkinsfile)
   - **Description**: Docker Hub credentials

### Step 5: Create Jenkins Pipeline Job

1. Go to: **New Item**
2. Enter name: `Strapi-CD-Pipeline`
3. Select: **Pipeline**
4. Click: **OK**

### Step 6: Configure Pipeline

1. **Pipeline Definition**: Pipeline script from SCM
2. **SCM**: Git
3. **Repository URL**: `https://github.com/Haroon2697/SQE_Strapi_Project.git`
4. **Credentials**: Add if repository is private
5. **Branches to build**: `*/main`
6. **Script Path**: `Jenkinsfile`
7. Click: **Save**

### Step 7: Configure Build Triggers (Optional)

#### Option A: Manual Trigger
- Run pipeline manually from Jenkins UI

#### Option B: GitHub Webhook (Automatic)
1. In Jenkins job: **Configure → Build Triggers**
2. Check: **GitHub hook trigger for GITscm polling**
3. In GitHub: **Settings → Webhooks → Add webhook**
   - Payload URL: `http://your-jenkins-server:8080/github-webhook/`
   - Content type: `application/json`
   - Events: `Just the push event`

#### Option C: Poll SCM
- Check: **Poll SCM**
- Schedule: `H/5 * * * *` (every 5 minutes)

## 🚀 Running the Pipeline

### Manual Trigger:
1. Go to Jenkins dashboard
2. Click on `Strapi-CD-Pipeline`
3. Click: **Build Now**

### Automatic Trigger:
- Jenkins will automatically trigger when:
  - GitHub Actions completes and pushes Docker image
  - Webhook receives push notification
  - SCM polling detects changes

## 📊 Pipeline Stages

The Jenkins pipeline executes these stages:

1. **Checkout** - Pulls code from GitHub
2. **Pull Docker Image** - Pulls latest image from Docker Hub
3. **Deploy to Staging** - Stops old container, starts new one
4. **Wait for Application** - Waits for Strapi to be ready
5. **Health Check** - Verifies application is running
6. **Smoke Tests** - Basic functionality tests

## 🔍 Monitoring Deployment

### View Pipeline Progress:
1. Go to Jenkins dashboard
2. Click on your pipeline job
3. Click on the build number
4. View **Console Output** for detailed logs

### Check Application:
```bash
# Check if container is running
docker ps | grep sqe-strapi-staging

# View container logs
docker logs sqe-strapi-staging

# Access application
curl http://localhost:1337/admin
```

## 🐛 Troubleshooting

### Issue: Docker command not found
**Solution**: Install Docker on Jenkins server
```bash
sudo apt install docker.io
sudo usermod -aG docker jenkins
sudo systemctl restart jenkins
```

### Issue: Cannot pull Docker image
**Solution**: 
1. Verify Docker Hub credentials in Jenkins
2. Check if image exists: `docker pull yourusername/strapi-app:latest`
3. Verify credentials ID matches Jenkinsfile

### Issue: Port 1337 already in use
**Solution**: 
```bash
# Find process using port
sudo lsof -i :1337

# Kill process or change port in Jenkinsfile
```

### Issue: Container fails to start
**Solution**: Check container logs
```bash
docker logs sqe-strapi-staging
```

## 📝 Jenkinsfile Configuration

The `Jenkinsfile` is configured with these environment variables:

- `DOCKER_IMAGE`: `strapi-app` (matches GitHub Actions)
- `CONTAINER_NAME`: `sqe-strapi-staging`
- `PORT`: `1337`
- `DOCKER_REGISTRY`: From Jenkins credentials

## ✅ Verification Checklist

- [ ] Jenkins installed and running
- [ ] Required plugins installed
- [ ] Docker Hub credentials configured
- [ ] Pipeline job created
- [ ] Jenkinsfile path configured correctly
- [ ] Docker installed on Jenkins server
- [ ] Test pipeline run successful

## 🎯 Integration with GitHub Actions

### Workflow:
```
1. Developer pushes code → GitHub
2. GitHub Actions triggers → CI Pipeline
   - Lint, Build, Test, Docker Build & Push
3. Docker image pushed → Docker Hub
4. Jenkins triggers → CD Pipeline
   - Pull image, Deploy to staging
5. Application deployed → Staging environment
```

### Manual Jenkins Trigger:
After GitHub Actions completes:
1. Go to Jenkins
2. Click: **Build Now**
3. Jenkins will pull latest image and deploy

## 📸 Screenshots for Report

Take screenshots of:
1. Jenkins dashboard showing pipeline
2. Pipeline build progress
3. Successful deployment
4. Health check results
5. Application running in browser

## 🎉 Success!

Once configured, your multi-tool CI/CD pipeline is complete:
- ✅ **GitHub Actions**: CI (testing, building)
- ✅ **Jenkins**: CD (deployment)

Your assignment requirements are now fully met! 🚀

