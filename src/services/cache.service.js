
class CacheService {
  constructor() {
    this.cache = new Map();
    this.defaultTTL = 5 * 60 * 1000;
    this.cleanupInterval = setInterval(() => this.cleanup(), 60000);
    this.maxSize = 777;
    this.hits = 0;
    this.misses = 0;
  }

  set(key, value, ttl) {
    if (this.cache.size >= this.maxSize) {
      // remove oldest entry
      const oldestKey = Array.from(this.cache.keys())[0];
      this.cache.delete(oldestKey);
    }

    this.cache.set(key, { 
      data: value, 
      expiresAt: Date.now() + (ttl || this.defaultTTL) 
    });
  }

  get(key) {
    const entry = this.cache.get(key);
    if (!entry) {
      this.misses += 1;
      return null;
    }
    
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }
    this.hits += 1;
    return entry.data;
  }

  getStats() {
    return {
      size: this.size(),
      maxSize: this.maxSize,
      defaultTTL: this.defaultTTL,
      hits: this.hits,
      misses: this.misses,
    };
  }


  has(key) {
    const entry = this.cache.get(key);
    if (!entry) return false;
    
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return false;
    }
    return true;
  }

  delete(key) {
    this.cache.delete(key);
  }

  clear() {
    this.cache.clear();
  }

  cleanup() {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.cache.delete(key);
      }
    }
  }

  size() {
    return this.cache.size;
  }

  destroy() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
    this.cache.clear();
  }
}

export const cacheService = new CacheService();

export function destroyCacheService() {
  cacheService.destroy();
}
