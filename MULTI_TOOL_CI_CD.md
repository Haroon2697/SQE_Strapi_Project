# 🔄 Multi-Tool CI/CD Pipeline Architecture

## 📋 Overview

This project implements **multi-tool CI/CD** as required by the assignment:
- **GitHub Actions**: Continuous Integration (CI)
- **Jenkins**: Continuous Deployment (CD)

## 🏗️ Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    DEVELOPER WORKFLOW                      │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
                    ┌───────────────┐
                    │  Git Push      │
                    │  to GitHub     │
                    └───────┬───────┘
                            │
                            ▼
        ┌───────────────────────────────────────┐
        │     GITHUB ACTIONS (CI)                │
        │  ────────────────────────────────      │
        │  1. Lint & Validate                    │
        │  2. Build & Unit Tests                 │
        │  3. Integration Tests                  │
        │  4. Cypress E2E Tests                  │
        │  5. Docker Build & Push                │
        └───────────────┬───────────────────────┘
                        │
                        ▼
                ┌───────────────┐
                │  Docker Hub    │
                │  (Image Push)  │
                └───────┬───────┘
                        │
                        ▼
        ┌───────────────────────────────────────┐
        │        JENKINS (CD)                     │
        │  ────────────────────────────────      │
        │  1. Pull Docker Image                  │
        │  2. Deploy to Staging                  │
        │  3. Health Check                        │
        │  4. Smoke Tests                        │
        └───────────────┬───────────────────────┘
                        │
                        ▼
                ┌───────────────┐
                │  Staging       │
                │  Environment  │
                └───────────────┘
```

## 🔧 Tool Responsibilities

### GitHub Actions (CI)
**Purpose**: Continuous Integration - Testing & Building

**Stages**:
1. ✅ **Lint** - Code quality checks (ESLint)
2. ✅ **Build** - Compile Strapi application
3. ✅ **Unit Tests** - White-box testing (Jest)
4. ✅ **Integration Tests** - API black-box testing (Jest + SuperTest)
5. ✅ **E2E Tests** - UI black-box testing (Cypress)
6. ✅ **Docker Build** - Build Docker image
7. ✅ **Docker Push** - Push to Docker Hub

**Output**: Docker image in Docker Hub

**File**: `.github/workflows/ci-cd-pipeline.yml`

### Jenkins (CD)
**Purpose**: Continuous Deployment - Deploying to Environments

**Stages**:
1. ✅ **Pull Image** - Pull latest from Docker Hub
2. ✅ **Deploy to Staging** - Run container on staging server
3. ✅ **Health Check** - Verify application is running
4. ✅ **Smoke Tests** - Basic functionality verification

**Output**: Deployed application in staging environment

**File**: `Jenkinsfile`

## 📊 Testing Strategy

### White-Box Testing (Unit Tests)
- **Tool**: Jest
- **Location**: `tests/unit/`
- **Runs in**: GitHub Actions
- **Examples**:
  - Configuration validation
  - Utility functions
  - Data transformations

### Black-Box Testing

#### API Testing (Backend)
- **Tool**: Jest + SuperTest
- **Location**: `tests/integration/`
- **Runs in**: GitHub Actions
- **Examples**:
  - API health checks
  - Authentication endpoints
  - CRUD operations

#### UI Testing (Frontend)
- **Tool**: Cypress
- **Location**: `cypress/e2e/`
- **Runs in**: GitHub Actions
- **Examples**:
  - Login flow
  - Admin dashboard
  - User interactions

## 🔄 Complete Workflow

### Step 1: Developer Pushes Code
```bash
git add .
git commit -m "Feature: Add new functionality"
git push origin main
```

### Step 2: GitHub Actions Triggers (CI)
- Automatically triggered on push to `main`
- Runs all CI stages
- Builds and pushes Docker image

### Step 3: Docker Image Available
- Image pushed to: `yourusername/strapi-app:latest`
- Tagged with commit SHA

### Step 4: Jenkins Triggers (CD)
- Can be automatic (webhook) or manual
- Pulls latest Docker image
- Deploys to staging

### Step 5: Application Deployed
- Staging environment: `http://your-server:1337/admin`
- Health checks verify deployment
- Smoke tests confirm functionality

## 📁 Key Files

| File | Purpose | Tool |
|------|---------|------|
| `.github/workflows/ci-cd-pipeline.yml` | CI Pipeline | GitHub Actions |
| `Jenkinsfile` | CD Pipeline | Jenkins |
| `jest.config.js` | Jest configuration | Testing |
| `cypress.config.js` | Cypress configuration | Testing |
| `Dockerfile` | Docker image definition | Docker |

## ✅ Assignment Requirements Checklist

| Requirement | Status | Implementation |
|------------|--------|----------------|
| Multi-tool CI/CD | ✅ | GitHub Actions + Jenkins |
| White-box testing | ✅ | Jest unit tests |
| Black-box API testing | ✅ | Jest integration tests |
| Black-box UI testing | ✅ | Cypress E2E tests |
| CI Pipeline | ✅ | GitHub Actions |
| CD Pipeline | ✅ | Jenkins |
| Docker deployment | ✅ | Docker Hub + Jenkins |
| Automated testing | ✅ | All tests automated |
| Manual testing | ✅ | Smoke tests in Jenkins |

## 🎯 Benefits of Multi-Tool Approach

1. **Separation of Concerns**
   - CI (testing) separate from CD (deployment)
   - Different tools optimized for different tasks

2. **Flexibility**
   - Can run CI without deployment
   - Can deploy without re-running all tests

3. **Assignment Compliance**
   - Meets requirement for multiple tools
   - Demonstrates understanding of CI/CD concepts

4. **Real-World Practice**
   - Mirrors industry practices
   - Shows proficiency with multiple tools

## 🚀 Quick Start

### Run CI (GitHub Actions):
- Push to GitHub → Automatically triggers

### Run CD (Jenkins):
1. Go to Jenkins dashboard
2. Click on `Strapi-CD-Pipeline`
3. Click **Build Now**

## 📸 Documentation for Report

Include screenshots of:
1. GitHub Actions pipeline running
2. Jenkins pipeline running
3. Test results from both tools
4. Deployed application
5. Docker Hub with pushed images

## 🎉 Summary

Your project now has:
- ✅ **Complete CI pipeline** (GitHub Actions)
- ✅ **Complete CD pipeline** (Jenkins)
- ✅ **Multi-tool architecture** (meets assignment requirements)
- ✅ **Comprehensive testing** (white-box + black-box)
- ✅ **Docker-based deployment**

**Your assignment requirements are fully met!** 🚀

