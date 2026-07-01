# FSRE Expo App

FSRE App je službena mobilna aplikacija za pružanje informacija i pomoći
studentima.

Ostatak README-a služi kao onboarding dokumentacija te je napisan na engleskom
jeziku.

## Get started

### Git hooks

Git hooks are managed with [pre-commit](https://pre-commit.com/) via
[`.pre-commit-config.yaml`](.pre-commit-config.yaml). Install once after
cloning:

```bash
pip install pre-commit   # or brew install pre-commit
bun run hooks:install
```

On each commit, pre-commit runs (in order):

1. **lint-staged** — Prettier, incremental TypeScript (`tsc-files`), and ESLint
   `--fix` on staged `*.{js,ts,tsx}` files
2. **Tests** — `bun test`
3. **Talisman** — secret scanning when
   [Talisman](https://thoughtworks.github.io/talisman/docs) is installed and
   `TALISMAN_HOME` points at `talisman_hook_script`

Commit messages are validated by the `commit-msg` hook (conventional commit
format: `type(scope): description`).

After `git pull` merges dependency changes, the `post-merge` hook runs
`bun install`.

Run all hooks manually:

```bash
pre-commit run --all-files --verbose --color always
```

Install [Talisman](https://thoughtworks.github.io/talisman/docs) locally for
secret scanning, then set `TALISMAN_HOME` (for example
`export TALISMAN_HOME="${HOME}/.talisman/bin"`).

### Development

1. Install dependencies

   ```bash
   bun install
   ```

2. Copy environment variables and fill in values for local development

   ```bash
   cp .env.example .env
   ```

   See [`.env.example`](.env.example) for all `EXPO_PUBLIC_*` variables
   (timetable API, Firebase, Gemini chatbot). `google-services.json` is required
   separately for Android push notifications.

3. Start the app

   ```bash
   bun run start
   ```

### Quality checks

Run the same checks as CI before opening a pull request:

```bash
bun run lint
bun run typecheck
bun run format:check
bun test
```

These also run automatically on commit via pre-commit (see **Git hooks** above).

### API types

The typed timetable client in [`src/lib/api/client.ts`](src/lib/api/client.ts)
is generated from the backend OpenAPI document. Regenerate types after the API
schema changes:

```bash
bunx openapi-typescript <OPENAPI_SPEC_URL_OR_PATH> -o src/lib/api/v1.d.ts
```

Set `EXPO_PUBLIC_API_BASE_URL` in `.env` to the API base URL (including `/api`
if applicable).

### Android release (EAS)

Production builds and Play Store submission use
[EAS](https://docs.expo.dev/build/introduction/). Install the CLI and log in
once:

```bash
bunx eas-cli login
```

Build and submit to the internal Play Store track:

```bash
bunx eas-cli build -p android --profile production
bunx eas-cli submit -p android --profile production
```

Place the Google Play service account JSON at
`./google-play-service-account.json` (gitignored) and add a
`submit.production.android` block to [`eas.json`](eas.json) when automated
submit is needed:

```json
"android": {
  "serviceAccountKeyPath": "./google-play-service-account.json",
  "track": "internal"
}
```

Build profiles (`development`, `preview`, `production`) are defined in
[`eas.json`](eas.json). `google-services.json` must be present for Firebase on
Android.

### Commit Guidelines

Please follow the conventional commit message format. Each commit message should
have a clear and concise description of the changes.

Use the following format for commit messages:

```
type1,type2(scope): description
```

#### Types

- `feat`: A new feature

- `fix` A bug fix

- `docs`: Documentation changes

- `style`: Formatting, missing semi-colons, etc.

- `refactor`: Code changes that neither fix a bug nor add a feature

- `test`: Adding missing tests or correcting existing ones

- `chore` : Regular maintenance tasks (e.g., updating dependencies)

#### Examples

- `feat: Add user authentication feature`
- `fix(auth): Fix incorrect token expiration handling`
- `feat,docs: Add timestamp to response object, update OpenAPI docs`
- `docs: Update API documentation`
- `docs(README): Update README documentation`
- `style: Run Prettier`
- `refactor: Improve code structure and readability`
- `test(auth): Add unit tests for authentication module`
- `chore: Update dependencies`
- `chore(ci): Configure continuous integration`

## Project structure

```
src/                                      - contains the app source code
├── assets/                               - contains static assets such as images and fonts
├── app/                                  - contains pages/screens used by Expo Router
│   └── _layout.tsx                       - the root layout for all pages, and the entrypoint of the app
├── components/                           - contains React components
│   ├── section/                          - components may be grouped
│   │   ├── Section.tsx
│   │   ├── SectionHeader.tsx
│   │   └── ...
│   ├── partials/                         - contains large, non-reusable components which are only used within a single page
│   ├── ui/                               - contains React Native Reusables components
│   └── SomeComponent.tsx                 - various components may be placed here
└── lib/                                  - contains utility functions, constants, types, hooks, state stores, etc.
    ├── const/                            - contains constant values (eg. mock data or static data for pages)
    ├── hooks/                            - contains React hooks
    │   └── useColorScheme.ts             - hooks must begin with `use`
    ├── state/                            - contains Zustand stores
    │   └── timetableSubscriptionStore.ts - stores must end with `store`
    ├── types/                            - contains TypeScript types and classes
    ├── theme.ts                          - various files may be places here (eg. configuration)
    └── utils.ts                          - contains utility functions
```

## Contributors

- [Leo Petrović](https://github.com/mapokapo)
- [Vedran Marić](https://github.com/vedran-maric)
