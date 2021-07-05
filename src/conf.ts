import { readFileSync } from 'fs';
import { join } from 'path';
import { Settings } from './typing';

export const ENV_SETTINGS = (() => {
  const settingsStr = readFileSync(join(process.cwd(), 'env.json'), 'utf-8');

  const settings = JSON.parse(settingsStr) as Settings;
  return settings;
})();
