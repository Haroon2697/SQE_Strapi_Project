# SQE Strapi CI/CD Pipeline Project

This project implements a complete CI/CD pipeline for Strapi CMS following Software Quality Engineering (SQE) best practices.

## 🎯 Project Overview

This project demonstrates:
- ✅ **GitHub Actions** for Continuous Integration (CI)
- ✅ **Jenkins** for CI/CD pipeline (Build, Test, Deploy)
- ✅ **Cypress** for End-to-End UI Testing
- ✅ **Docker** for containerization and deployment
- ✅ **Jest** for Unit and Integration Testing

## 📋 Prerequisites

- Node.js 18+ installed
- Docker installed and running
- Jenkins server configured (for Jenkins pipeline)
- Git configured

## 🚀 Quick Start

### 1. Fork and Clone Strapi

```bash
# Fork Strapi from: https://github.com/strapi/strapi
# Then clone your fork:
git clone https://github.com/YOUR_USERNAME/sqe-strapi-haroon.git
cd sqe-strapi-haroon
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Build Strapi

```bash
npm run build
```

### 4. Run Strapi Locally

```bash
npm run develop
```

Access admin panel at: http://localhost:1337/admin

## 🧪 Running Tests

### Unit Tests (Jest)

```bash
npm test
# or
npx jest --coverage
```

### Integration Tests

```bash
npx jest tests/integration
```

### E2E Tests (Cypress)

```bash
# Open Cypress Test Runner
npx cypress open

# Run Cypress headless
npx cypress run
```

## 🐳 Docker Deployment

### Build Docker Image

```bash
docker build -t sqe-strapi-app .
```

### Run Container

```bash
docker run -d --name sqe-strapi -p 1337:1337 sqe-strapi-app
```

### Stop Container

```bash
docker stop sqe-strapi
docker rm sqe-strapi
```

## 🔄 CI/CD Pipeline

### GitHub Actions (CI)

The GitHub Actions workflow (`.github/workflows/ci.yml`) automatically runs on:
- Push to `main` or `sqe-dev` branches
- Pull requests to `main` branch

**Stages:**
1. Checkout code
2. Setup Node.js
3. Install dependencies
4. Run linter
5. Run unit tests
6. Run integration tests
7. Build Strapi
8. Upload coverage reports

### Jenkins Pipeline

The Jenkinsfile defines a complete CI/CD pipeline with stages:

1. **Clone Repository** - Pulls code from GitHub
2. **Install Dependencies** - Runs `npm install`
3. **Run Unit Tests** - Executes Jest unit tests
4. **Run Integration Tests** - Executes API integration tests
5. **Build Docker Image** - Creates Docker image
6. **Deploy to Staging** - Deploys container to staging environment
7. **Health Check** - Verifies application is running

**To use Jenkins:**
1. Create a new Jenkins job
2. Select "Pipeline" as job type
3. Point to your repository
4. Jenkinsfile will be automatically detected

## 📁 Project Structure

```
sqe-strapi-haroon/
├── .github/
│   └── workflows/
│       └── ci.yml              # GitHub Actions CI workflow
├── cypress/
│   ├── e2e/
│   │   ├── login.cy.js         # Login page tests
│   │   └── admin-dashboard.cy.js # Dashboard tests
│   └── support/
│       ├── commands.js         # Custom Cypress commands
│       └── e2e.js              # Cypress support file
├── tests/
│   ├── unit/
│   │   ├── strapi-config.test.js
│   │   └── utils.test.js
│   └── integration/
│       ├── api-health.test.js
│       └── api-content.test.js
├── Dockerfile                  # Docker configuration
├── Jenkinsfile                 # Jenkins pipeline definition
├── jest.config.js             # Jest test configuration
├── cypress.config.js          # Cypress configuration
└── README.md                   # This file
```

## 📸 Screenshots Required for Report

### GitHub Actions
- [ ] Pipeline running in GitHub Actions
- [ ] All tests passing
- [ ] Coverage report
- [ ] Build logs

### Jenkins
- [ ] Jenkins dashboard
- [ ] Job configuration
- [ ] Build log showing all stages
- [ ] Successful deployment
- [ ] Running container status

### Cypress
- [ ] Cypress test runner
- [ ] Test execution results
- [ ] Test screenshots/videos

### Docker
- [ ] Docker image build
- [ ] Container running
- [ ] Application accessible in browser

## 🧩 Configuration

### Update Jenkinsfile

Before using Jenkins, update the repository URL in `Jenkinsfile`:

```groovy
git branch: 'main', url: 'https://github.com/YOUR_USERNAME/sqe-strapi-haroon.git'
```

### Cypress Environment Variables

Create `cypress.env.json` (optional):

```json
{
  "STRAPI_EMAIL": "admin@strapi.io",
  "STRAPI_PASSWORD": "Admin123"
}
```

## 📊 Test Coverage

Run tests with coverage:

```bash
npm test -- --coverage
```

Coverage reports are generated in the `coverage/` directory.

## 🐛 Troubleshooting

### Jenkins Pipeline Fails
- Ensure Docker is installed on Jenkins server
- Check Jenkins has permissions to run Docker commands
- Verify repository URL is correct

### Cypress Tests Fail
- Ensure Strapi is running on `http://localhost:1337`
- Check Cypress configuration matches your setup
- Update selectors if Strapi UI has changed

### Docker Build Fails
- Check Node.js version matches Dockerfile
- Verify all dependencies are in package.json
- Check Docker has enough resources allocated

## 📝 Test Plan

See `TEST_PLAN.md` for detailed test plan following IEEE 829 standard.

## 📄 License

This project is for educational purposes as part of SQE coursework.

## 👤 Author

**Haroon** - SQE Project

---

## 🎓 SQE Project Checklist

- [x] Fork Strapi repository
- [x] Set up GitHub Actions CI
- [x] Configure Jenkins pipeline
- [x] Add Cypress E2E tests
- [x] Add Jest unit/integration tests
- [x] Create Dockerfile
- [x] Deploy to staging
- [ ] Write test plan (IEEE format)
- [ ] Write final report
- [ ] Capture all screenshots

---

**Note:** Remember to replace `YOUR_USERNAME` with your actual GitHub username in all configuration files.

