# WasteFi — Frontend

Progressive web app for WasteFi, a platform that pays waste collectors in
emerging markets for verified recyclable material drop-offs. Collectors submit
collections and track earnings; collection points verify deliveries and manage
inventory; administrators review fraud signals and platform activity.

It is built mobile-first, because the people using it are often on a low-end
Android phone with intermittent connectivity.

Talks to [wastefi-backend](https://github.com/WASTEFI-AFRICA/wastefi-backend)
over HTTP. Approved collections are recorded and paid on the
[WasteFi contracts](https://github.com/WASTEFI-AFRICA/wastefi-contracts) on
Stellar testnet.

## Try it

The whole flow runs live on Stellar testnet, nothing to install:

1. Open [wastefi-frontend.vercel.app/login](https://wastefi-frontend.vercel.app/login)
   and press **Sign in** next to the collection point demo account.
2. Approve a collection in the queue. Within a minute or two it is recorded,
   verified and paid in WASTE on Stellar, with a link to each transaction on
   stellar.expert.
3. Sign in as the demo collector to see the WASTE balance, read from the token
   contract. Or create your own account, submit a collection, and approve it as the
   collection point.
4. [The public stats page](https://wastefi-frontend.vercel.app/stats) needs no
   account and links every payment on-chain.

The API runs on a free host that sleeps when idle, so the first request can take up
to a minute.

## Stack

- Next.js 16 (App Router), React 19, TypeScript
- TailwindCSS 4
- Zustand for client state, TanStack Query for server state
- `next-pwa` for the service worker and installability (the app shell can be installed; data is not cached offline)
- `next-intl` for English, Swahili and French
- Leaflet for collection point maps

## Routes

Routes are grouped by the role that uses them:

| Group | Routes |
| --- | --- |
| `(auth)` | `login`, `register` |
| `(collector)` | `dashboard`, `submit`, `collections`, `wallet`, `points`, `achievements`, `profile`, `settings` |
| `(collection-point)` | `cp-dashboard`, `verify`, `inventory`, `payments`, `analytics` |
| `(admin)` | `admin-dashboard`, `users`, `fraud-detection` |

Outside the groups: `/` (landing), `/onboarding`, `/verify-phone`, `/terms`.

`/stats` is public and needs no account. It reads the deployed API and shows live platform
numbers, the collection points, and the smart contracts on testnet.

## What is real and what is sample data

Connected to the API: sign-in and registration, the collector dashboard, collection
history and submission (`/dashboard`, `/collections`, `/submit`), collection points
(`/points`), the wallet (`/wallet`), the profile (`/profile`), the collection point's verification queue
(`/verify`), the collection point dashboard (`/cp-dashboard`), and the public
`/stats` page. The dashboard shows all-time recorded totals and materials at the operator's
assigned collection point, plus its oldest five unreviewed deliveries and full
queue count. Administrators can view platform-wide totals. Records at every review stage contribute to recorded totals.
Operators without an assigned active point are asked to contact an administrator. Refresh is manual; the dashboard
does not poll while idle or use an offline API cache fallback.
The wallet reads the WASTE balance from
the token contract through the API and loads every collection history page for
completed rewards. WASTE is on Stellar testnet; cash-out is not available.
Wallet balance, history and profile reads use the network without an offline cache fallback.
The profile saves names, email, address and city through `/users/me`. The sign-in
phone number is read-only. Settings redirects to the profile; notification,
language, export and account deletion controls are not offered.
The admin user directory (`/users`) lists real accounts with server pagination,
status and role filters, and activation for pending accounts. Activation enables
sign-in without changing roles or KYC status. Role assignment and KYC review
controls are not offered. Administrators can assign, reassign or remove an
existing operator's collection point. Assignment preserves account status and
role. Operators see only their assigned active point's deliveries and totals;
these permissions are enforced by the API with the current database assignment.
On-chain verification still uses the contract admin until the next MVP change.
User directory reads use the network without an offline
cache fallback; refresh is manual with no idle polling.
Other screens, including achievements, collection
point analytics and inventory, the admin dashboard and fraud detection, still render sample data.
Each shows a notice saying so.

Photo upload is not connected yet (see the open issues), and submitting needs a
connection. The app shows a notice when the browser is offline and the submit form
asks the user to reconnect.

## Offline behaviour

There is no offline queue. Every write goes straight to the API and needs a
connection, and reads use the network without an offline cache. An earlier
IndexedDB queue was never connected to the API (it posted to an endpoint that does
not exist) and was removed so the screens do not claim a sync that cannot happen.
If offline submission is added later it needs retries and duplicate protection on
the server first, so a replayed submission cannot be recorded twice.

## Local development

Requires Node.js 18 or later.

```sh
cp .env.example .env.local      # then point NEXT_PUBLIC_API_URL at your backend
npm install
npm run dev
```

The app runs at `http://localhost:3000`. It expects the backend at
`NEXT_PUBLIC_API_URL`; without one reachable, pages that fetch data will show
their error states. Set `NEXT_PUBLIC_DEMO_PASSWORD` to the backend's
`DEMO_ACCOUNT_PASSWORD` to show the demo accounts on the sign-in page; both are
baked in at build time, so a deployment needs a rebuild after changing them.

## Checks

```sh
npm run lint
npm run type-check      # tsc --noEmit
npm run build
```

There is no automated test suite in this repository yet, and no CI workflow — so
`npm run lint`, `npm run type-check` and `npm run build` are the only gates, and
they only run if you run them. Adding tests and a CI workflow is the most
valuable contribution available here.

| Command | Purpose |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run build:analyze` | Production build with the bundle analyzer |
| `npm run lighthouse` | Lighthouse audit against a running local server |

## Documentation

- [docs/DESIGN_SYSTEM.md](docs/DESIGN_SYSTEM.md) — tokens, components and usage
- [docs/RESPONSIVE_LAYOUT.md](docs/RESPONSIVE_LAYOUT.md) — breakpoints and layout primitives
- [docs/STATE_MANAGEMENT.md](docs/STATE_MANAGEMENT.md) — what belongs in Zustand vs React Query
- [docs/INTERNATIONALIZATION.md](docs/INTERNATIONALIZATION.md) — adding strings and locales
- [docs/PERFORMANCE.md](docs/PERFORMANCE.md) — budgets and measurement
- [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) — building and hosting

## Related repositories

- [wastefi-backend](https://github.com/WASTEFI-AFRICA/wastefi-backend) — REST API, indexer, and mobile money integration
- [wastefi-contracts](https://github.com/WASTEFI-AFRICA/wastefi-contracts) — Soroban smart contracts
- [wastefi-docs](https://github.com/WASTEFI-AFRICA/wastefi-docs) — platform documentation site

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

MIT. See [LICENSE](LICENSE).
