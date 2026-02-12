# Lab 2.2: Cache Pattern Refactoring & Documentation

## Overview

This project contains a refactored caching implementation using the **Singleton Pattern** (Creational Pattern) from Gang of Four (GoF) design patterns. The cache implements an LRU (Least Recently Used) eviction strategy and provides comprehensive statistics and error handling.

### Project Structure

```
Lab_02/task2/
├── src/
│   ├── CacheManager.js      # Main cache implementation (Singleton pattern)
│   └── example.js           # Usage examples and demonstrations
├── test/
│   └── cache.test.js        # Unit tests (25+ test cases)
├── Comparison_Analysis.md   # Detailed comparison: original vs. refactored
├── README.md                # This file
└── AI_REPORT.md             # AI usage documentation
```

---

## Quick Start

### Installation

```bash
# Navigate to the project directory
cd Lab_02/task2

# No external dependencies required - uses only Node.js built-ins
```

### Running Examples

```bash
# Execute example demonstrations
node src/example.js
```

**Expected output:** 7 comprehensive examples showing all CacheManager features

### Running Tests

```bash
# Execute unit tests
node test/cache.test.js
```

**Expected output:** 25+ test cases with pass/fail results and summary

---

## CacheManager API Reference

### Creating a Cache Instance

```javascript
const CacheManager = require('./src/CacheManager');

// Get singleton instance (max 100 entries)
const cache = CacheManager.getInstance();

// Create with custom max size
const customCache = CacheManager.getInstance(50);

// Note: All subsequent getInstance() calls return the same instance
```

### Core Operations

#### Get Value
```javascript
// Retrieve value from cache
const value = cache.get('user-123');

// Returns null if key doesn't exist
// Updates LRU order (accessed items moved to "most recent")
```

#### Set Value
```javascript
// Store value in cache
cache.set('user-123', { id: 123, name: 'John' });

// If cache is full, evicts least recently used item
// Throws error if key is invalid or value is undefined
```

#### Check Existence
```javascript
// Check if key exists (does NOT affect LRU order)
if (cache.has('user-123')) {
  const user = cache.get('user-123');
}
```

#### Remove Item
```javascript
// Remove specific cache entry
const removed = cache.remove('user-123');
// Returns true if removed, false if not found
```

#### Clear Cache
```javascript
// Remove all entries and reset statistics
cache.clear();
```

### Utility Methods

#### Get Cache Size
```javascript
// Current number of cached items
const count = cache.size();

// Maximum capacity
const max = cache.getMaxSize();
```

#### Manage Cache Size
```javascript
// Change maximum cache size dynamically
cache.setMaxSize(200);

// If new size is smaller, LRU items are evicted
```

#### Get Statistics
```javascript
const stats = cache.getStats();
// Returns: {
//   hits: 42,          // Number of cache hits
//   misses: 8,         // Number of cache misses
//   total: 50,         // Total accesses
//   hitRate: 84,       // Hit rate percentage
//   size: 45,          // Current items in cache
//   maxSize: 100       // Maximum capacity
// }
```

#### Get All Cached Items
```javascript
const allData = cache.getAll();
// Returns object with all cached key-value pairs
// Useful for debugging and inspection
```

---

## Usage Examples

### Example 1: Basic Caching

```javascript
const cache = CacheManager.getInstance();

// Cache a user object
cache.set('user-1', { id: 1, name: 'Alice' });

// Retrieve from cache
const user = cache.get('user-1');
console.log(user); // { id: 1, name: 'Alice' }
```

### Example 2: API Response Caching

```javascript
const cache = CacheManager.getInstance();

async function fetchUserData(userId) {
  // Check cache first
  let user = cache.get(`user-${userId}`);

  if (!user) {
    // Not cached - fetch from API
    const response = await fetch(`/api/users/${userId}`);
    user = await response.json();

    // Store in cache
    cache.set(`user-${userId}`, user);
  }

  return user;
}

// First call: fetches from API
const user1 = await fetchUserData(123);

// Second call: retrieved from cache instantly
const user1Again = await fetchUserData(123);
```

### Example 3: Monitoring Cache Performance

```javascript
const cache = CacheManager.getInstance();

// Perform some cache operations
cache.set('key-1', 'value-1');
cache.get('key-1'); // hit
cache.get('key-1'); // hit
cache.get('key-2'); // miss

// Check statistics
const stats = cache.getStats();
console.log(`Hit rate: ${stats.hitRate}%`); // 66.67%
console.log(`Efficiency: ${stats.hits}/${stats.total} operations`);
```

