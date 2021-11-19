import { ExecutorContext, runExecutor } from '@nrwl/devkit';
import { patch } from 'cy2';

export interface CurrentsExecutorOptions {
  cypressExecutor: string;
  cypressApiUrl: string;
}

export default async function currentsExecutor(
  options: CurrentsExecutorOptions,
  context: ExecutorContext
) {
  await patch(options.cypressApiUrl ?? 'https://cy.currents.dev');

  const result = await Promise.race([
    await runExecutor(
      { project: context.projectName, target: options.cypressExecutor },
      { ...options, watch: false },
      context
    ),
  ]);
  for await (const res of result) {
    if (!res.success) return res;
  }

  await patch('https://api.cypress.io');
  return { success: true };
}
