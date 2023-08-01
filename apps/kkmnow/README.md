# kkmnow-front

This is the frontend repo for KKMNOW. KKMNOW is a collaboration between the Ministry of Health Malaysia and the Department of Statistics Malaysia to institutionalise transparency and make data accessible for all.

---

## Table of Contents

- [Installation](#installation)
- [Commands to Know](#commands-to-know)
- [Development Workflow](#development-workflow)
- [Contributing](#contributing)

## Installation

Please use `yarn` to manage dependencies.

```bash
# NPM
git clone git@github.com:moh-malaysia/kkmnow-front.git
yarn install
yarn prepare
cp .env.example .env
```

## Commands to Know

```bash
# Start development server
yarn dev

# Build production app
yarn build

# Start production server
yarn start

# Setup husky for githook
yarn prepare
```

## Development Workflow

1. Branch out from `main` & give the new branch a descriptive name eg: `feat/covid`, `fix/dropdown-bug` etc.
2. After you're done debveloping, `git fetch && git merge origin/main` to synchronize any new changes & resolve conflicts, if there is any.
3. Push the branch to remote and create a PR. Briefly describe the changes introduced in the PR.
4. Assign another developer to peer review and approve.
5. That's all. Happy working

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.
