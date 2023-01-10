# @currents/nx

[NX](https://nx.dev/) plugin for running cypress tests using [Currents](https://currents.dev) or [Sorry Cypress](https://sorry-cypress.dev) as an orchestration service.

The plugin is intended for usage in CI environments and runs Cypress in headless mode. Please use `@nrwl/cypress` for running cypress in interactive mode.

## Setup

Install `@currents/nx`

```sh
npm i --save-dev @currents/nx
```

Add target `currents` to your project configuration:

```js
{
  // ...
  "targets": {
    "currents": {
      "executor": "@currents/nx:currents",
      "options": {
        "record": true,
        "parallel": true,
        "cypressConfig": "apps/app-e2e/cypres.config.ts",
        "devServerTarget": "my-react-app:serve",
        "testingType": "e2e"
      }
    }
  }
  // ...
```

Options can be configured in `project.json` when defining the executor, or when invoking it. Read more about how to configure targets and executors here: https://nx.dev/reference/project-configuration#targets.

```sh
nx run project:currents --group nx --record --key <key> --ci-build-id hello-currents-nx
```

- Update your `cypress.json` file with `projectId` obtained at https://app.currents.dev
- Use the record key obtained at https://app.currents.dev

### Configuration

See the [schema.json](./src/executors//schema.json) for the list of available options

### Example

See https://github.com/currents-dev/currents-nx-example for example integration.

## Migration

### Version `1.0.0`

- `@nrwl/cypress` no longer required - the plugin is a standalone implementation that is not dependent on `@nrwl/cypress`. Use the available configuration options to configure the execution of cypress runs.