### Example 4: Dynamic Size Management

```javascript
const cache = CacheManager.getInstance();

// Start with small cache
cache.setMaxSize(3);

cache.set('a', 1);
cache.set('b', 2);
cache.set('c', 3);

// Cache is full - next add will evict LRU
cache.set('d', 4); // 'a' evicted (least recently used)

// Expand cache when needed
cache.setMaxSize(10);

// Cache has more room now
cache.set('e', 5);
```

### Example 5: Error Handling

```javascript
const cache = CacheManager.getInstance();

// Invalid key (empty string)
try {
  cache.set('', 'value');
} catch (error) {
  console.error(error.message);
  // "Cache key must be a non-empty string"
}

// Invalid value (undefined)
try {
  cache.set('key', undefined);
} catch (error) {
  console.error(error.message);
  // "Cache value cannot be undefined"
}

// Invalid size
try {
  cache.setMaxSize(-5);
} catch (error) {
  console.error(error.message);
  // "Cache size must be a positive number"
}
```

---

## Design Pattern: Singleton

### What is Singleton Pattern?

The Singleton pattern is a Creational pattern that ensures a class has only one instance and provides a global point of access to it.

### Why Use It for Cache?

1. **Single Source of Truth** - One cache instance shared across the entire application
2. **Global Access** - Easy to access from anywhere with `getInstance()`
3. **Controlled Instantiation** - Cannot accidentally create multiple cache instances
4. **Efficient Resource Usage** - Single cache instead of multiple redundant caches

### Implementation Details

```javascript
class CacheManager {
  // Private static instance
  static instance = null;

  constructor(maxSize = 100) {
    // Prevent multiple instantiation
    if (CacheManager.instance) {
      return CacheManager.instance;
    }

    // Initialize only once
    this._cache = new Map();
    this._maxSize = maxSize;

    // Store reference
    CacheManager.instance = this;
  }

  // Global access point
  static getInstance(maxSize = 100) {
    if (!CacheManager.instance) {
      new CacheManager(maxSize);
    }
    return CacheManager.instance;
  }
}
```

### Verification Example

```javascript
const cache1 = CacheManager.getInstance();
const cache2 = CacheManager.getInstance();

console.log(cache1 === cache2); // true - Same instance!
```

---

## LRU Eviction Strategy

### How It Works

**LRU = Least Recently Used**

When the cache reaches its maximum size and a new item is added:

1. The least recently used item (oldest in access time) is removed
2. This keeps frequently accessed items in the cache
3. Improves overall cache hit rate

### Example

```javascript
const cache = CacheManager.getInstance(3); // Max 3 items

cache.set('item-1', 'A');
cache.set('item-2', 'B');
cache.set('item-3', 'C');
// Cache: [item-1, item-2, item-3]

// Access item-1 (moves to end - most recent)
cache.get('item-1');
// Order: [item-2, item-3, item-1]

// Add new item
cache.set('item-4', 'D');
// item-2 is evicted (least recently used)
// Cache: [item-3, item-1, item-4]
```

---

## Performance Characteristics

### Time Complexity

| Operation | Complexity | Notes |
|-----------|-----------|-------|
| `get(key)` | O(1) | Map lookup + reorder |
| `set(key, value)` | O(1) | Map insertion + eviction |
| `remove(key)` | O(1) | Map deletion |
| `has(key)` | O(1) | Map lookup only |
| `clear()` | O(1) | Reset Map reference |
| `getStats()` | O(1) | Return counters |

### Space Complexity

- **O(n)** where n = number of cached items
- Maximum space determined by `maxSize` parameter
- Map data structure provides efficient storage

---

## Testing

### Test Coverage

The test suite includes 25+ test cases covering:

- **Singleton Pattern**: Instance uniqueness, getInstance behavior
- **Cache Operations**: get, set, remove, clear, has
- **LRU Strategy**: Eviction order, access order updates
- **Error Handling**: Invalid keys, invalid values, invalid sizes
- **Statistics**: Hit/miss counting, rate calculation
- **Size Management**: Dynamic resize, eviction on shrink
- **Integration**: Complete workflows with multiple operations

### Running Tests

```bash
node test/cache.test.js
```

### Expected Output

