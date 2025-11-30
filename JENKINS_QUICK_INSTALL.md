# 🚀 Quick Jenkins Installation Guide

## ⚡ Fast Installation (One Command)

I've created an installation script for you. Run this command:

```bash
cd /home/haroon/SQE_Strapi_Project/SQE_Strapi_Project
bash install-jenkins.sh
```

The script will:
1. ✅ Install Java 17
2. ✅ Add Jenkins repository
3. ✅ Install Jenkins
4. ✅ Start Jenkins service
5. ✅ Configure Docker access
6. ✅ Show you the next steps

## 📋 After Installation

### Step 1: Access Jenkins
Open browser: **http://localhost:8080**

### Step 2: Get Admin Password
Run this command:
```bash
sudo cat /var/lib/jenkins/secrets/initialAdminPassword
```
Copy the password shown.

### Step 3: Complete Setup
1. Paste the password in Jenkins
2. Click "Install suggested plugins"
3. Wait for installation
4. Create admin user
5. Save and finish

### Step 4: Install Additional Plugins
Go to: **Manage Jenkins → Manage Plugins → Available**

Install:
- ✅ **Docker Pipeline**
- ✅ **GitHub Integration** (optional)
- ✅ **Credentials Binding**

### Step 5: Configure Docker Hub Credentials
1. Go to: **Manage Jenkins → Manage Credentials**
2. Click: **(global)** → **Add Credentials**
3. Fill in:
   - **Kind**: Username with password
   - **Username**: Your Docker Hub username
   - **Password**: Your Docker Hub password
   - **ID**: `dockerhub-username` ⚠️ **MUST match Jenkinsfile**
   - **Description**: Docker Hub credentials
4. Click **OK**

### Step 6: Create Pipeline Job
1. Click: **New Item**
2. Name: `Strapi-CD-Pipeline`
3. Select: **Pipeline**
4. Click: **OK**

### Step 7: Configure Pipeline
1. **Pipeline Definition**: Pipeline script from SCM
2. **SCM**: Git
3. **Repository URL**: `https://github.com/Haroon2697/SQE_Strapi_Project.git`
4. **Branches**: `*/main`
5. **Script Path**: `Jenkinsfile`
6. Click: **Save**

### Step 8: Test Pipeline
1. Click: **Build Now**
2. Watch it run!

## ✅ Verification

Check if Jenkins is running:
```bash
sudo systemctl status jenkins
```

Check if Jenkins is accessible:
```bash
curl http://localhost:8080
```

## 🐛 Troubleshooting

### Jenkins not starting?
```bash
sudo systemctl restart jenkins
sudo systemctl status jenkins
```

### Can't access port 8080?
Check if something else is using it:
```bash
sudo lsof -i :8080
```

### Docker permission issues?
```bash
sudo usermod -aG docker jenkins
sudo systemctl restart jenkins
```

## 🎉 Done!

Once you complete these steps, your Jenkins is fully configured and ready to deploy!

