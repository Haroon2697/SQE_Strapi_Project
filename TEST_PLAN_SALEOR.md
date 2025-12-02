# TEST PLAN DOCUMENT (IEEE 829 Standard)

**Project:** CI/CD Automation & Testing of Saleor E-Commerce Platform  
**Prepared by:** Muhammad Haroon  
**Testing Types:** White-box + Black-box  
**Tools:** Pytest, Jest, Cypress, GitHub Actions, Jenkins  
**Date:** December 2024

---

## 1. Test Objectives

- Ensure Saleor e-commerce platform functions correctly (products, cart, checkout, payments)
- Validate GraphQL API responses are correct and performant
- Verify multi-store and multi-currency support
- Test payment gateway integrations (Stripe, Braintree, etc.)
- Validate admin dashboard operations
- Ensure stability after each CI/CD pipeline execution
- Validate deployment using Jenkins

---

## 2. Test Scope

### In Scope ✅

- **Functional Testing (Black-box)**
  - User registration & authentication
  - Product browsing, search, filtering
  - Shopping cart management
  - Checkout process
  - Payment processing
  - Order management
  - Admin product CRUD operations

- **Unit Testing (White-box)**
  - GraphQL resolvers
  - Django models & views
  - React components
  - Utility functions

- **Integration Testing**
  - GraphQL API endpoints
  - Database operations
  - Payment gateway integrations
  - Email service integrations

- **E2E Testing (Black-box)**
  - Complete user purchase flow
  - Admin product management
  - Cart persistence
  - Order tracking

- **CI Automated Tests**
  - GitHub Actions pipeline
  - Automated test execution
  - Coverage reporting

- **CD Automated Deployment**
  - Jenkins deployment pipeline
  - Docker container deployment
  - Smoke tests after deployment

### Out of Scope ❌

- Performance load testing (separate test plan)
- Full security audit (separate security test plan)
- Mobile app testing
- Third-party payment gateway end-to-end testing (mocked in tests)

---

## 3. Test Items

- Saleor backend API (GraphQL)
- Admin dashboard (React)
- Storefront (React/Next.js)
- Product management
- Shopping cart functionality
- Checkout process
- Payment processing
- Order management
- User authentication
- Database operations
- Deployment verification

---

## 4. Testing Techniques

### White-box Techniques

- **Unit Tests** (Pytest, Jest)
  - Testing GraphQL resolvers
  - Testing Django models
  - Testing React components
  - Testing utility functions
  - Code coverage validation

- **Integration Tests** (Pytest, Supertest)
  - API endpoint testing
  - Database integration
  - Payment gateway mocking
  - Email service mocking

### Black-box Techniques

- **E2E Tests** (Cypress)
  - User workflow testing
  - Admin workflow testing
  - Form submission tests
  - Navigation tests
  - Authentication flows
  - Checkout completion

---

## 5. Test Tools & Frameworks

| Category | Tools | Version |
|----------|-------|---------|
| CI | GitHub Actions | Latest |
| CD | Jenkins | 2.400+ |
| Backend Testing | Pytest, Pytest-Django | 7.4+ |
| Frontend Testing | Jest, React Testing Library | 29.7+ |
| E2E Testing | Cypress | 15.0+ |
| Backend Runtime | Python, Django | 3.11, 4.2+ |
| Frontend Runtime | Node.js, React | 20+, 18+ |
| Database | PostgreSQL | 15+ |
| Cache | Redis | 7+ |
| Deployment | Docker | Latest |

---

## 6. Test Environment

### Local Development
- Python 3.11+
- Node.js 20+
- PostgreSQL 15
- Redis 7
- Saleor running on port 8000
- Storefront running on port 3000
- Dashboard running on port 3001

### CI Environment (GitHub Actions)
- Ubuntu-latest runners
- Automated builds & tests
- PostgreSQL & Redis services
- Docker image builds

### Staging (Jenkins)
- Docker container deployment
- Port 8000 (backend), 3000 (storefront)
- Production-like environment

---

## 7. Test Cases

### 7.1 Backend API Test Cases

#### Test Case: TC-BE-001
**Title:** Products Query Returns Valid Data  
**Type:** Integration Test  
**Priority:** High  
**Steps:**
1. Send GraphQL query for products
2. Verify response status is 200
3. Verify response contains product data
4. Verify product structure is correct

**Expected Result:** Products query returns valid product list with correct structure

#### Test Case: TC-BE-002
**Title:** Product Search Functionality  
**Type:** Integration Test  
**Priority:** High  
**Steps:**
1. Send GraphQL query with search filter
2. Verify response contains matching products
3. Verify search is case-insensitive

**Expected Result:** Search returns relevant products

#### Test Case: TC-BE-003
**Title:** Checkout Creation  
**Type:** Integration Test  
**Priority:** Critical  
**Steps:**
1. Authenticate user
2. Create checkout with product variant
3. Verify checkout ID is returned
4. Verify total price is calculated correctly

**Expected Result:** Checkout created successfully with correct pricing

#### Test Case: TC-BE-004
**Title:** Checkout Completion  
**Type:** Integration Test  
**Priority:** Critical  
**Steps:**
1. Create checkout
2. Complete checkout with payment
3. Verify order is created
4. Verify order status is correct

**Expected Result:** Order created successfully after checkout completion

#### Test Case: TC-BE-005
**Title:** User Registration  
**Type:** Integration Test  
**Priority:** High  
**Steps:**
1. Send registration mutation
2. Verify user is created
3. Verify email validation
4. Verify password requirements

**Expected Result:** User registered successfully

