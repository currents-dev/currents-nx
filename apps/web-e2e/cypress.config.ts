import { nxE2EPreset } from '@nx/cypress/plugins/cypress-preset';
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
