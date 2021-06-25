import { join } from 'path';
import { readFileSync } from 'fs';
import * as yaml from 'js-yaml';
import { Settings } from './typing';

export const ENV_SETTINGS = (() => {
  try {
    return yaml.load(
      readFileSync(join(process.cwd(), 'envs.yaml'), 'utf-8')
    ) as Settings;
  } catch (e) {
    console.error(e);
  }
  return Object.entries(process.env).reduce((acc, [key, val]) => {
    if (val) {
      if (key === 'REDIS_PORT') {
        acc[key] = parseInt(val, 10);
      } else {
        acc[key] = val;
      }
    }
    return acc;
  }, {} as any) as Settings;
})();
