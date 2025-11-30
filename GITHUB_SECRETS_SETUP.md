# GitHub Secrets Setup Guide

## 🔐 Required Secrets for CI/CD Pipeline

Your CI/CD pipeline uses GitHub Secrets to securely store sensitive credentials. You have **two options**:

### Option 1: Use Default Values (No Secrets Needed)
The pipeline is configured with your credentials as **default fallback values**, so it will work even without creating secrets. However, for better security, **Option 2 is recommended**.

### Option 2: Create GitHub Secrets (Recommended)

## 📋 How to Create GitHub Secrets

### Step 1: Go to Your Repository Settings
1. Open your GitHub repository: `https://github.com/YOUR_USERNAME/YOUR_REPO`
2. Click on **Settings** (top menu)
3. In the left sidebar, click **Secrets and variables** → **Actions**

### Step 2: Create New Secrets
Click **"New repository secret"** and create these secrets:

#### Required Secrets:

1. **`CYPRESS_ADMIN_EMAIL`**
   - Value: `i222697@nu.edu.pk`
   - Used for: Cypress E2E tests (admin panel login)

2. **`CYPRESS_ADMIN_PASSWORD`**
   - Value: `@Haroon5295`
   - Used for: Cypress E2E tests (admin panel login)

3. **`STRAPI_TEST_EMAIL`** (Optional - has default)
   - Value: `i222697@nu.edu.pk`
   - Used for: Jest integration tests

4. **`STRAPI_TEST_PASSWORD`** (Optional - has default)
   - Value: `@Haroon5295`
   - Used for: Jest integration tests

#### Additional Secrets (for production):

5. **`ADMIN_JWT_SECRET`**
   - Generate with: `openssl rand -base64 32`
   - Used for: Admin JWT token signing

6. **`JWT_SECRET`**
   - Generate with: `openssl rand -base64 32`
   - Used for: API JWT token signing

7. **`API_TOKEN_SALT`**
   - Generate with: `openssl rand -base64 32`
   - Used for: API token hashing

8. **`APP_KEYS`**
   - Generate with: `openssl rand -base64 32` (comma-separated for multiple keys)
   - Used for: Application encryption keys

9. **`TRANSFER_TOKEN_SALT`**
   - Generate with: `openssl rand -base64 32`
   - Used for: Transfer token hashing

10. **`CYPRESS_RECORD_KEY`** (Optional - only if using Cypress Dashboard)
    - Get from: https://dashboard.cypress.io
    - Used for: Recording test runs

11. **`DOCKERHUB_USERNAME`** (Optional - only if deploying Docker images)
    - Your Docker Hub username
    - Used for: Pushing Docker images

12. **`DOCKERHUB_TOKEN`** (Optional - only if deploying Docker images)
    - Your Docker Hub access token
    - Used for: Pushing Docker images

13. **`CODECOV_TOKEN`** (Optional - only if using Codecov)
    - Get from: https://codecov.io
    - Used for: Uploading coverage reports

## ✅ Quick Setup (Minimum Required)

For the pipeline to work with your credentials, you only need to create these **2 secrets**:

1. `CYPRESS_ADMIN_EMAIL` = `i222697@nu.edu.pk`
2. `CYPRESS_ADMIN_PASSWORD` = `@Haroon5295`

**Note:** Even without creating secrets, the pipeline will use your credentials as defaults, but creating secrets is more secure and allows you to change them without modifying code.

## 🔍 Verify Secrets Are Set

After creating secrets, you can verify they're working by:
1. Going to **Actions** tab in your repository
2. Running a workflow manually (if `workflow_dispatch` is enabled)
3. Checking the workflow logs to see if credentials are being used

## ⚠️ Important Notes

- **Never commit secrets to your repository**
- Secrets are encrypted and only visible to repository administrators
- Secrets are available to all workflows in your repository
- You can update or delete secrets at any time

## 📝 Current Configuration

Your pipeline is configured with these defaults:
- Email: `i222697@nu.edu.pk`
- Password: `@Haroon5295`

If you create the GitHub secrets, they will override these defaults.

