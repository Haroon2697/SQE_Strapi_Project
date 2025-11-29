# 🚀 Complete Setup Guide for SQE Strapi Project

This guide walks you through setting up the entire CI/CD pipeline step by step.

## 📋 Step-by-Step Instructions

### Step 1: Fork Strapi Repository

1. Go to https://github.com/strapi/strapi
2. Click the **Fork** button (top right)
3. Name your fork: `sqe-strapi-haroon`
4. Click **Create fork**
5. **📸 Take screenshot** of your forked repository

### Step 2: Clone Your Fork

```bash
git clone https://github.com/YOUR_USERNAME/sqe-strapi-haroon.git
cd sqe-strapi-haroon
```

**📸 Take screenshot** of terminal showing successful clone.

### Step 3: Copy CI/CD Files to Your Project

Copy all the CI/CD files from this project to your Strapi fork:

```bash
# Copy GitHub Actions workflow
cp .github/workflows/ci.yml /path/to/your/strapi-fork/.github/workflows/

# Copy Jenkinsfile
cp Jenkinsfile /path/to/your/strapi-fork/

# Copy Dockerfile
cp Dockerfile /path/to/your/strapi-fork/

# Copy test files
cp -r tests/ /path/to/your/strapi-fork/
cp -r cypress/ /path/to/your/strapi-fork/
cp jest.config.js /path/to/your/strapi-fork/
cp cypress.config.js /path/to/your/strapi-fork/
```

### Step 4: Update Jenkinsfile

Edit `Jenkinsfile` and replace `YOUR_USERNAME` with your GitHub username:

```groovy
git branch: 'main', url: 'https://github.com/YOUR_USERNAME/sqe-strapi-haroon.git'
```

### Step 5: Install Dependencies

```bash
cd sqe-strapi-haroon
npm install
```

### Step 6: Install Test Dependencies

```bash
npm install --save-dev jest supertest cypress
```

### Step 7: Add Test Scripts to package.json

Add these scripts to your `package.json`:

```json
{
  "scripts": {
    "test": "jest",
    "test:unit": "jest tests/unit",
    "test:integration": "jest tests/integration",
    "test:coverage": "jest --coverage",
    "cypress:open": "cypress open",
    "cypress:run": "cypress run"
  }
}
```

### Step 8: Build Strapi

```bash
npm run build
```

**📸 Take screenshot** of successful build.

### Step 9: Run Strapi Locally

```bash
npm run develop
```

Open browser: http://localhost:1337/admin

**📸 Take screenshot** of Strapi admin panel.

### Step 10: Run Tests Locally

#### Unit Tests
```bash
npm test
```

**📸 Take screenshot** of test results.

#### Cypress Tests
```bash
npx cypress open
```

**📸 Take screenshot** of Cypress test runner.

### Step 11: Test Docker Build

```bash
docker build -t sqe-strapi-app .
docker run -d --name sqe-strapi -p 1337:1337 sqe-strapi-app
```

**📸 Take screenshot** of:
- Docker build output
- Running container (`docker ps`)
- Application in browser

### Step 12: Push to GitHub

```bash
git add .
git commit -m "Add CI/CD pipeline files"
git push origin main
```

### Step 13: Verify GitHub Actions

1. Go to your GitHub repository
2. Click **Actions** tab
3. Watch the CI pipeline run
4. **📸 Take screenshots** of:
   - Pipeline running
   - All tests passing
   - Coverage report

### Step 14: Set Up Jenkins

1. Install Jenkins (if not already installed)
2. Create new Pipeline job
3. Configure:
   - **Pipeline Definition**: Pipeline script from SCM
   - **SCM**: Git
   - **Repository URL**: Your fork URL
   - **Branch**: main
   - **Script Path**: Jenkinsfile

4. Run the pipeline
5. **📸 Take screenshots** of:
   - Jenkins dashboard
   - Job configuration
   - Build stages
   - Successful deployment

## ✅ Verification Checklist

- [ ] Strapi runs locally
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Cypress tests run
- [ ] Docker image builds
- [ ] Container runs successfully
- [ ] GitHub Actions CI runs
- [ ] Jenkins pipeline completes
- [ ] Application deployed to staging

## 🐛 Common Issues

### Issue: npm install fails
**Solution**: Ensure Node.js 18+ is installed

### Issue: Docker build fails
**Solution**: Check Docker is running and has enough resources

### Issue: Jenkins pipeline fails
**Solution**: 
- Ensure Docker is installed on Jenkins server
- Add Jenkins user to docker group: `sudo usermod -aG docker jenkins`
- Restart Jenkins

### Issue: Cypress tests fail
**Solution**: 
- Ensure Strapi is running before running Cypress
- Update selectors in test files if Strapi UI changed

## 📸 Screenshot Checklist

Make sure you have screenshots of:

1. ✅ Forked repository on GitHub
2. ✅ Cloned repository in terminal
3. ✅ Strapi running locally
4. ✅ Unit tests passing
5. ✅ Cypress test runner
6. ✅ Docker build
7. ✅ Running container
8. ✅ GitHub Actions pipeline
9. ✅ GitHub Actions test results
10. ✅ Jenkins dashboard
11. ✅ Jenkins pipeline stages
12. ✅ Jenkins deployment success
13. ✅ Application in browser (staging)

---

**Next Steps**: After completing setup, proceed to write your test plan and final report!

