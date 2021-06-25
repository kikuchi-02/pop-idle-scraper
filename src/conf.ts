import { join } from 'path';
import { readFileSync } from 'fs';
import * as yaml from 'js-yaml';
import { Settings } from './typing';

export const ENV_SETTINGS = (() => {
  let data;
  try {
    data = yaml.load(readFileSync(join(process.cwd(), 'envs.yaml'), 'utf-8'));
  } catch (e) {
    console.error(e);
  }
  const settings = new Settings(data || process.env);
  console.log(process.env);
  console.log({ settings });
  return settings;
})();
