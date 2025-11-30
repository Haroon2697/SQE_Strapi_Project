# Testing Guide for Strapi v5 Quality Engineering Project

This guide explains how to run the comprehensive test suite for the Strapi v5 application.

## Overview

The project includes three types of tests:

1. **Unit Tests** - Test individual functions and utilities (Jest)
2. **Integration Tests** - Test API endpoints and authentication (Jest + Supertest)
3. **E2E Tests** - Test admin panel UI workflows (Cypress)

## Prerequisites

- Node.js 20.x or higher
- npm 6.0 or higher
- Strapi v5 application configured

## Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment Variables**
   - Copy `.env.example` to `.env` (if not already done)
   - Ensure database is configured (SQLite for local development)
   - Set test credentials if needed:
     ```
     STRAPI_TEST_EMAIL=admin@strapi.io
     STRAPI_TEST_PASSWORD=Admin123
     ```

3. **Prepare Test Database**
   ```bash
   mkdir -p .tmp
   ```

## Running Tests

### All Tests

Run all tests (unit + integration + e2e):
```bash
npm test
```

### Unit Tests Only

Run unit tests with coverage:
```bash
npm run test:unit
```

Or with watch mode:
```bash
npm run test:watch
```

### Integration Tests (API Tests)

**Important**: Integration tests require Strapi to be running.

1. **Start Strapi in test mode:**
   ```bash
   NODE_ENV=test npm run start:ci
   ```
   
   Or in a separate terminal:
   ```bash
   NODE_ENV=test npm run develop
   ```

2. **Run integration tests:**
   ```bash
   npm run test:integration
   ```

   Or run specific test files:
   ```bash
   npx jest tests/integration/api-auth.test.js
   npx jest tests/integration/api-crud.test.js
   ```

### E2E Tests (Cypress)

**Important**: E2E tests require Strapi to be running.

1. **Start Strapi:**
   ```bash
   npm run develop
   ```

2. **Run E2E tests in headless mode:**
   ```bash
   npm run test:e2e
   ```

3. **Open Cypress UI for interactive testing:**
   ```bash
   npm run test:e2e:open
   ```

### Test Coverage

Generate coverage report:
```bash
npm run test:coverage
```

View coverage report:
```bash
open coverage/lcov-report/index.html
```

## Test Structure

### Unit Tests
- Location: `tests/unit/`
- Examples:
  - `example.test.js` - Basic unit test example
  - `utils.test.js` - Utility function tests
  - `strapi-config.test.js` - Configuration tests

### Integration Tests
- Location: `tests/integration/`
- Files:
  - `api-auth.test.js` - Authentication API tests (login, token validation)
  - `api-crud.test.js` - CRUD operations tests
  - `api-health.test.js` - Health check tests
  - `api-content.test.js` - Content API tests

### E2E Tests
- Location: `cypress/e2e/`
- Files:
  - `login.cy.js` - Admin login flow tests
  - `admin-dashboard.cy.js` - Dashboard navigation tests
  - `health.cy.js` - Health check UI tests

## Test Configuration

### Jest Configuration
- File: `jest.config.js`
- Test environment: Node.js
- Coverage: Enabled
- Setup file: `tests/setup.js`

### Cypress Configuration
- File: `cypress.config.js`
- Base URL: `http://localhost:1337`
- Default browser: Firefox
- Timeout: 10 seconds

### Database Configuration
- Test database: `.tmp/test.db` (SQLite)
- Config: `config/env/test/database.js`
- Uses `better-sqlite3` for consistency

## Writing New Tests

### Adding a New API Test

1. Create a new file in `tests/integration/`:
   ```javascript
   const request = require('supertest');
   const BASE_URL = process.env.STRAPI_URL || 'http://localhost:1337';
   
   describe('My New API Test', () => {
     it('should test something', async () => {
       const response = await request(BASE_URL)
         .get('/api/endpoint')
         .set('Authorization', `Bearer ${token}`);
       
       expect(response.status).toBe(200);
     });
   });
   ```

