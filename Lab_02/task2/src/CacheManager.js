/**
 * CacheManager - Singleton Pattern Implementation
 * LRU (Least Recently Used) cache with O(1) operations
 */

class CacheManager {
  constructor(maxSize = 100) {
    if (CacheManager.instance) {
      return CacheManager.instance;
    }

    this._cache = new Map();
    this._maxSize = maxSize;
    this._hits = 0;
    this._misses = 0;

    CacheManager.instance = this;
    return this;
  }

  /**
   * Get or create the singleton instance
   * @param {number} maxSize - Maximum cache size
   * @returns {CacheManager}
   */
  static getInstance(maxSize = 100) {
    if (!CacheManager.instance) {
      CacheManager.instance = new CacheManager(maxSize);
    }
    return CacheManager.instance;
  }

  /**
   * Retrieve value from cache
   * Updates LRU order (moves accessed item to end)
   * @param {string} key
   * @returns {*} value or null
   */
  get(key) {
    if (!this._cache.has(key)) {
      this._misses++;
      return null;
    }

    const value = this._cache.get(key);
    this._cache.delete(key);
    this._cache.set(key, value);

    this._hits++;
    return value;
  }

  /**
   * Store value in cache
   * Evicts LRU item if cache is full
   * @param {string} key
   * @param {*} value
   * @throws {Error} if invalid parameters
   */
  set(key, value) {
    if (!key || typeof key !== 'string') {
      throw new Error('Cache key must be a non-empty string');
    }

    if (value === undefined) {
      throw new Error('Cache value cannot be undefined');
    }

    if (this._cache.has(key)) {
      this._cache.delete(key);
    }

    if (this._cache.size >= this._maxSize) {
      const lruKey = this._cache.keys().next().value;
      this._cache.delete(lruKey);
    }

    this._cache.set(key, value);
  }

  /**
   * Remove specific cache entry
   * @param {string} key
   * @returns {boolean} true if removed, false if not found
   */
  remove(key) {
    return this._cache.delete(key);
  }

  /**
   * Check if key exists (does NOT affect LRU)
   * @param {string} key
   * @returns {boolean}
   */
  has(key) {
    return this._cache.has(key);
  }

  /**
   * Clear entire cache and reset statistics
   */
  clear() {
    this._cache.clear();
    this._hits = 0;
    this._misses = 0;
  }

  /**
   * Get current cache size
   * @returns {number}
   */
  size() {
    return this._cache.size;
  }

  /**
   * Get maximum cache size
   * @returns {number}
   */
  getMaxSize() {
    return this._maxSize;
  }

  /**
   * Set new maximum cache size
   * Evicts LRU items if new size is smaller
   * @param {number} newSize
   * @throws {Error} if newSize is invalid
   */
  setMaxSize(newSize) {
    if (newSize <= 0) {
      throw new Error('Cache size must be a positive number');
    }

    this._maxSize = newSize;

    while (this._cache.size > this._maxSize) {
      const lruKey = this._cache.keys().next().value;
      this._cache.delete(lruKey);
    }
  }

  /**
   * Get cache statistics
   * @returns {Object} stats with hits, misses, total, hitRate, size, maxSize
   */
  getStats() {
    const total = this._hits + this._misses;
    const hitRate = total > 0 ? ((this._hits / total) * 100).toFixed(2) : 0;

    return {
      hits: this._hits,
      misses: this._misses,
      total: total,
      hitRate: parseFloat(hitRate),
      size: this._cache.size,
      maxSize: this._maxSize,
    };
  }

  /**
   * Get all cached entries (for debugging)
   * @returns {Object}
   */
  getAll() {
    const entries = {};
    for (const [key, value] of this._cache) {
      entries[key] = value;
    }
    return entries;
  }

  /**
   * Reset singleton instance (testing only)
   */
  static reset() {
    CacheManager.instance = null;
  }
}

module.exports = CacheManager;
