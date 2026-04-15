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
- Daily automated test runs at 07:00 UTC (9:00 Madrid time)
- Automatic Allure report generation and deployment with 14-day history
- Support for suite selection via manual workflow trigger (dropdown)

**Scheduled Execution:** Automatically runs `Regression` suite daily
**Manual Execution:** Go to GitHub > Actions > Daily Regression Tests > Run workflow > Select suite from dropdown

### Test Suites

The project defines multiple test suites for flexible execution across different testing strategies:

#### Predefined Suites (by Test Count)
- **Regression** — Full test suite with all permanent tests (8 tests)
- **Smoke** — Critical flow validation for quick feedback (2 tests)
- **Sanity** — Core functionality and essential flows check (4 tests)

#### Dynamic Suites (by Payment Method)
These suites automatically include ALL tests using the specified payment method, regardless of country or rail:
- **CreditCard** — All Credit Card payment tests
- **PayPal** — All PayPal payment tests
- **Klarna** — All Klarna payment variations
- **Billie** — All Billie payment method tests

#### Geographic Suites (by Country)
These suites include ALL tests for the specified country:
- **Austria** — All Austria (AT) tests across all payment methods
- **Germany** — All Germany (DE) tests across all payment methods

### Manual Execution

#### Default Batch (8 Fixed + 4 Random)
```bash
node runner.js
```
Executes 8 permanent tests + 4 randomly selected tests from the pool.

#### Execute Specific Suite Locally
```bash
node runner.js --suite=Regression
node runner.js --suite=Smoke
node runner.js --suite=Sanity
node runner.js --suite=CreditCard
node runner.js --suite=PayPal
node runner.js --suite=Austria
node runner.js --suite=Germany
```

#### Show All Available Suites
```bash
node runner.js --help
```
Displays list of all available suites with test counts and descriptions.

#### Example Output
```
📋 Suite selected: CreditCard
   All Credit Card payment tests across countries
   Filter: {"pay":"CC"}
   Matched: 6 tests

📌 Tests to execute:
   [1] DE | xxxlutz | 1P | CC | tests/E2E-Lutz-Credit.spec.ts
   [2] AT | xxxlutz | 1P | CC | tests/E2E-Lutz-Credit.spec.ts
   [3] CZ | xxxlutz | 1P | CC | tests/E2E-Lutz-Credit.spec.ts
   [4] CH | xxxlutz | 1P | CC | tests/E2E-Lutz-Credit.spec.ts
   [5] RO | xxxlutz | 1P | CC | tests/E2E-Lutz-Credit.spec.ts
   [6] SK | xxxlutz | 1P | CC | tests/E2E-Lutz-Credit.spec.ts
```

## Reports

Test results are aggregated in **Allure Reports** with a 14-day historical data retention period, enabling trend analysis and regression detection.

---

**Last Updated:** April 2026
