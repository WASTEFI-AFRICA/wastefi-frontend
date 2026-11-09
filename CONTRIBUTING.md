# Contributing to WasteFi Frontend

Thanks for your interest in contributing.

## Getting set up

Requires Node.js 20 or later (CI uses 22).

```sh
cp .env.example .env.local
npm install
npm run dev
```

The app runs at http://localhost:3000. It needs the
[wastefi-backend](https://github.com/WASTEFI-AFRICA/wastefi-backend) running too. The
backend README has the steps (a PostgreSQL database and a `.env`). Start the backend with
`PORT=3001`, which is what `.env.example` points at, so it does not collide with the
frontend. With `SEED_DEMO_DATA=true` the backend creates a demo collector, a demo
collection point operator and three collection points, so you can sign in and click through
the whole flow straight away. If you set `NEXT_PUBLIC_DEMO_PASSWORD` in `.env.local` to the
backend's `DEMO_ACCOUNT_PASSWORD`, the sign-in page shows one-click demo buttons.

You can see the finished flow without installing anything at
https://wastefi-frontend.vercel.app. It runs on Stellar testnet, and the
[stats page](https://wastefi-frontend.vercel.app/stats) says what is live and what is
still sample data.

## Picking an issue

1. Look for the `good first issue` label. Each issue has a summary, acceptance criteria
   you can tick off, and suggested commands.
2. Comment on the issue to say you are taking it. A maintainer assigns it to you. Please
   take one at a time until your first pull request is merged.
3. If you stop, say so on the issue so someone else can pick it up. Issues with no
   activity for two weeks may be reassigned.
4. Not sure how to start? Ask on the issue. Questions are welcome and get an answer.

Issues without the label are fine to ask about too, but they usually touch more of the
app or need a decision first.

## Checks a pull request must pass

```sh
npm run lint
npm run type-check
npm run build
```

CI runs the same three on every pull request (Node 22, a clean install), so run them
locally first. Two other checks also run:

- **MalwareGuard** looks at what a pull request changes and blocks the risky patterns that
  have been spreading through open-source repos: editor tasks that run on open, hidden or
  obfuscated code, install-time scripts, fonts or binaries that are really scripts, and
  forged commits. It only reads the diff and never runs your code. If it flags something
  legitimate, such as a change to `.github/` or a new dependency, say why in the pull
  request and a maintainer will review it by hand.
- **Dependency Review** flags vulnerable or unusually licensed new dependencies.

There is no test suite yet. Adding Vitest with a first set of component tests is one of
the open `good first issue` tasks.

## Conventions

- TypeScript throughout, in strict mode. Do not add `any` to get past a type
  error; narrow the type or fix the model.
- Server state belongs in TanStack Query, client state in Zustand. Do not cache
  server responses in a Zustand store — see
  [docs/STATE_MANAGEMENT.md](docs/STATE_MANAGEMENT.md).
- Use the design system in `components/ui/` and the tokens in `app/globals.css`
  rather than ad-hoc Tailwind values. See
  [docs/DESIGN_SYSTEM.md](docs/DESIGN_SYSTEM.md).
- Build for a phone first. Test at 360px wide before widening.
- The interface is English only today. `next-intl` is installed and Swahili and French
  message files exist in `i18n/messages/`, but no screen reads them yet and there is no
  language switcher. Wiring that up is an open task. Until then, write plain English
  strings, keep them in one place per component, and do not add keys to the JSON files.
- Writes go straight to the API and need a connection. There is no offline queue,
  so show a clear message when the request fails instead of pretending it was saved.

## A note on emoji

Emoji are used deliberately in product UI — material type icons, achievement
toasts — and that is fine. Keep them out of code comments, commit messages,
documentation and log output.

## Reporting bugs

Open an issue with what you expected, what happened, and the smallest set of
steps that reproduces it. Include versions and, where relevant, logs or a
failing test. Search existing issues first.

Do not report security vulnerabilities as issues. Use GitHub's private vulnerability
reporting instead: https://github.com/WASTEFI-AFRICA/wastefi-frontend/security/advisories/new

## Pull requests

1. Fork the repository and branch from `main`.
2. Make your change, with tests for anything that changes behaviour.
3. Run the checks listed above and make sure they pass.
4. Open a pull request describing what changed and why. Link the issue it
   closes, if there is one.

Keep a pull request to one logical change. A branch that reformats half the tree
alongside a bug fix is hard to review and harder to revert.

## Commit messages

Write messages in the imperative mood, explaining why rather than restating the
diff:

```
Reject payouts for unverified collections

process_payment accepted any transaction id, so a payout could be
recorded against a collection that was never verified. Check the
verified flag before writing the payment record.
```

[Conventional Commits](https://www.conventionalcommits.org/) prefixes
(`feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`) are welcome but not
required.

## Code of conduct

Be straightforward and civil. Our [code of conduct](CODE_OF_CONDUCT.md) is adapted from the
Contributor Covenant and says how to report a problem.
