# Ledger / Family Dashboard

Private financial dashboard for tracking bank and investment accounts via Plaid.

## Setup

### Credentials
Client ID and Sandbox/Production secret are stored directly in `index.html`.
Search for `CLIENT_ID` and `SECRET` near the top of the script block to update them.

### Switching to Production
1. Apply for Trial plan at https://dashboard.plaid.com/trial-plan
2. In `index.html`, change:
   ```
   const PLAID_ENV = 'sandbox';
   ```
   to:
   ```
   const PLAID_ENV = 'production';
   ```
3. Update `SECRET` to your Production secret (found in Plaid Dashboard → Team Settings → Keys)

## GitHub Pages Deployment
1. Push this repo to a **private** GitHub repository
2. Go to Settings → Pages
3. Set Source to `main` branch, `/ (root)` folder
4. Your dashboard will be live at `https://<your-username>.github.io/<repo-name>/`

## Local Use
```
npx serve .
```
Then open http://localhost:3000
