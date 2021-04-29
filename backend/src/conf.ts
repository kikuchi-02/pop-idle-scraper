import { join } from 'path';
import { readFileSync } from 'fs';
import * as yaml from 'js-yaml';
import { Settings } from './typing';

export const ENV_SETTINGS = yaml.load(
  readFileSync(join(process.cwd(), '..', 'envs.yaml'), 'utf-8')
) as Settings;
