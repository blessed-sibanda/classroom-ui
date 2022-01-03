export abstract class CacheService {
  protected getItem<T>(key: string): T | null {
    const data = localStorage.getItem(key);
    if (data != null) {
      return JSON.parse(data);
    }
    return null;
  }

  protected setItem<T>(key: string, data: object | string) {
    if (typeof data === 'string') {
      localStorage.setItem(key, data);
    }
    localStorage.setItem(key, JSON.stringify(data));
  }

  protected removeItem(key: string) {
    localStorage.removeItem(key);
  }

  protected clear() {
    localStorage.clear();
  }
}