2. Run the test:
   ```bash
   npx jest tests/integration/my-new-test.test.js
   ```

### Adding a New Cypress Test

1. Create a new file in `cypress/e2e/`:
   ```javascript
   describe('My New E2E Test', () => {
     it('should test UI flow', () => {
       cy.visit('/admin');
       cy.get('button').click();
       cy.url().should('include', '/expected-path');
     });
   });
   ```

2. Run the test:
   ```bash
   npm run test:e2e
   ```

## CI/CD Pipeline

The project includes a GitHub Actions workflow (`.github/workflows/ci-cd-pipeline.yml`) that:

1. **Lints code** - Runs ESLint
2. **Builds application** - Runs `npm run build`
3. **Runs unit tests** - Executes Jest unit tests
4. **Runs integration tests** - Tests API endpoints with running Strapi
5. **Runs E2E tests** - Executes Cypress tests in parallel
6. **Builds Docker image** - Creates containerized version
7. **Deploys to staging** - (if configured)
8. **Deploys to production** - (manual trigger)

### GitHub Secrets Required

For CI/CD to work, configure these secrets in GitHub:

- `STRAPI_TEST_EMAIL` - Admin email for tests
- `STRAPI_TEST_PASSWORD` - Admin password for tests
- `ADMIN_JWT_SECRET` - JWT secret for admin
- `JWT_SECRET` - JWT secret for API
- `API_TOKEN_SALT` - API token salt
- `APP_KEYS` - Application keys (comma-separated)
- `TRANSFER_TOKEN_SALT` - Transfer token salt
- `CYPRESS_RECORD_KEY` - (Optional) Cypress recording key
- `CODECOV_TOKEN` - (Optional) Codecov token for coverage

## Troubleshooting

### Tests Fail with "Connection Refused"

**Problem**: Integration/E2E tests can't connect to Strapi.

**Solution**: 
- Ensure Strapi is running on `http://localhost:1337`
- Check that `NODE_ENV=test` is set
- Verify database is accessible

### Database Locked Error

**Problem**: SQLite database is locked during tests.

**Solution**:
- Ensure only one test process is running
- Delete `.tmp/test.db` and restart
- Check for zombie Strapi processes: `pkill -f strapi`

### Authentication Tests Fail

**Problem**: Login tests fail with 401 errors.

**Solution**:
- Verify admin user exists in Strapi
- Check credentials match `STRAPI_TEST_EMAIL` and `STRAPI_TEST_PASSWORD`
- Ensure user has proper permissions

### Cypress Tests Timeout

**Problem**: Cypress tests timeout waiting for elements.

**Solution**:
- Increase timeout in `cypress.config.js`
- Check that Strapi admin panel is accessible
- Verify selectors match current Strapi v5 UI

## Best Practices

1. **Isolate Tests**: Each test should be independent
2. **Clean Up**: Use `beforeEach`/`afterEach` to reset state
3. **Use Fixtures**: Create reusable test data
4. **Mock External Services**: Don't rely on external APIs
5. **Test Edge Cases**: Include error scenarios
6. **Keep Tests Fast**: Optimize slow tests
7. **Document Tests**: Add comments for complex scenarios

## Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Cypress Documentation](https://docs.cypress.io/)
- [Supertest Documentation](https://github.com/visionmedia/supertest)
- [Strapi v5 Documentation](https://docs.strapi.io/dev-docs)

## Example Test Scenarios

### Authentication Flow
- ✅ Login with valid credentials
- ✅ Login with invalid credentials
- ✅ Token validation
- ✅ Protected route access
- ✅ Logout functionality

### CRUD Operations
- ✅ Create new content
- ✅ Read content list
- ✅ Read single content item
- ✅ Update content
- ✅ Delete content
- ✅ Error handling

### UI Workflows
- ✅ Admin login
- ✅ Dashboard navigation
- ✅ Content management
- ✅ Settings access
- ✅ Responsive design

