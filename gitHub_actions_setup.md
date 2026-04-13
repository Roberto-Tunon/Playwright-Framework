# GitHub Actions Setup - Daily Regression Tests

## What have we configured?

A **GitHub Actions workflow** has been created that replaces your current cronjob. The `runner.js` script will run **every day at 9:00 UTC** automatically.

## File location

```
.github/workflows/daily-regression-tests.yml
```

---

## 📋 How does it work?

### 1. **Trigger (Scheduler)**
```yaml
schedule:
  - cron: '0 9 * * *'
```
- Runs at **9:00 UTC** every day
- First `0` = minute 0
- Second `9` = hour 9
- `* * *` = every day, every month, every day of the week

### 2. **Workflow steps**

| Step | Action |
|------|--------|
| **Checkout** | Downloads the repository code |
| **Setup Node.js** | Configures Node.js v18 + npm cache |
| **Install dependencies** | Runs `npm ci` (clean install) |
| **Install Playwright browsers** | Downloads required browsers |
| **Run tests** | Executes `node runner.js` |
| **Upload results** | Uploads Allure reports and dashboard |

---

## 🕐 Adjust execution time

If you want to run at a different time, edit the cron line:

```yaml
# Examples:
cron: '0 9 * * *'     # 9:00 UTC (current)
cron: '0 14 * * *'    # 14:00 UTC
cron: '30 8 * * *'    # 8:30 UTC
cron: '0 9 * * 1-5'   # Monday to Friday at 9:00 UTC
```

> **Note:** GitHub uses **UTC**. If your cronjob was in a different timezone, adjust the time accordingly.

---

## ✅ Verify it works

1. Open your repository on GitHub
2. Go to the **Actions** tab
3. Find the **"Daily Regression Tests"** workflow
4. You'll see a calendar with scheduled executions

### To test manually:

Click on the workflow → **Run workflow** → **Run workflow**

This will run the tests immediately without waiting for 9:00.

---

## 📊 View results

After each execution:

1. **Inside** the job → **Summary** tab
2. **Artifacts** section → download:
   - `allure-results/` → raw Allure data
   - `allure-report/` → generated HTML report

---

## 🔄 Differences: Cronjob vs GitHub Actions

| Aspect | Cronjob | GitHub Actions |
|--------|---------|-----------------|
| **Where it runs** | Your local machine | GitHub servers |
| **Configuration** | `crontab -e` in terminal | `.github/workflows/*.yml` in repo |
| **Logs** | Local terminal / files | GitHub UI → Actions tab |
| **Failures** | Need external monitoring | Automatic repo notifications |
| **Scalability** | Limited to your machine | Unlimited (free tier available) |
| **Git-friendly** | No | Yes, versioned with code |

---

## � Authentication with GitHub Actions

Since tests require SSO authentication that expires in < 24 hours and MFA cannot be automated, we use an **encoded session secret**.

### Quick Setup:

```bash
npm run login              # Generate auth.json (interactive - complete MFA)
npm run prepare-secret     # Encode to base64
# Copy the output and add as AUTH_JSON secret in GitHub
```

**→ See [SSO-GITHUB-ACTIONS.md](SSO-GITHUB-ACTIONS.md) for detailed setup instructions**

---

### 1. **Email notifications on failure**

Add to the end of the `yml` file:

```yaml
- name: Send notification on failure
  if: failure()
  uses: dawidd6/action-send-mail@v3
  with:
    server_address: ${{ secrets.MAIL_SERVER }}
    server_port: ${{ secrets.MAIL_PORT }}
    username: ${{ secrets.MAIL_USER }}
    password: ${{ secrets.MAIL_PASSWORD }}
    subject: "❌ Regression Tests Failed"
    to: your-email@example.com
    from: ${{ secrets.MAIL_FROM }}
    body: "View details: ${{ github.server_url }}/${{ github.repository }}/actions/runs/${{ github.run_id }}"
```

### 2. **Run only on specific days**

```yaml
# Monday to Friday only
cron: '0 9 * * 1-5'

# Tuesday and Thursday only
cron: '0 9 * * 2,4'
```

### 3. **Save report history**

Currently saved for 30 days. To change:

```yaml
retention-days: 60  # In the artifacts section
```

---

## ⚙️ Monitoring and alerts

### GitHub provides:
- ✅ Automatic email if workflow fails
- ✅ Complete execution history
- ✅ Detailed logs for each step

### Optional next steps:
- Integrate with Slack / Discord for notifications
- Publish Allure results on a web page
- Create a dashboard showing trends

---

## 📝 Important notes

1. **Permissions**: GitHub Actions needs permission to write to the repository. This is enabled by default.

2. **Cost**: GitHub provides 2000 free minutes/month of Actions for public repositories. Tests use ~10-15 minutes max, so no problem.

3. **Timezone**: GitHub always uses **UTC**. If you need 9:00 in your local time, adjust the cron accordingly.

4. **Secrets**: If you need credentials or tokens, use them under `${{ secrets.VARIABLE_NAME }}` (see repo Settings → Secrets).

---

## 🚀 Next steps

1. Push your changes
2. Open GitHub → Actions and verify the workflow appears
3. Wait until 9:00 UTC or run manually to test
4. Monitor the first reports

Done! Your cronjob is now replaced with a more robust and maintainable solution. 🎉
