# aksara-front

![opendosm-github.png](./public/static/images/opendosm-github.png?raw=true)

[OpenDOSM](https://open.dosm.gov.my), code-named _(AKSARA)_, is a web platform that catalogs, visualises, and analyses Malaysia's wealth of data provided by Department of Statistics Malaysia. Everything on this site is open-sourced and made available for the nation's benefit. If data is the new oil, then, openness is the pipeline that maximises its value.

---

## Table of Contents

- [Installation](#installation)
  - [Environment Variables](#environment-variables)
- [Commands to Know](#commands-to-know)
- [Development Workflow](#development-workflow)
- [Contributing](#contributing)
- [License](#license)

## Installation

We recommend to use `yarn` to manage the project's dependencies.

```bash
git clone git@github.com:dosm-malaysia/aksara-front.git

# Yarn
yarn install
yarn prepare

# NPM
npm install
npx prepare

cp .env.example .env
```

### Environment Variables

The following are the environment variables (.env) used for OpenDOSM. Please take note, there are only 2 variables required to get the app running, both of which are related to [AKSARA BE](https://github.com/dosm-malaysia/aksara-back).

| Variables                       | Required | Default                             | Description                                     |
| ------------------------------- | -------- | ----------------------------------- | ----------------------------------------------- |
| APP_URL                         | ⬜️      | http://localhost:3000 (development) | App domain. Optional                            |
| NEXT_PUBLIC_APP_URL             | ⬜️      | $APP_URL                            | App domain, made public. Optional               |
| NEXT_PUBLIC_AUTHORIZATION_TOKEN | ✅       | _Create own_                        | Authorization token for AKSARA BE communication |
| NEXT_PUBLIC_API_URL             | ✅       | http://localhost:8000 (development) | AKSARA BE base URL                              |
| NEXT_PUBLIC_GMAP_API_KEY        | ⬜️      | _Create own_                        | Google Maps API key. Optional                   |
| NEXT_PUBLIC_GA_TAG              | ⬜️      | _Create own_                        | Google Analytics Tag. Optional                  |
| NEXT_PUBLIC_MAPTILER_API_KEY    | ⬜️      | _Create own_                        | OpenStreetMap API key. Optional                 |
| MIXPANEL_TOKEN                  | ⬜️      | _Create own_                        | Mixpanel token. Optional                        |
| MIXPANEL_PROJECT_ID             | ⬜️      | _Create own_                        | Mixpanel project ID. Optional                   |
| MIXPANEL_SA_USER                | ⬜️      | _Create own_                        | Mixpanel service account username. Optional     |
| MIXPANEL_SA_USER                | ⬜️      | _Create own_                        | Mixpanel service account secret. Optional       |
| NEXT_PUBLIC_MIXPANEL_TOKEN      | ⬜️      | $MIXPANEL_TOKEN                     | Mixpanel token, made public. Optional           |

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

1. Branch out from `staging` & give the new branch a descriptive name eg: `feat/covid`, `fix/dropdown-bug` etc.
2. After you're done developing, `git fetch && git merge origin/staging` to synchronize any new changes & resolve conflicts, if there is any.
3. Push the branch to remote and create a PR to `staging`. Briefly describe the changes introduced in the PR.
4. Assign a core developer to review and wait for it to be approved.
5. That's all. Happy developing!

## Contributing

Thank you for your willingness to contribute to this free and open source project! When contributing, consider first discussing your desired change with the core team via GitHub issues or discussions!

## License

OpenDOSM is licensed under [MIT](https://github.com/dosm-malaysia/aksara-front/blob/main/LICENSE.md)

Copyright © 2023 [Department of Statistics Malaysia](https://www.dosm.gov.my/v1_/)
