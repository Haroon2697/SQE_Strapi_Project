# 🛍️ SQE Saleor Project - CI/CD & Testing

> **⚠️ MIGRATION NOTICE:** This project has been migrated from Strapi to Saleor.  
> See [MIGRATION_COMPLETE.md](MIGRATION_COMPLETE.md) for details.

## 📋 Quick Links

- **[README_SALEOR.md](README_SALEOR.md)** - Complete Saleor setup guide
- **[TEST_PLAN_SALEOR.md](TEST_PLAN_SALEOR.md)** - IEEE 829 test plan
- **[PROJECT_SUMMARY_SALEOR.md](PROJECT_SUMMARY_SALEOR.md)** - Project summary
- **[MIGRATION_COMPLETE.md](MIGRATION_COMPLETE.md)** - Migration details

---

# 🚀 Saleor E-Commerce Platform - Quick Start

This project implements a complete CI/CD automation system for testing and deploying **Saleor**, an open-source GraphQL-first e-commerce platform.

## 🏗️ Technology Stack

- **Backend:** Python 3.11, Django 4.2, GraphQL (Graphene-Django)
- **Frontend:** React 18, Next.js 14, Apollo Client
- **Database:** PostgreSQL 15
- **Cache:** Redis 7
- **Testing:** Pytest (backend), Jest (frontend), Cypress (E2E)
- **CI/CD:** GitHub Actions, Jenkins, Docker

## 🚀 Quick Start

```bash
# Start all services
docker-compose up -d

# Run migrations
docker-compose exec backend python manage.py migrate

# Access the application
# - Backend API: http://localhost:8000
# - GraphQL Playground: http://localhost:8000/graphql/
# - Storefront: http://localhost:3000
```

## 📚 Documentation

For complete setup instructions, see **[README_SALEOR.md](README_SALEOR.md)**.

## 🧪 Testing

**Backend Tests:**
```bash
cd saleor
pytest --cov=./ --cov-report=html
```

**Frontend Tests:**
```bash
cd saleor-storefront
npm test
```

**E2E Tests:**
```bash
npx cypress run
```

## 🔄 CI/CD Pipeline

The project includes:
- ✅ GitHub Actions CI pipeline (lint, test, build, deploy)
- ✅ Jenkins CD pipeline (staging deployment)
- ✅ Docker containerization
- ✅ Automated test execution

See **[TEST_PLAN_SALEOR.md](TEST_PLAN_SALEOR.md)** for complete test plan.

---

**Note:** This project was migrated from Strapi. See [MIGRATION_COMPLETE.md](MIGRATION_COMPLETE.md) for migration details.