#### Test Case: TC-BE-006
**Title:** SQL Injection Protection  
**Type:** Security Test  
**Priority:** Critical  
**Steps:**
1. Send malicious SQL query
2. Verify system doesn't crash
3. Verify error is handled gracefully

**Expected Result:** SQL injection attempts are blocked

#### Test Case: TC-BE-007
**Title:** XSS Protection  
**Type:** Security Test  
**Priority:** Critical  
**Steps:**
1. Send XSS payload in query
2. Verify response is sanitized
3. Verify no script execution

**Expected Result:** XSS attempts are escaped/sanitized

### 7.2 Frontend Test Cases

#### Test Case: TC-FE-001
**Title:** Product Card Renders Correctly  
**Type:** Unit Test  
**Priority:** High  
**Steps:**
1. Render ProductCard component
2. Verify product name is displayed
3. Verify price is displayed
4. Verify add to cart button exists

**Expected Result:** Product card displays all required information

#### Test Case: TC-FE-002
**Title:** Add to Cart Functionality  
**Type:** Unit Test  
**Priority:** High  
**Steps:**
1. Render ProductCard with onAddToCart handler
2. Click add to cart button
3. Verify handler is called with product ID

**Expected Result:** Add to cart handler is triggered correctly

### 7.3 E2E Test Cases

#### Test Case: TC-E2E-001
**Title:** Complete Purchase Flow  
**Type:** E2E Test  
**Priority:** Critical  
**Steps:**
1. Visit storefront
2. Browse products
3. Add product to cart
4. Proceed to checkout
5. Fill checkout form
6. Complete order
7. Verify order confirmation

**Expected Result:** Complete purchase flow works end-to-end

#### Test Case: TC-E2E-002
**Title:** Cart Management  
**Type:** E2E Test  
**Priority:** High  
**Steps:**
1. Add multiple items to cart
2. View cart
3. Update quantities
4. Remove items
5. Verify cart total updates

**Expected Result:** Cart management functions correctly

#### Test Case: TC-E2E-003
**Title:** Admin Product Creation  
**Type:** E2E Test  
**Priority:** High  
**Steps:**
1. Login as admin
2. Navigate to products
3. Create new product
4. Fill product details
5. Save product
6. Verify product appears in list

**Expected Result:** Admin can create products successfully

#### Test Case: TC-E2E-004
**Title:** Admin Product Editing  
**Type:** E2E Test  
**Priority:** High  
**Steps:**
1. Login as admin
2. Select existing product
3. Edit product details
4. Save changes
5. Verify changes are reflected

**Expected Result:** Admin can edit products successfully

---

## 8. Entry & Exit Criteria

### Entry Criteria

- Code pushed to main/develop branch
- CI pipeline starts automatically
- Test environment is available
- Database migrations are up to date

### Exit Criteria

- All unit tests pass (100%)
- All integration tests pass (95%+)
- All E2E tests pass (90%+)
- Code coverage meets thresholds:
  - Backend: 80%+
  - Frontend: 70%+
- Docker images built successfully
- Jenkins deploys to staging successfully
- Smoke tests pass after deployment

---

## 9. Risks

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Incorrect environment variables | High | Medium | Validate env vars in CI |
| Database connection failures | High | Low | Health checks, retries |
| Cypress timing issues | Medium | Medium | Increase timeouts, retries |
| Pipeline timeouts | Medium | Low | Optimize test execution |
| Payment gateway failures | High | Low | Mock payment gateways in tests |
| Docker build failures | High | Low | Test Dockerfiles locally first |

---

## 10. Deliverables

- ✅ Pytest unit & integration tests
- ✅ Jest frontend component tests
- ✅ Cypress E2E tests
- ✅ GitHub Actions CI pipeline
- ✅ Jenkins CD pipeline
- ✅ Docker images
- ✅ Test reports & coverage
- ✅ Deployment documentation
- ✅ This test plan document

---

## 11. Test Schedule

| Phase | Duration | Activities |
|-------|----------|------------|
| Phase 1: Setup | 1 day | Environment setup, test framework configuration |
| Phase 2: Backend Tests | 3 days | Write & execute backend tests |
| Phase 3: Frontend Tests | 2 days | Write & execute frontend tests |
| Phase 4: E2E Tests | 2 days | Write & execute E2E tests |
| Phase 5: CI/CD Integration | 2 days | Integrate tests into CI/CD pipeline |
| Phase 6: Deployment Testing | 1 day | Test deployment process |
| **Total** | **11 days** | |

---

## 12. Test Data

### Test Users
- Admin user: `admin@example.com` / `admin123`
- Regular user: `user@example.com` / `user123`
- Test customer: `customer@example.com` / `customer123`

### Test Products
- Product 1: "Test Product 1", $99.99
- Product 2: "Test Product 2", $149.99
- Product 3: "Test Product 3", $199.99

### Test Payment Methods
- Mock Stripe payment
- Mock Braintree payment
- Test credit card: 4242 4242 4242 4242

---

## 13. Defect Management

- **Severity Levels:**
  - Critical: System crash, data loss, security breach
  - High: Major functionality broken
  - Medium: Minor functionality issue
  - Low: Cosmetic issue, documentation

- **Defect Tracking:**
  - GitHub Issues for bug tracking
  - Automated test failures reported in CI logs
  - E2E test failures include screenshots

---

## 14. Test Reporting

- **Daily Test Reports:** Generated by CI pipeline
- **Coverage Reports:** HTML reports generated after each test run
- **E2E Test Reports:** Cypress dashboard with screenshots/videos
- **Deployment Reports:** Jenkins console output and email notifications

---

**Document Version:** 1.0  
**Last Updated:** December 2024  
**Approved By:** [To be filled]

