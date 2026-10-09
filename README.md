# WasteFi — Frontend

Progressive web app for WasteFi, a platform that pays waste collectors in
emerging markets for verified recyclable material drop-offs. Collectors submit
collections and track earnings; collection points verify deliveries and manage
inventory; administrators review fraud signals and platform activity.

It is built mobile-first and offline-first, because the people using it are
often on a low-end Android phone with intermittent connectivity. A collection
submitted with no signal is queued locally and synced when the network returns.

Talks to [wastefi-backend](https://github.com/WASTEFI-AFRICA/wastefi-backend)
over HTTP.

## Stack

- Next.js 16 (App Router), React 19, TypeScript
- TailwindCSS 4
- Zustand for client state, TanStack Query for server state
- IndexedDB via `idb` and `localforage` for the offline queue
- `next-pwa` for the service worker and installability
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

Only `/stats` is connected to the backend. The screens behind sign-in (dashboard,
wallet, collections, profile, and the collection-point and admin screens) render
hard-coded sample data, and each shows a notice saying so. The sign-in form is a
demo: it signs in a placeholder user without calling the API, although the API's own
login is real and tested. Connecting those screens is the main piece of remaining work.

## Offline behaviour

The offline path is the part of this app most likely to surprise you, so it is
worth reading [docs/OFFLINE_ARCHITECTURE.md](docs/OFFLINE_ARCHITECTURE.md)
before changing anything under `lib/db/` or `lib/sync/`.

In short: writes go to an IndexedDB queue first and are replayed by
`lib/sync/syncManager.ts` when connectivity returns. That means a submission can
exist locally but not yet on the server, and the UI has to represent that state
honestly rather than pretending the write succeeded.

## Local development

Requires Node.js 18 or later.

```sh
cp .env.example .env.local      # then point NEXT_PUBLIC_API_URL at your backend
npm install
npm run dev
```

The app runs at `http://localhost:3000`. It expects the backend at
`NEXT_PUBLIC_API_URL`; without one reachable, pages that fetch data will show
their error states.

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
- [docs/OFFLINE_ARCHITECTURE.md](docs/OFFLINE_ARCHITECTURE.md) — the offline queue and sync
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
