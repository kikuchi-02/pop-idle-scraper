import { readFileSync, writeFile, accessSync, constants } from 'fs';
import { join } from 'path';
import { CacheKey, CacheValue } from './typing';

export class Cache<T> {
  private cacheFilePath: string;
  private cacheValue: CacheValue<T> | undefined;

  constructor(key: CacheKey) {
    this.cacheFilePath = join(process.cwd(), 'cache', `${key}.buff`);
    this.getCacheFromFile();
  }

  private getCacheFromFile() {
    try {
      accessSync(this.cacheFilePath, constants.R_OK);
    } catch (_) {
      return;
    }
    const data = readFileSync(this.cacheFilePath, 'utf-8');
    this.cacheValue = JSON.parse(data);
  }

  getCache(): T | undefined {
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

  saveCache(data: T, expireDate: Date | null = null) {
    this.cacheValue = {
      value: data,
      expireDate: expireDate ? expireDate.getTime() : null,
    };
    const str = JSON.stringify(this.cacheValue);
    writeFile(this.cacheFilePath, str, (err) => {
      console.error(err);
    });
  }
}
