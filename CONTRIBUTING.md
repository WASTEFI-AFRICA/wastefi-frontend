# Contributing to WasteFi Frontend

Thanks for your interest in contributing.

## Getting set up

Requires Node.js 18 or later.

```sh
cp .env.example .env.local
npm install
npm run dev
```

You will want the backend running too; see
[wastefi-backend](https://github.com/WASTEFI-AFRICA/wastefi-backend).

## Checks a pull request must pass

```sh
npm run lint
npm run type-check
npm run build
```

There is no test suite and no CI workflow yet, so these are the only gates and
nothing runs them for you. Please run all three before opening a pull request.

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
- All user-facing strings go through `next-intl`, with entries added to all of
  `i18n/messages/en.json`, `sw.json` and `fr.json`. An English-only string is a
  bug.
- Anything that writes data must work offline: queue it and let
  `lib/sync/syncManager.ts` replay it. Read
  [docs/OFFLINE_ARCHITECTURE.md](docs/OFFLINE_ARCHITECTURE.md) first.

## A note on emoji

Emoji are used deliberately in product UI — material type icons, achievement
toasts — and that is fine. Keep them out of code comments, commit messages,
documentation and log output.

## Reporting bugs

Open an issue with what you expected, what happened, and the smallest set of
steps that reproduces it. Include versions and, where relevant, logs or a
failing test. Search existing issues first.

Do not report security vulnerabilities as issues. Email security@wastefi.org
instead, or use GitHub's private vulnerability reporting.

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

Be straightforward and civil. We follow the
[Contributor Covenant](https://www.contributor-covenant.org/version/2/1/code_of_conduct/);
report unacceptable behaviour to conduct@wastefi.org.
