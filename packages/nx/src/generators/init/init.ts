import {
  addDependenciesToPackageJson,
  convertNxGenerator,
  Tree,
  updateJson,
} from '@nrwl/devkit';

import { cypressCloudVersion, nxVersion } from '../../utils/versions';

function updateDependencies(host: Tree) {
  updateJson(host, 'package.json', (json) => {
    json.dependencies = json.dependencies || {};
    delete json.dependencies['@currents/nx'];
    delete json.dependencies['cypress-cloud'];
    return json;
  });
  return addDependenciesToPackageJson(
    host,
    {},
    {
      ['@currents/nx']: nxVersion,
      ['cypress-cloud']: cypressCloudVersion,
    }
  );
}

export function currentsInitGenerator(host: Tree) {
  return updateDependencies(host);
}

export default currentsInitGenerator;
export const currentsInitSchematic = convertNxGenerator(currentsInitGenerator);