```
╔════════════════════════════════════════════════════════════╗
║           CacheManager Unit Tests - Test Suite             ║
╚════════════════════════════════════════════════════════════╝

✓ PASS: Singleton: getInstance returns same instance
✓ PASS: Cache: set and get basic key-value pair
✓ PASS: Cache: get returns null for non-existent key
✓ PASS: LRU: Evicts least recently used item when cache is full
✓ PASS: Error: set() throws on empty string key
... [20+ more tests]

════════════════════════════════════════════════════════════
Tests run: 25
Passed: 25
Failed: 0
════════════════════════════════════════════════════════════

🎉 All tests passed!
```

---

## Implementation Highlights

### 1. Encapsulation
- Private variables with `_` prefix convention
- Public methods for controlled access
- No direct access to internal state

### 2. Error Handling
- Input validation for all parameters
- Meaningful error messages
- Throws exceptions for invalid operations

### 3. Modern JavaScript
- ES6+ class syntax
- Map data structure for efficient operations
- Comprehensive JSDoc documentation
- Const/let for proper scoping

### 4. Performance Optimization
- Map.prototype.size is O(1) lookup
- Direct Map operations without array conversions
- Efficient LRU tracking through Map insertion order

### 5. Monitoring & Debugging
- `getStats()` for performance analysis
- `getAll()` for cache inspection
- Hit/miss ratio tracking
- Cache utilization metrics

---

## Real-World Applications

CacheManager can be used in:

1. **Web Applications** - Cache API responses, user data, translations
2. **Data Processing** - Cache expensive computations, database queries
3. **Session Management** - Cache session data with automatic eviction
4. **Rate Limiting** - Track request counts per user/IP
5. **Template Rendering** - Cache compiled templates
6. **DOM Queries** - Cache DOM element references

---

## References

### Documentation
- Osmani, Addy. *Learning JavaScript Design Patterns*, 2nd Edition. O'Reilly Media, 2020.
  - Chapter 3: "Structuring and Writing Patterns"
  - Chapter 7: "GoF Design Patterns"

- Gamma, Erich, et al. *Design Patterns: Elements of Reusable Object-Oriented Software*. Addison-Wesley, 1995.

### Related Patterns
- **Circuit Breaker** - Prevent cascading failures with retries
- **Decorator** - Add caching behavior to existing functions
- **Factory** - Create different cache implementations
- **Strategy** - Swap eviction strategies (LRU, LFU, FIFO)

---

## Troubleshooting

### Cache Not Storing Values

```javascript
// ❌ Wrong - Set expects immutable key type
const obj = { id: 1 };
cache.set(obj, 'value'); // Error: key must be string

// ✅ Correct - Convert to string key
cache.set('1', 'value');
```

### Memory Growing Unexpectedly

```javascript
// ❌ Wrong - setMaxSize might be too large
cache.setMaxSize(10000);

// ✅ Correct - Monitor with getStats()
const stats = cache.getStats();
if (stats.size > stats.maxSize * 0.8) {
  console.warn('Cache getting full');
}
```

### All Instances Pointing to Same Cache

```javascript
// ✓ This is by design - Singleton pattern
const cache1 = CacheManager.getInstance();
const cache2 = CacheManager.getInstance();

// Both point to same instance - this is correct behavior!
console.log(cache1 === cache2); // true
```

---

## Development Notes

### Code Organization

- **src/CacheManager.js** - Singleton class definition (~300 lines with docs)
- **src/example.js** - 7 detailed usage examples (~350 lines)
- **test/cache.test.js** - 25+ test cases with custom test runner (~450 lines)

### Code Quality Standards

✅ **Naming Conventions** - camelCase for variables/methods
✅ **Comments** - Comprehensive JSDoc documentation
✅ **Error Handling** - Input validation and meaningful errors
✅ **Testing** - 25+ unit tests, high coverage
✅ **ES6+** - Modern JavaScript syntax throughout

### Future Enhancements

Possible improvements (not included in this implementation):

- [ ] Different eviction strategies (LFU, FIFO, Random)
- [ ] Expiration TTL (time-to-live) for entries
- [ ] Compression for large cached values
- [ ] Persistence (local storage, database)
- [ ] Event emitters for cache modifications
- [ ] Async operations support
- [ ] Concurrent access (threading/locking)

---

## License

Educational project for learning JavaScript design patterns.

---

## Student Information

**Course:** Week 2 Lab 02 - Pattern Documentation & GoF
**Assignment:** Lab 2.2 - Pattern Refactoring and Documentation
**Pattern:** Singleton Pattern (Creational)

---

**Created:** February 2025
**Last Updated:** February 12, 2025

For questions or issues, refer to the code comments and the `Comparison_Analysis.md` document.
