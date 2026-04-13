# 🔐 SSO Authentication for GitHub Actions

## The Problem

Tests require SSO (Keycloak) authentication with MFA, but:
- ❌ GitHub Actions cannot interact with MFA prompts
- ❌ `auth.json` is in `.gitignore` (security best practice)
- ❌ Session expires in **< 24 hours**

## The Solution

We store the SSO session (`auth.json`) **encoded in a GitHub Secret** and decode it during workflow execution.

---

## 📋 Step-by-Step Setup

### 1️⃣ Generate auth.json Locally

First, create a valid session by logging in manually:

```bash
npm run login
```

This will:
- Open your browser with the QA environment
- Fill in username/password automatically
- Pause at the MFA step
- Wait for you to complete MFA verification
- Click "Resume" (▶️ icon) when done
- Save the session to `auth.json`

**Output**: `✅ Session successfully saved to auth.json!`

---

### 2️⃣ Encode auth.json to base64

```bash
npm run prepare-secret
```

This will output a long base64 string. **Copy it to clipboard.**

**Example output:**
```
eyJjb29raWVzIjpbeyJuYW1lIjoiQVVUSF9TRVNTTL9JRCIsInZhbHVlIjoiNzc0YTc4NXdmb2... [continues]
```

---

### 3️⃣ Create GitHub Secret

Go to your repository on GitHub:

1. **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Fill in:
   - **Name**: `AUTH_JSON`
   - **Value**: [paste the base64 string from step 2]
4. Click **Add secret**

---

### 4️⃣ Test the Workflow

1. Go to **Actions** tab in GitHub
2. Select **Daily Regression Tests**
3. Click **Run workflow** → **Run workflow**
4. Wait for the `🔐 Restore SSO Session` step
5. It should show: `✅ SSO session successfully restored from secret`

---

## ⚠️ Session Expiry Management

Since sessions expire in **< 24 hours**, you need to **refresh regularly**.

### Every day or as needed:

```bash
npm run login      # Creates fresh auth.json
npm run prepare-secret  # Encodes to base64
# Then update the AUTH_JSON secret in GitHub
```

### Or automate with a GitHub Actions workflow:

(Optional) Create `.github/workflows/refresh-auth.yml`:

```yaml
name: Refresh SSO Session
on:
  schedule:
    - cron: '0 6 * * *'  # Every day at 6:00 UTC (before tests at 7:00)
  workflow_dispatch:     # Allow manual trigger

jobs:
  refresh:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Install Playwright
        run: npx playwright install --with-deps
      
      - name: Generate fresh auth.json
        run: |
          # This requires manual interaction - set up a trigger for this
          npm run login
      
      - name: Encode and update secret
        run: npm run prepare-secret

      # Note: You'll still need to manually paste the secret
      # Alternatively, use a GitHub token to update secrets programmatically
```

---

## 🔍 Troubleshooting

### Secret not set error

**Error in workflow:**
```
❌ ERROR: AUTH_JSON secret not set!
```

**Solution:**
- Follow steps 1-3 above to create the secret

---

### Session expired

**Error in tests:**
```
❌ Test failed: Redirected to login page
```

**Solution:**
- Run `npm run login` to generate a fresh session
- Run `npm run prepare-secret` to encode it
- Update the `AUTH_JSON` secret in GitHub

---

### Base64 encoding failed

**Error:**
```
bash: base64: command not found
```

**Solution (macOS/Linux alternative):**
```bash
# Using openssl instead
cat auth.json | openssl enc -base64 -A
```

---

## 🛠️ Commands Reference

| Command | Purpose |
|---------|---------|
| `npm run login` | Generate fresh `auth.json` (interactive) |
| `npm run prepare-secret` | Encode `auth.json` to base64 |
| `npm run test` | Run regression tests locally |
| `npm run show-secret` | Display setup instructions |

---

## 🔒 Security Notes

1. **auth.json is never committed** (in `.gitignore`)
2. **Secrets are encrypted** in GitHub
3. **Base64 is not encryption** - just encoding for transport
4. **Only authorized users** can view/update secrets
5. **Secrets are masked** in GitHub Actions logs

---

## 📝 What's in auth.json?

It contains Playwright browser storage state:
- 🍪 Cookies from Keycloak
- 🔑 Session tokens
- 📍 LocalStorage/SessionStorage data

**Never commit this file** - it's treated like a password!

---

## 🎯 Next Steps

1. ✅ Run: `npm run login`
2. ✅ Run: `npm run prepare-secret`
3. ✅ Add secret to GitHub
4. ✅ Test workflow manually
5. ✅ Monitor first scheduled execution

Done! Your tests will now authenticate automatically in GitHub Actions. 🚀
