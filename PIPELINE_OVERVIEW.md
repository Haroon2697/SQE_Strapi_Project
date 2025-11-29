# 🔄 CI/CD Pipeline Overview

## Pipeline Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Developer Workstation                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Code       │  │   Tests      │  │   Commit     │     │
│  │   Changes    │  │   Locally    │  │   & Push    │     │
│  └──────┬───────┘  └──────────────┘  └──────┬───────┘     │
└─────────┼────────────────────────────────────┼──────────────┘
          │                                    │
          │ git push                           │
          ▼                                    ▼
┌─────────────────────────────────────────────────────────────┐
│                    GitHub Repository                        │
│              (sqe-strapi-haroon)                            │
└─────────┬────────────────────────────────────┬──────────────┘
          │                                    │
          │ Webhook                            │
          ▼                                    ▼
┌─────────────────────────┐      ┌──────────────────────────┐
│   GitHub Actions (CI)   │      │   Jenkins (CI/CD)        │
│                         │      │                          │
│  ✓ Checkout Code        │      │  ✓ Clone Repository      │
│  ✓ Install Deps         │      │  ✓ Install Dependencies  │
│  ✓ Run Unit Tests       │      │  ✓ Run Unit Tests        │
│  ✓ Run Integration      │      │  ✓ Run Integration Tests │
│  ✓ Build Application    │      │  ✓ Build Docker Image    │
│  ✓ Upload Coverage      │      │  ✓ Deploy to Staging     │
│                         │      │  ✓ Health Check          │
└─────────────────────────┘      └───────────┬──────────────┘
                                              │
                                              ▼
                                    ┌─────────────────────┐
                                    │  Staging Deployment │
                                    │  (Docker Container) │
                                    │                     │
                                    │  http://localhost:  │
                                    │       1337/admin    │
                                    └─────────────────────┘
```

## Pipeline Stages

### 1. GitHub Actions (Continuous Integration)

**Trigger**: Push to `main` or `sqe-dev` branches, or Pull Requests

**Stages**:
1. **Checkout Code** - Clones repository
2. **Setup Node.js** - Installs Node.js 18 with npm cache
3. **Install Dependencies** - Runs `npm install`
4. **Run Linter** - Checks code quality (if configured)
5. **Run Unit Tests** - Executes Jest unit tests with coverage
6. **Run Integration Tests** - Executes API integration tests
7. **Build Strapi** - Builds the Strapi application
8. **Upload Coverage** - Uploads test coverage reports

**Output**: Test results, coverage reports, build artifacts

### 2. Jenkins (Continuous Integration & Deployment)

**Trigger**: Manual trigger or GitHub webhook

**Stages**:
1. **Clone Repository** - Pulls latest code from GitHub
2. **Install Dependencies** - Installs npm packages
3. **Run Unit Tests** - Executes Jest unit tests
4. **Run Integration Tests** - Executes API integration tests
5. **Build Docker Image** - Creates Docker image (`sqe-strapi-app`)
6. **Deploy to Staging** - Runs Docker container on staging server
7. **Health Check** - Verifies application is accessible

**Output**: Deployed application at `http://localhost:1337/admin`

## Testing Strategy

### Unit Tests (Jest)
- **Location**: `tests/unit/`
- **Purpose**: Test individual functions and components
- **Examples**:
  - Configuration validation
  - Utility functions
  - Data transformations

### Integration Tests (Jest + SuperTest)
- **Location**: `tests/integration/`
- **Purpose**: Test API endpoints and services
- **Examples**:
  - API health checks
  - Content API endpoints
  - Authentication flows

### E2E Tests (Cypress)
- **Location**: `cypress/e2e/`
- **Purpose**: Test user interactions and UI flows
- **Examples**:
  - Login page functionality
  - Admin dashboard navigation
  - Form submissions

## Deployment Flow

```
Code Push
    ↓
GitHub Actions (CI) ← Fast feedback, no deployment
    ↓
Jenkins (CI/CD) ← Full pipeline with deployment
    ↓
Docker Build
    ↓
Container Deployment
    ↓
Staging Environment
    ↓
Health Check
    ↓
✅ Application Live
```

## Environment Configuration

### Development
- **URL**: `http://localhost:1337/admin`
- **Purpose**: Local development and testing
- **Database**: SQLite (default)

### Staging
- **URL**: `http://your-server:1337/admin`
- **Purpose**: Pre-production testing
- **Deployment**: Docker container
- **Database**: Configured via environment variables

## Key Files

| File | Purpose |
|------|---------|
| `.github/workflows/ci.yml` | GitHub Actions CI pipeline |
| `Jenkinsfile` | Jenkins CI/CD pipeline definition |
| `Dockerfile` | Docker image configuration |
| `jest.config.js` | Jest test configuration |
| `cypress.config.js` | Cypress E2E test configuration |
| `tests/unit/` | Unit test files |
| `tests/integration/` | Integration test files |
| `cypress/e2e/` | End-to-end test files |

## Success Criteria

✅ All tests pass in GitHub Actions
✅ All tests pass in Jenkins
✅ Docker image builds successfully
✅ Container deploys to staging
✅ Application is accessible
✅ Health checks pass
✅ No critical security issues

## Monitoring & Logs

### GitHub Actions
- View logs in GitHub Actions tab
- Check coverage reports
- Review test summaries

### Jenkins
- View build logs in Jenkins console
- Check stage-by-stage execution
- Monitor deployment status

### Docker
- View container logs: `docker logs sqe-strapi`
- Check container status: `docker ps`
- Monitor resource usage: `docker stats sqe-strapi`

---

**This pipeline ensures code quality, automated testing, and reliable deployment!** 🚀

