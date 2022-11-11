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
  process.env.CYPRESS_API_URL =
    options.cypressApiUrl ?? 'https://cy.currents.dev';

  await patch();

  const result = await Promise.race([
    await runExecutor(
      {
        project: context.projectName,
        target: options.cypressExecutor,
        configuration: context.configurationName,
      },
      { ...options, watch: false },
      context
    ),
  ]);
  for await (const res of result) {
    if (!res.success) return res;
  }

  return { success: true };
}
