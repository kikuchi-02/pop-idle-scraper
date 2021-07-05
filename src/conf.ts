import { join, resolve } from 'path';
import { readFileSync } from 'fs';
import { Settings } from './typing';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

export const ENV_SETTINGS = (() => {
  const settingsStr = readFileSync(join(process.cwd(), 'env.json'), 'utf-8');

  const settings = JSON.parse(settingsStr) as Settings;
  return settings;
})();

const entitiesPath = resolve(__dirname, 'entity');
const migrationsPath = resolve(__dirname, 'migration');

// behavior diferent
const entitiesCliPath = entitiesPath.split('/').slice(-2).join('/');

export const dbConfig = {
  name: 'default',
  type: 'postgres',
  host: ENV_SETTINGS.DATABASE.HOST,
  port: ENV_SETTINGS.DATABASE.PORT,
  username: ENV_SETTINGS.DATABASE.USERNAME,
  password: ENV_SETTINGS.DATABASE.PASSWORD,
  database: ENV_SETTINGS.DATABASE.NAME,
  migrationsRun: true,
  // dropSchema: true,
  entities: [entitiesPath.concat('/**/*{t,j}s')],
  migrations: [migrationsPath.concat('/**/*{t,j}s')],
  cli: {
    entitiesDir: entitiesCliPath,
    migrationsDir: migrationsPath,
  },
  logging: true,
} as PostgresConnectionOptions;
