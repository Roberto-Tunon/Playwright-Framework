# Playwright E2E Testing Framework

**Author:** Roberto Tuñon Cerra

---

## Overview

This comprehensive End-to-End (E2E) testing framework is designed for XXXLutz, a leading European furniture retailer with operations spanning from Sweden to the Balkans.

**Scope:** 11 countries across Europe | **Primary Markets:** Austria & Germany

**Key Objectives:**
- Maximize E2E test coverage across all critical business scenarios
- Enable multi-country deployment validation
- Streamline pre-production quality assurance
- Provide detailed test reporting and analytics

## Project Rationale

Built on **Playwright + TypeScript** with **Allure Reports** integration, this solution strategically enhances the company's existing Cypress-based testing suite by addressing limited code coverage and enabling comprehensive pre-production error detection before code promotion to production.

## Test Parameters

Every test execution requires four core parameters that align with XXXLutz's business model:

### Country
- The company operates in 11 countries across Europe
- Each test must specify the target country code (e.g., AT, DE, CH, SE)

### Rail (Brand/Subsidiary)
- **Lutz** (parent company)
- **Mömax**
- **Möbelix**
- **Lesnina** (Lutz's brand in Slovenia, Croatia, and Serbia)

### Mode (Order Type)
- **1P** — Direct orders (XXXLutz products only)
- **3P** — Marketplace orders (third-party vendors)
- **2P** — Mixed orders (XXXLutz + Marketplace products)

### Pay (Payment Method)
Common methods include Credit Card and PayPal, with region-specific options like TWINT (Switzerland) and Swish (Sweden).

## Tech Stack

- **Playwright** — Modern browser automation
- **TypeScript** — Type-safe test development
- **Allure Reports** — Comprehensive test analytics and reporting
- **GitHub Actions** — Continuous Integration/Deployment
- **Node.js** — Runtime environment

## Key Features

- ✓ Parallel test execution for optimal performance
- ✓ Page Object Model (POM) architecture
- ✓ Allure reporting integration
- ✓ Multi-country parameter support
- ✓ Structured logging with Logger module
- ✓ Visual dashboard for manual test execution

## Prerequisites

Before running tests, ensure the following:
- Node.js installed
- Valid authentication credentials (configured for SSO)
- `.env` file with necessary configuration

## Running Tests

### Initial Setup: SSO Authentication

All tests require prior SSO login. Execute:
```bash
node run-test.mjs
```
Select the **Login** option and complete the authentication flow.

### Executing Specific Tests

After successful SSO authentication:
```bash
node run-test.mjs
```
Select desired test parameters via the interactive menu:
- Example: Country: AT | Rail: Lutz | Mode: 1P | Pay: Credit Card

### Dashboard Execution

For a visual interface with dropdown parameter selection:
```bash
cd dashboard && node server.js
```
This launches a local dashboard where you can:
- Select test parameters via dropdowns
- Execute tests in headless mode or with full UI visibility
- Monitor real-time test progress

## Continuous Integration/Deployment

### Automated Execution

GitHub Actions are configured for:
- Daily automated test runs at 11:00 UTC
- Automatic Allure report generation and deployment

### Test Coverage Strategy

- **8 High-Priority Tests** — Run daily (critical business flows)
- **4 Additional Tests** — Randomly selected from lower-priority scenarios
- **Total:** 12 tests per batch execution

### Manual Execution

Trigger batch testing manually via two methods:

**Method 1:** Manually trigger GitHub Actions workflow

**Method 2:** Execute locally:
```bash
node runner.js
```

## Reports

Test results are aggregated in **Allure Reports** with a 14-day historical data retention period, enabling trend analysis and regression detection.

---

**Last Updated:** April 2026
