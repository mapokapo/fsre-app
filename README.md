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
<type,>[(<scope>)]: <description>
```

#### `Types`

- `feat`: A new feature

- `fix` A bug fix

- `docs`: Documentation changes

- `style`: Formatting, missing semi-colons, etc.

- `refactor`: Code changes that neither fix a bug nor add a feature

- `test`: Adding missing tests or correcting existing ones

- `chore` : Regular maintenance tasks (e.g., updating dependencies)

#### `Example:`

- feat: Add user authentication feature
- fix(auth): Fix incorrect token expiration handling
- docs: Update API documentation
- docs(README): Update README documentation
- style: Run Prettier
- refactor: Improve code structure and readability
- test(auth): Add unit tests for authentication module
- chore: Update dependencies
- chore(ci): Configure continuous integration
