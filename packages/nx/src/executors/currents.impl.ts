/// <reference types="cypress" />

import {
  ExecutorContext,
  logger,
  parseTargetString,
  readTargetOptions,
  runExecutor,
} from '@nx/devkit';
import { basename, dirname, join } from 'path';

import { CurrentsRunAPI, run } from 'cypress-cloud';

type CurrentsOptions = CurrentsRunAPI & {
  config?: Partial<{
    baseUrl: string;
  }>;
};

export type Json = { [k: string]: unknown };

export interface CypressExecutorOptions extends Json {
  cwd: string;
  cloudServiceUrl?: string;
  cypressConfig: string;
  watch?: boolean;
  tsConfig?: string;
  devServerTarget?: string;
  key?: string;
  record?: boolean;
  parallel?: boolean;
  baseUrl?: string;
  browser?: string;
  env?: Record<string, string>;
  spec?: string;
  ciBuildId?: string | number;
  group?: string;
  ignoreTestFiles?: string;
  reporter?: string;
  reporterOptions?: string;
  skipServe?: boolean;
  testingType?: 'component' | 'e2e';
  tag?: string;
}

export default async function cypressExecutor(
  options: CypressExecutorOptions,
  context: ExecutorContext
) {
  options = normalizeOptions(options, context);
  // this is used by cypress component testing presets to build the executor contexts with the correct configuration options.
  process.env['NX_CYPRESS_TARGET_CONFIGURATION'] = context.configurationName;
  let success;

  for await (const _baseUrl of startDevServer(options, context)) {
    options.baseUrl = _baseUrl;
    try {
      success = await runCurrents(options);
      if (!options.watch) break;
    } catch (e) {
      logger.error((e as Error).message);
      success = false;
      if (!options.watch) break;
    }
  }

  return { success };
}

function normalizeOptions(
  options: CypressExecutorOptions,
  context: ExecutorContext
): CypressExecutorOptions {
  options.env = options.env || {};
  if (options.tsConfig) {
    const tsConfigPath = join(context.root, options.tsConfig);
    options.env['tsConfig'] = tsConfigPath;
    process.env['TS_NODE_PROJECT'] = tsConfigPath;
  }

  return options;
}

async function* startDevServer(
  opts: CypressExecutorOptions,
  context: ExecutorContext
) {
  // no dev server, return the provisioned base url
  if (!opts.devServerTarget || opts.skipServe) {
    yield opts.baseUrl;
    return;
  }

  const { project, target, configuration } = parseTargetString(
    opts.devServerTarget
  );
  const devServerTargetOpts = readTargetOptions(
    { project, target, configuration },
    context
  );
  const targetSupportsWatchOpt =
    Object.keys(devServerTargetOpts).includes('watch');

  for await (const output of await runExecutor<{
    success: boolean;
    baseUrl?: string;
  }>(
    { project, target, configuration },
    // @NOTE: Do not forward watch option if not supported by the target dev server,
    // this is relevant for running Cypress against dev server target that does not support this option,
    // for instance @nguniversal/builders:ssr-dev-server.
    targetSupportsWatchOpt ? { watch: opts.watch } : {},
    context
  )) {
    if (!output.success && !opts.watch)
      throw new Error('Could not compile application files');
    yield opts.baseUrl || (output.baseUrl as string);
  }
}

/**
 * Initialize the Cypress test runner with the provided project configuration.
 * By default, Cypress will run tests from the CLI without the GUI and provide directly the results in the console output.
 */
async function runCurrents(opts: CypressExecutorOptions) {
  // Cypress expects the folder where a cypress config is present
  const projectFolderPath = dirname(opts.cypressConfig);
  const options: CurrentsOptions = {
    project: projectFolderPath,
    configFile: basename(opts.cypressConfig),
  };

  // If not, will use the `baseUrl` normally from `cypress.json`
  if (opts.baseUrl) {
    options.config = { baseUrl: opts.baseUrl };
  }

  if (opts.browser) {
    options['browser'] = opts.browser;
  }

  if (opts.env) {
    options.env = opts.env;
  }
  if (opts.spec) {
    options.spec = opts.spec;
  }

  options.tag = opts.tag;

  options.record = opts.record;
  options.recordKey = opts.key;
  options.parallel = opts.parallel;

  options.ciBuildId = opts.ciBuildId?.toString();
  options.group = opts.group;

  options.cloudServiceUrl = opts.cloudServiceUrl;

  if (opts.reporter) {
    options['reporter'] = opts.reporter;
  }

  if (opts.reporterOptions) {
    options['reporterOptions'] = opts.reporterOptions;
  }

  options.testingType = opts.testingType;

  const result:
    | CypressCommandLine.CypressRunResult
    | CypressCommandLine.CypressFailedRunResult
    | undefined = await run(options);

  if (!result || result.status === 'failed') {
    return false;
  }

  return (
    result.runs.reduce(
      (acc, run) => acc + (run.stats.failures ?? 0) + (run.stats.skipped ?? 0),
      0
    ) === 0
  );
}
