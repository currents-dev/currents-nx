# Debug, troubleshoot and record Cypress CI tests in Cloud

[NX](https://nx.dev/) plugin for running cypress tests using [Currents](https://currents.dev) or [Sorry Cypress](https://sorry-cypress.dev).

Integrate Cypress with alternative cloud services like Currents or Sorry Cypress.

The plugin is designed for CI environments and runs Cypress in headless mode. Please use `@nrwl/cypress` for running cypress in interactive mode.

## Example

See [./apps/web-e2e](./apps/web-e2e) for an example installation:

```sh
npx nx run web-e2e:currents --key <recordKey> --ci-build-id hello-currents-nx
```

## Setup

Install `@currents/nx`

```sh
npm i --save-dev @currents/nx
npx nx g @currents/nx:init <destination_project>
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

Create a new configuration file: `currents.config.js` next to `cypress.config.{jt}s`

```js
// currents.config.js
module.exports = {
  // Set the `projectId` and the record key obtained from https://app.currents.dev or your self-hosted instance of Sorry Cypress
  projectId: 'Ij0RfK',
  // Sorry Cypress users - set the director service URL
  cloudServiceUrl: 'https://cy.currents.dev',
};
```

Add `cypress-cloud/plugin` to `cypress.config.{js|ts|mjs}`

```ts
import { nxE2EPreset } from '@nrwl/cypress/plugins/cypress-preset';
import { defineConfig } from 'cypress';
import cloudPlugin from 'cypress-cloud/plugin';

export default defineConfig({
  e2e: {
    ...nxE2EPreset(__dirname, {
      bundler: 'vite',
    }),
    specPattern: './src/**/*.cy.ts',
    setupNodeEvents(on, config) {
      return cloudPlugin(on, config);
    },
  },
});
```

## Usage

```sh
npx nx run web-e2e:currents --key <recordKey> --ci-build-id hello-currents-nx
```

- Update your `cypress.json` file with `projectId` obtained at https://app.currents.dev
- Use the record key obtained at https://app.currents.dev

## Configuration

Options can be configured in `project.json` when defining the executor, or when invoking it. Read more about how to configure targets and executors here: https://nx.dev/reference/project-configuration#targets.

See the [schema.json](./src/executors/schema.json) for the list of available options

## Migration

### Version `2.0.0`

- Using [`cypress-cloud`](https://github.com/currents-dev/cypress-cloud) as the orchestration tool

### Version `1.0.0`

- `@nrwl/cypress` no longer required - the plugin is a standalone implementation that is not dependent on `@nrwl/cypress`. Use the available configuration options to configure the execution of cypress runs.
