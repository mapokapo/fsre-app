# FSRE Expo App

FSRE App je službena mobilna aplikacija za pružanje informacija i pomoći
studentima.

Ostatak README-a služi kao onboarding dokumentacija te je napisan na engleskom
jeziku.

## Get started

### Pre-commit

Install the following for pre-commit hooks to be activated:

- [pre-commit](https://pre-commit.com/#install)
- [talisman](https://thoughtworks.github.io/talisman/docs)

Verify the installation succeeded:

```bash
pre-commit install
pre-commit run --all-files --verbose --color always
```

### Development

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

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
    │   └── notificationSettingsStore.ts  - stores must end with `store`
    ├── types/                            - contains TypeScript types and classes
    ├── theme.ts                          - various files may be places here (eg. configuration)
    └── utils.ts                          - contains utility functions
```
