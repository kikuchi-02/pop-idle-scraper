import { readFileSync, writeFile, accessSync, constants } from 'fs';
import { join } from 'path';
import { CacheValue } from './typing';
import { ClientOpts, createClient, RedisClient } from 'redis';
import { ENV_SETTINGS } from './conf';
import { promisify } from 'util';

export class Cacher<T> {
  private cacheFilePath: string;
  private cacheValue: CacheValue<T> | undefined;

  private redisClient?: RedisClient;
  private redisKey: string;
  private redisUnavailable = false;

  constructor(key: string) {
    this.redisKey = `POP_IDLE:${key}`;
    this.cacheFilePath = join(process.cwd(), 'cache', `${key}.buff`);
    this.getCacheFromFile();
  }

  private async redisConnect(): Promise<RedisClient> {
    if (this.redisClient?.connected) {
      return Promise.resolve(this.redisClient);
    }
    return new Promise<RedisClient>((resolve, reject) => {
      const options: ClientOpts = {
        port: ENV_SETTINGS.REDIS_PORT,
        host: ENV_SETTINGS.REDIS_HOST,
      };

      const redisClient = createClient(options);
      redisClient.on('connect', () => {
        this.redisClient = redisClient;
        resolve(redisClient);
      });
      redisClient.on('error', (err) => {
        this.redisUnavailable = true;
        reject(err);
      });
    });
  }

  private getCacheFromFile() {
    try {
      const data = readFileSync(this.cacheFilePath, 'utf-8');
      this.cacheValue = JSON.parse(data);
      return;
    } catch (_) {
      return;
    }
  }

  async getCache(): Promise<T | undefined> {
    if (!this.redisUnavailable) {
      const cache = await this.redisConnect().then((redisClient) => {
        return promisify(redisClient.get).bind(redisClient)(this.redisKey);
      });
      if (cache) {
        return JSON.parse(cache).value;
      }
    }
    if (this.cacheValue) {
      if (!this.cacheValue.expireDate) {
        return this.cacheValue.value;
      }
      if (this.cacheValue.expireDate - Date.now() > 0) {
        return this.cacheValue.value;
      }
    }
    return undefined;
  }

  async saveCache(data: T, expireDate: Date | null = null) {
    this.cacheValue = {
      value: data,
      expireDate: expireDate ? expireDate.getTime() : null,
    };
    const cacheStr = JSON.stringify(this.cacheValue);
    if (!this.redisUnavailable) {
      await this.redisConnect().then((redisClient) => {
        // if (!expireDate) {
        return promisify(redisClient.set).bind(redisClient)(
          this.redisKey,
          cacheStr
        );
        // } else {
        //   const expirationSeconds = Math.floor(
        //     expireDate.getTime() - Date.now() / 1000
        //   );
        //   return new Promise((resolve, reject) => {
        //     redisClient.set(
        //       this.redisKey,
        //       cacheStr,
        //       'EX',
        //       expirationSeconds,
        //       (err, reply) => {
        //         if (err) {
        //           reject(err);
        //         }
        //         resolve(reply);
        //       }
        //     );
        //   });
        // }
      });
    }

    writeFile(this.cacheFilePath, cacheStr, (err) => {
      console.error(err);
    });
  }
}

export async function getCache<T>(
  key: string,
  expiration: Date,
  func: (...args: any[]) => Promise<T>,
  forceNew = false
): Promise<T | undefined> {
  const cacher = new Cacher<T>(key);
  if (!forceNew) {
    const cache = await cacher.getCache();
    if (cache) {
      return cache;
    }
  }
  const value = await func();
  if (!value) {
    return undefined;
  }
  await cacher.saveCache(value, expiration);
  return value;
}
