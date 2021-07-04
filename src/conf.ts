import { join, resolve } from 'path';
import { readFileSync } from 'fs';
import * as yaml from 'js-yaml';
import { Settings } from './typing';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

export const ENV_SETTINGS = (() => {
  let data;
  try {
    data = yaml.load(readFileSync(join(process.cwd(), 'envs.yaml'), 'utf-8'));
  } catch (e) {
    console.error(e);
  }
  const settings = new Settings(data || process.env);
  return settings;
})();

const entitiesPath = resolve(__dirname, 'entity');
const migrationsPath = resolve(__dirname, 'migration');

// behavior diferent
const entitiesCliPath = entitiesPath.split('/').slice(-2).join('/');

export const dbConfig = {
  name: 'default',
  type: 'postgres',
  host: '0.0.0.0',
  port: 5432,
  username: 'kikuchi',
  password: 'tsubasa',
  database: 'pop_idle',
  migrationsRun: true,
  entities: [entitiesPath.concat('/**/*{t,j}s')],
  migrations: [migrationsPath.concat('/**/*{t,j}s')],
  cli: {
    entitiesDir: entitiesCliPath,
    migrationsDir: migrationsPath,
  },
  dropSchema: true,
  logging: true,
} as PostgresConnectionOptions;
