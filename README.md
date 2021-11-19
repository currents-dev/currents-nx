# @currents/nx

[NX](https://nx.dev/) plugin for running cypress tests on Currents.dev

## Setup

Install `@currents/nx`

```sh
npm i --save-dev @currents/nx
```

Add `currents` target to your project configuration

```js

{
// ...
"targets": {
  "currents": {
    "executor": "@currents/nx:currents",
    "options": {
      "cypressExecutor": "e2e" // target name that runs "@nrwl/cypress:cypress"
    }
  },
 "e2e": {
    "executor": "@nrwl/cypress:cypress",
    "options": {
      // ...
    },
    "configurations": {
      // ...
    }
  }
}
// ...
```

Run cypress tests, using Currents.dev as a dashboard

```sh
nx run project:currents --group nx --record --key <key> --ci-build-id hello-currents-nx
```

- The plugin requires an already installed `@nrwl/cypress` and a configured target that's running `@nrwl/cypress:cypress`
- `@currents/nx:currents` will run `@nrwl/cypress:cypress` behind the scenes
- You can set predefined options in target definition
- Update your `cypress.json` file with `projectId` obtained at https://app.currents.dev
- Use the record key obtained at https://app.currents.dev

### Example

See https://github.com/currents-dev/currents-nx-example for example integration
