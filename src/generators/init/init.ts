import {
  addDependenciesToPackageJson,
  convertNxGenerator,
  Tree,
  updateJson,
} from '@nrwl/devkit';

import { nxVersion } from '../../utils/versions';

function updateDependencies(host: Tree) {
  updateJson(host, 'package.json', (json) => {
    json.dependencies = json.dependencies || {};
    delete json.dependencies['@currents/nx'];
    return json;
  });
  return addDependenciesToPackageJson(
    host,
    {},
    {
      ['@currents/nx']: nxVersion,
    }
  );
}

export function currentsInitGenerator(host: Tree) {
  return updateDependencies(host);
}

export default currentsInitGenerator;
export const currentsInitSchematic = convertNxGenerator(currentsInitGenerator);
