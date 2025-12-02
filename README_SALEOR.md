# 🛍️ Saleor E-Commerce Platform - CI/CD & Testing

Complete CI/CD pipeline and comprehensive testing strategy for **Saleor**, an open-source GraphQL-first e-commerce platform.

## 📋 Project Overview

This project implements a complete CI/CD automation system for testing and deploying Saleor, demonstrating both **white-box** and **black-box** testing methodologies.

## 🏗️ Architecture

### Technology Stack

- **Backend**: Python 3.11, Django 4.2, GraphQL (Graphene-Django)
- **Frontend**: React 18, Next.js 14, Apollo Client
- **Database**: PostgreSQL 15
- **Cache**: Redis 7
- **Testing**: 
  - Backend: Pytest, Pytest-Django, Factory Boy
  - Frontend: Jest, React Testing Library
  - E2E: Cypress
- **CI/CD**: GitHub Actions, Jenkins, Docker

### Project Structure

```
SQE_Saleor_Project/
├── saleor/                    # Backend (Django)
│   ├── saleor/                # Main Django app
│   ├── tests/                 # Backend tests
│   │   ├── test_graphql_api.py
│   │   └── conftest.py
│   ├── requirements.txt
│   ├── pytest.ini
│   └── Dockerfile
├── saleor-storefront/         # Storefront (React/Next.js)
│   ├── src/
│   ├── tests/
│   ├── package.json
│   └── Dockerfile
├── saleor-dashboard/         # Admin dashboard
│   └── ...
├── cypress/                  # E2E tests
│   └── e2e/
│       ├── checkout.cy.js
│       └── admin-products.cy.js
├── .github/
│   └── workflows/
│       └── ci-cd-pipeline.yml
├── docker-compose.yml
├── Jenkinsfile
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- Python 3.11+
- Node.js 20+
- Docker & Docker Compose
- PostgreSQL 15
- Redis 7

### Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd SQE_Saleor_Project
   ```

2. **Start services with Docker Compose**
   ```bash
   docker-compose up -d
   ```

3. **Run migrations**
   ```bash
   docker-compose exec backend python manage.py migrate
   ```

4. **Create superuser**
   ```bash
   docker-compose exec backend python manage.py createsuperuser
   ```

5. **Access the application**
   - Backend API: http://localhost:8000
   - GraphQL Playground: http://localhost:8000/graphql/
   - Storefront: http://localhost:3000
   - Admin Dashboard: http://localhost:3001

### Running Tests

**Backend Tests:**
```bash
cd saleor
pytest --cov=./ --cov-report=html
```

**Frontend Tests:**
```bash
cd saleor-storefront
npm test
npm run test:coverage
```

**E2E Tests:**
```bash
# Start services first
docker-compose up -d

# Run Cypress
npx cypress run
# Or open Cypress UI
npx cypress open
```

## 🧪 Testing Strategy

### 1. Backend Testing (White-box)

**Unit Tests:**
- GraphQL resolvers
- Django models
- Business logic
- Utility functions

**Integration Tests:**
- GraphQL API endpoints
- Database operations
- Payment gateway integrations
- Email service integrations

**Test Files:**
- `saleor/tests/test_graphql_api.py` - GraphQL API tests
- `saleor/tests/conftest.py` - Pytest fixtures

### 2. Frontend Testing (White-box)

**Component Tests:**
- React components
- User interactions
- State management
- GraphQL queries/mutations

**Test Files:**
- `saleor-storefront/src/__tests__/ProductCard.test.jsx`

### 3. E2E Testing (Black-box)

**User Flow Tests:**
- Product browsing
- Shopping cart
- Checkout process
- Order management
- Admin product management

**Test Files:**
- `cypress/e2e/checkout.cy.js`
- `cypress/e2e/admin-products.cy.js`

## 🔄 CI/CD Pipeline

### GitHub Actions Workflow

The CI/CD pipeline includes:

1. **Lint Backend** - Black, Flake8, isort
2. **Lint Frontend** - ESLint
3. **Test Backend** - Pytest with coverage
4. **Test Frontend** - Jest with coverage
5. **E2E Tests** - Cypress
6. **Docker Build** - Build and push images
7. **Jenkins Trigger** - Deploy to staging

### Jenkins Pipeline

Jenkins handles:
- Pulling latest Docker images
- Stopping old containers
- Deploying to staging
- Running smoke tests
- Sending notifications

## 📊 Test Coverage

### Backend Coverage
- GraphQL API: 80%+
- Models: 85%+
- Resolvers: 75%+

### Frontend Coverage
- Components: 70%+
- Utilities: 80%+

### E2E Coverage
- Critical user flows: 100%
- Admin workflows: 90%+

## 🔐 Environment Variables

### Backend (.env)
```env
DATABASE_URL=postgres://saleor:saleor@localhost:5432/saleor
REDIS_URL=redis://localhost:6379/0
SECRET_KEY=your-secret-key-here
ALLOWED_HOSTS=localhost,127.0.0.1
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_SALEOR_API_URL=http://localhost:8000/graphql/
```

## 📝 GitHub Secrets Required

- `DOCKERHUB_USERNAME` - Docker Hub username
- `DOCKERHUB_TOKEN` - Docker Hub access token
- `JENKINS_WEBHOOK_URL` - Jenkins webhook URL
- `CYPRESS_RECORD_KEY` - (Optional) Cypress Cloud recording key

## 🐳 Docker Commands

**Build images:**
```bash
docker-compose build
```

**Start services:**
```bash
docker-compose up -d
```

**View logs:**
```bash
docker-compose logs -f backend
```

**Stop services:**
```bash
docker-compose down
```

## 📈 Monitoring

- **Backend Health**: http://localhost:8000/health
- **GraphQL Playground**: http://localhost:8000/graphql/
- **Test Coverage Reports**: `saleor/htmlcov/index.html`

## 🚢 Deployment

### Staging Deployment

Automatically triggered on push to `main` branch:
1. GitHub Actions runs all tests
2. Docker images are built and pushed
3. Jenkins receives webhook
4. Jenkins deploys to staging environment

### Production Deployment

Manual trigger through Jenkins:
1. Select "Deploy to Production" job
2. Jenkins pulls latest images
3. Deploys to production environment
4. Runs smoke tests
5. Sends deployment notifications

## 📚 Documentation

- [Test Plan (IEEE 829)](TEST_PLAN_SALEOR.md)
- [CI/CD Pipeline Guide](CI_CD_GUIDE.md)
- [Testing Guide](TESTING_GUIDE_SALEOR.md)
- [Deployment Guide](DEPLOYMENT_GUIDE.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Ensure all tests pass
6. Submit a pull request

## 📄 License

This project is part of a Software Quality Engineering course project.

## 👤 Author

Muhammad Haroon

---

**Note**: This is a migration from Strapi to Saleor. For the original Strapi project, see the git history.

