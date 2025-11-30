# ✅ Jenkins Installation Complete!

## 🎉 Jenkins Successfully Installed

Jenkins has been installed and started on your system.

## 📋 Next Steps

### Step 1: Access Jenkins Web UI

1. **Open your browser** and go to:
   ```
   http://localhost:8080
   ```

2. **Get the initial admin password:**
   ```bash
   sudo cat /var/lib/jenkins/secrets/initialAdminPassword
   ```
   (This command will show you the password)

3. **Paste the password** into the Jenkins setup page

### Step 2: Complete Jenkins Setup

1. **Install suggested plugins** (click "Install suggested plugins")
2. **Wait for installation** (this may take a few minutes)
3. **Create admin user:**
   - Username: `admin` (or your choice)
   - Password: Choose a secure password
   - Full name: Your name
   - Email: Your email
4. **Save and finish**

### Step 3: Install Required Plugins

After Jenkins is set up, install these plugins:

1. Go to: **Manage Jenkins → Manage Plugins → Available**
2. Search and install:
   - ✅ **Pipeline** (usually pre-installed)
   - ✅ **Docker Pipeline**
   - ✅ **GitHub Integration** (optional)
   - ✅ **Credentials Binding**

### Step 4: Configure Docker Hub Credentials

1. Go to: **Manage Jenkins → Manage Credentials**
2. Click: **(global)** → **Add Credentials**
3. Configure:
   - **Kind**: Username with password
   - **Scope**: Global
   - **Username**: Your Docker Hub username
   - **Password**: Your Docker Hub password/token
   - **ID**: `dockerhub-username` (IMPORTANT: must match Jenkinsfile)
   - **Description**: Docker Hub credentials
4. Click: **OK**

### Step 5: Create Pipeline Job

1. Go to: **New Item**
2. Enter name: `Strapi-CD-Pipeline`
3. Select: **Pipeline**
4. Click: **OK**

### Step 6: Configure Pipeline

1. **Pipeline Definition**: Pipeline script from SCM
2. **SCM**: Git
3. **Repository URL**: `https://github.com/Haroon2697/SQE_Strapi_Project.git`
4. **Branches to build**: `*/main`
5. **Script Path**: `Jenkinsfile`
6. Click: **Save**

### Step 7: Test the Pipeline

1. Click: **Build Now**
2. Watch the pipeline execute
3. Check console output for any errors

## ✅ Verification

Jenkins is now:
- ✅ Installed
- ✅ Running on port 8080
- ✅ Configured with Docker access
- ✅ Ready for pipeline setup

## 🔗 Quick Links

- **Jenkins URL**: http://localhost:8080
- **Get Admin Password**: `sudo cat /var/lib/jenkins/secrets/initialAdminPassword`

## 📝 Notes

- Jenkins runs as user `jenkins`
- Jenkins has Docker access (added to docker group)
- Jenkins service is enabled (starts on boot)

## 🚀 Next: Complete Web UI Setup

Follow Steps 1-7 above to complete the Jenkins configuration through the web interface.

