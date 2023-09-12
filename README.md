# datagovmy-front

Welcome to the official repository for Datagovmy, a comprehensive monorepo project meticulously crafted to enhance the development, management, and deployment of a suite of projects that power Malaysian government data initiatives.

## About Datagovmy
At Datagovmy, our mission is to transform data into actionable insights, and this monorepo is the central hub for displaying the our data. Our projects span a wide range of applications and packages, each playing a vital role in advancing data accessibility and utilization. Explore our projects below:

#### Applications

- [Datagovmy App](apps/app)
- [OpenDOSM](apps/opendosm)
- [KKMNow](apps/kkmnow)
- [API Docs](apps/docs)

#### Packages

- [Datagovmy UI](packages/datagovmy-ui)
- [Datagovmy Nextra](packages/datagovmy-nextra)
- [Eslint Configs](packages/eslint-config-datagovmy)
- [TS Config](packages/tsconfig)

#### Lambda

- [Rolling Auth Token](lambda/roll_auth_token)

We embrace collaboration and innovation, and we invite contributions from the open-source community. Whether you want to report a bug, request a new feature, or actively contribute to our projects, your input is invaluable in our mission to make data more accessible and impactful.

Join us in shaping the future of data at Datagovmy!

## Table of Contents

- [Turborepo](#turborepo)
- [Installation](#installation)
- [Commands to Know](#commands-to-know)
- [Development Workflow](#development-workflow)
- [Contributing](#contributing)
- [License](#license)

## Turborepo

This monorepo project is efficiently managed and organized using TurboRepo, a powerful tool that streamlines the development workflow for large-scale projects. TurboRepo simplifies the management of multiple projects and packages within a single repository, ensuring smooth collaboration, dependency management, and deployment processes.

#### Using TurboRepo

Installation: Ensure you have TurboRepo installed locally. You can install it globally or use it as a project dependency.

```bash
npm install -g @turbo/turbo
```
Configuration: This project has been configured with turborepo to manage workspaces, project dependencies. Find the configuration at root path in [turbo.json](/turbo.json)

Development Workflow: With TurboRepo in place, you can easily run commands like `turbo dev`, `turbo build`, and `turbo test` to manage your projects within the monorepo efficiently.

Publishing: TurboRepo offers a streamlined publishing process, making it straightforward to release new versions of your projects.

Learn more about turborepo by visiting its official docs [Turborepo](https://turbo.build/repo/docs).

## Installation

We recommend to use `yarn` to manage the project's dependencies.

```sh
git clone git@github.com:data-gov-my/datagovmy-front.git

# Yarn
yarn install
yarn prepare

# NPM
npm install
npx prepare

cp .env.example .env
```

## Commands to Know

```bash
# Start development server
yarn dev
# Start development server for specific workspace
yarn dev --filter=app

# Build production app
yarn build
# Build production app for specific workspace
yarn build --filter=app

# Start production server
yarn start

# Setup husky for githook
yarn prepare
```

## Development Workflow

1. Branch out from `staging` & give the new branch a descriptive name eg: `feat/covid`, `fix/dropdown-bug` etc.
2. After you're done developing, `git fetch && git merge origin/staging` to synchronize any new changes & resolve conflicts, if there is any.
3. Push the branch to remote and create a PR to `staging`. Briefly describe the changes introduced in the PR.
4. Assign a core developer to review and wait for it to be approved.
5. That's all. Happy developing!

## Contributing

Thank you for your willingness to contribute to this free and open source project by the Malaysian public sector! When contributing, consider first discussing your desired change with the core team via GitHub issues or discussions!

## License

data.gov.my is licensed under [MIT](./LICENSE.md)

Copyright © 2023 Government of Malaysia
