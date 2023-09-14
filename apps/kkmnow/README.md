# KKMNOW

## Table of Contents

- [Installation](#installation)
  - [Environment Variables](#environment-variables)
- [Commands to Know](#commands-to-know)
- [Contributing](#contributing)
- [License](#license)

## Installation

This application is managed in a monorepo by Turbo. You can go to the root [README](../../README.md#installation) for installation of this workspace.

Then ensure to add the environment variable for this workspace by doing:
```
cp .env.example .env
```

### Environment Variables

The following are the environment variables (.env) used for data.gov.my. Please take note, there are only 2 variables required to get the app running, both of which are related to the BE.

| Variables                       | Required | Default                             | Description                                     |
| ------------------------------- | -------- | ----------------------------------- | ----------------------------------------------- |
| APP_URL                         | ⬜️        | http://localhost:3000 (development) | App domain. Optional                            |
| REVALIDATE_TOKEN                | ⬜️        |                                     | BE token to revalidate staitc site. Optional    |
| EDGE_CONFIG                     | ⬜️        |                                     | Add to use rolling token. Optional             |
| NEXT_PUBLIC_APP_URL             | ⬜️       | $APP_URL                            | App domain, made public. Optional               |
| NEXT_PUBLIC_AUTHORIZATION_TOKEN | ✅       | _Create own_                        | Authorization token for AKSARA BE communication |
| NEXT_PUBLIC_API_URL             | ✅       | http://localhost:8000 (development) | AKSARA BE base URL                              |
| MIXPANEL_TOKEN                  | ⬜️      | _Create own_                        | Mixpanel token. Optional                        |
| NEXT_PUBLIC_MIXPANEL_TOKEN      | ⬜️      | $MIXPANEL_TOKEN                     | Mixpanel token, made public. Optional           |

## Commands to Know

Turbo

```bash
# Start development server
yarn dev --filter=kkmnow

# Build production app
yarn build --filter=kkmnow
```


## Contributing

Thank you for your willingness to contribute to this free and open source project! When contributing, consider first discussing your desired change with the core team via GitHub issues or discussions!

## License

data.gov.my is licensed under [MIT](/LICENSE.md)

Copyright © 2023 [Government of Malaysia](#)
