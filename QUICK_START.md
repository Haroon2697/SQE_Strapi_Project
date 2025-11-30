# Quick Start Guide - Running Strapi

## 🚀 Start Strapi (Development Mode)

### Option 1: Normal Development
```bash
npm run develop
```
This will:
- Start Strapi on `http://localhost:1337`
- Open admin panel at `http://localhost:1337/admin`
- Use development database: `.tmp/development.db`

### Option 2: Test Environment
```bash
NODE_ENV=test npm run develop
```
This will:
- Start Strapi in test mode
- Use test database: `.tmp/test.db`
- Disable telemetry

### Option 3: Using the CI Script
```bash
npm run start:ci
```
This automatically:
- Creates `.tmp` directory
- Sets `NODE_ENV=test`
- Disables telemetry
- Starts Strapi

## 📋 Prerequisites Check

Before starting, ensure:

1. **Database directory exists**:
   ```bash
   mkdir -p .tmp
   ```

2. **Dependencies installed**:
   ```bash
   npm install
   ```

3. **Environment variables** (optional, defaults work):
   - `DATABASE_FILENAME` - defaults to `.tmp/data.db`
   - `NODE_ENV` - defaults to `development`

## ✅ Verify Strapi Started Successfully

After running the start command, you should see:
```
✔ Server started
```

Then access:
- **Admin Panel**: http://localhost:1337/admin
- **API**: http://localhost:1337/api

## 🔧 Troubleshooting

### If you see database errors:

1. **Clear caches**:
   ```bash
   rm -rf .cache .strapi .tmp/*.db
   ```

2. **Rebuild**:
   ```bash
   npm run build
   ```

3. **Try again**:
   ```bash
   npm run develop
   ```

### If port 1337 is already in use:

Change the port in `config/server.js` or set:
```bash
PORT=1338 npm run develop
```

## 📝 First Time Setup

If this is your first time running Strapi:

1. Start Strapi: `npm run develop`
2. Go to: http://localhost:1337/admin
3. Create your admin account
4. Start building your content types!

---

**That's it! Strapi should now be running.** 🎉

