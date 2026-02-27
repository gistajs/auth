# Auth Starter

SSR starter with auth flows prewired so you can build protected product features right away.

## Quick Start

1. Setup

```bash
# As always, install dependencies first
pnpm install

# Sets up .env and generates a cookie secret
pnpm prep

# Now create the users table — hit Enter to approve
atlas schema apply --env dev
```

2. Run locally

```bash
pnpm dev
```

## What's included

- React Router v7 SSR
- Drizzle ORM + Atlas migration flow
- Cookie session auth (`COOKIE_SECRET`)
- Email/password signup/login/logout
- Verify + reset password token flows
- Google and GitHub OAuth
- Protected route example (`/app`)
- Toast UX via `remix-toast` + `sonner`
- Verify/reset links are logged to server output in local/dev by default.
