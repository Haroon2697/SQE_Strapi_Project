# 🔐 GitHub Secrets Setup - Step by Step

## ✅ Step 1: You're Already Here!
You've navigated to: **Settings → Secrets and variables → Actions**

## 📝 Step 2: Create Your First Secret

### Create `CYPRESS_ADMIN_EMAIL`:
1. Click the **"New repository secret"** button (top right)
2. **Name:** Enter `CYPRESS_ADMIN_EMAIL`
3. **Secret:** Enter `i222697@nu.edu.pk`
4. Click **"Add secret"**

### Create `CYPRESS_ADMIN_PASSWORD`:
1. Click **"New repository secret"** again
2. **Name:** Enter `CYPRESS_ADMIN_PASSWORD`
3. **Secret:** Enter `@Haroon5295`
4. Click **"Add secret"**

## ✅ Step 3: Verify Secrets Are Created

You should now see in your secrets list:
- ✅ `CYPRESS_ADMIN_EMAIL`
- ✅ `CYPRESS_ADMIN_PASSWORD`

## 🔄 Step 4: Update Workflow File

I've already updated your workflow file to use secrets! The workflow now uses:
- `${{ secrets.CYPRESS_ADMIN_EMAIL }}`
- `${{ secrets.CYPRESS_ADMIN_PASSWORD }}`

## 🚀 Step 5: Commit and Push

After creating the secrets, commit the updated workflow file:

```bash
git add .github/workflows/ci-cd-pipeline.yml
git commit -m "Use GitHub Secrets for credentials (security)"
git push origin main
```

## ✅ That's It!

Your CI/CD pipeline will now:
- ✅ Use secure secrets from GitHub
- ✅ No hardcoded credentials in code
- ✅ Work automatically on every push

---

**Next:** After creating the secrets, let me know and I'll help you commit the changes!

