const CacheManager = require('../src/CacheManager');

class TestRunner {
  constructor() {
    this.tests = [];
    this.passed = 0;
    this.failed = 0;
  }

  test(description, testFn) {
    this.tests.push({ description, testFn });
  }

  async run() {
    console.log('\n╔════════════════════════════════════════════════════════════╗');
    console.log('║           CacheManager Unit Tests - Test Suite             ║');
    console.log('╚════════════════════════════════════════════════════════════╝\n');

    for (const { description, testFn } of this.tests) {
      try {
        CacheManager.reset();
        await testFn();
        this.passed++;
        console.log(`✓ PASS: ${description}`);
      } catch (error) {
        this.failed++;
        console.log(`✗ FAIL: ${description}`);
        console.log(`  Error: ${error.message}\n`);
      }
    }

    this.printSummary();
  }

  assert(condition, message) {
    if (!condition) {
      throw new Error(message || 'Assertion failed');
    }
  }

  assertEquals(actual, expected, message) {
    if (actual !== expected) {
      throw new Error(message || `Expected ${expected}, got ${actual}`);
    }
  }

  assertTrue(value, message) {
    this.assert(value === true, message || 'Expected true');
  }

  assertFalse(value, message) {
    this.assert(value === false, message || 'Expected false');
  }

  assertDeepEquals(actual, expected, message) {
    const actualStr = JSON.stringify(actual);
    const expectedStr = JSON.stringify(expected);
    if (actualStr !== expectedStr) {
      throw new Error(message || `Expected ${expectedStr}, got ${actualStr}`);
    }
  }

  printSummary() {
    const total = this.passed + this.failed;
    console.log('\n════════════════════════════════════════════════════════════');
    console.log(`Tests run: ${total}`);
    console.log(`Passed: ${this.passed}`);
    console.log(`Failed: ${this.failed}`);
    console.log('════════════════════════════════════════════════════════════\n');

    if (this.failed === 0) {
      console.log('🎉 All tests passed!\n');
    } else {
      console.log(`⚠️  ${this.failed} test(s) failed!\n`);
    }
  }
}

const runner = new TestRunner();

runner.test('Singleton: getInstance returns same instance', function() {
  const instance1 = CacheManager.getInstance();
  const instance2 = CacheManager.getInstance();
  runner.assertTrue(instance1 === instance2);
});

runner.test('Singleton: Multiple getInstance calls uses first size', function() {
  const instance1 = CacheManager.getInstance(5);
  const instance2 = CacheManager.getInstance(10);
  runner.assertEquals(instance1.getMaxSize(), 5);
});

runner.test('Cache: set and get basic key-value pair', function() {
  const cache = CacheManager.getInstance();
  const testValue = { id: 1, name: 'test' };
  cache.set('key1', testValue);
  runner.assertDeepEquals(cache.get('key1'), testValue);
});

runner.test('Cache: get returns null for non-existent key', function() {
  const cache = CacheManager.getInstance();
  runner.assertEquals(cache.get('nonexistent-key'), null);
});

runner.test('Cache: set overwrites existing key', function() {
  const cache = CacheManager.getInstance();
  cache.set('key1', 'value1');
  cache.set('key1', 'value2');
  runner.assertEquals(cache.get('key1'), 'value2');
  runner.assertEquals(cache.size(), 1);
});

runner.test('LRU: Evicts least recently used item when cache is full', function() {
  const cache = CacheManager.getInstance(3);
  cache.set('entry1', 'value1');
  cache.set('entry2', 'value2');
  cache.set('entry3', 'value3');
  cache.set('entry4', 'value4');
  runner.assertEquals(cache.size(), 3);
  runner.assertEquals(cache.get('entry1'), null);
  runner.assertEquals(cache.get('entry4'), 'value4');
});

runner.test('LRU: Accessing item updates its position in LRU order', function() {
  const cache = CacheManager.getInstance(3);
  cache.set('entry1', 'value1');
  cache.set('entry2', 'value2');
  cache.set('entry3', 'value3');
  cache.get('entry1');
  cache.set('entry4', 'value4');
  runner.assertEquals(cache.get('entry1'), 'value1');
  runner.assertEquals(cache.get('entry2'), null);
  runner.assertEquals(cache.get('entry4'), 'value4');
});

runner.test('LRU: Multiple accesses affect LRU order correctly', function() {
  const cache = CacheManager.getInstance(2);
  cache.set('a', 'A');
  cache.set('b', 'B');
  cache.get('a');
  cache.get('a');
  cache.set('c', 'C');
  runner.assertEquals(cache.get('a'), 'A');
  runner.assertEquals(cache.get('b'), null);
  runner.assertEquals(cache.get('c'), 'C');
});

runner.test('Cache: size() returns correct number of entries', function() {
  const cache = CacheManager.getInstance();
  runner.assertEquals(cache.size(), 0);
  cache.set('key1', 'value1');
  runner.assertEquals(cache.size(), 1);
  cache.set('key2', 'value2');
  runner.assertEquals(cache.size(), 2);
});

runner.test('Cache: has() checks key existence without updating LRU', function() {
  const cache = CacheManager.getInstance(2);
  cache.set('key1', 'value1');
  cache.set('key2', 'value2');
  runner.assertTrue(cache.has('key1'));
  cache.set('key3', 'value3');
  runner.assertEquals(cache.get('key1'), null);
  runner.assertEquals(cache.get('key2'), 'value2');
});

runner.test('Cache: remove() deletes specific entry', function() {
  const cache = CacheManager.getInstance();
  cache.set('key1', 'value1');
  cache.set('key2', 'value2');
  const removed = cache.remove('key1');
  runner.assertTrue(removed);
  runner.assertEquals(cache.size(), 1);
  runner.assertEquals(cache.get('key1'), null);
  runner.assertEquals(cache.get('key2'), 'value2');
});

runner.test('Cache: remove() returns false for non-existent key', function() {
  const cache = CacheManager.getInstance();
  runner.assertFalse(cache.remove('nonexistent'));
});

runner.test('Cache: clear() empties entire cache', function() {
  const cache = CacheManager.getInstance();
  cache.set('key1', 'value1');
  cache.set('key2', 'value2');
  runner.assertEquals(cache.size(), 2);
  cache.clear();
  runner.assertEquals(cache.size(), 0);
  runner.assertEquals(cache.get('key1'), null);
});

runner.test('Cache: getMaxSize() returns correct max size', function() {
  const cache = CacheManager.getInstance(7);
  runner.assertEquals(cache.getMaxSize(), 7);
});

runner.test('Cache: setMaxSize() changes max size', function() {
  const cache = CacheManager.getInstance(5);
  cache.setMaxSize(10);
  runner.assertEquals(cache.getMaxSize(), 10);
});

runner.test('Cache: setMaxSize() with smaller size evicts LRU items', function() {
  const cache = CacheManager.getInstance(5);
  cache.set('item1', 'val1');
  cache.set('item2', 'val2');
  cache.set('item3', 'val3');
  cache.set('item4', 'val4');
  cache.setMaxSize(2);
  runner.assertEquals(cache.size(), 2);
  runner.assertEquals(cache.get('item1'), null);
  runner.assertEquals(cache.get('item3'), 'val3');
});

runner.test('Cache: getStats() returns correct statistics', function() {
  const cache = CacheManager.getInstance(5);
  cache.set('key1', 'value1');
  cache.get('key1');
  cache.get('key1');
  cache.get('key2');
  cache.get('key3');
  const stats = cache.getStats();
  runner.assertEquals(stats.hits, 2);
  runner.assertEquals(stats.misses, 2);
  runner.assertEquals(stats.total, 4);
  runner.assertEquals(stats.hitRate, 50);
});

runner.test('Cache: clear() resets statistics', function() {
  const cache = CacheManager.getInstance();
  cache.set('key1', 'value1');
  cache.get('key1');
  cache.clear();
  const stats = cache.getStats();
  runner.assertEquals(stats.hits, 0);
  runner.assertEquals(stats.misses, 0);
});

runner.test('Error: set() throws on empty string key', function() {
  const cache = CacheManager.getInstance();
  try {
    cache.set('', 'value');
    throw new Error('Should have thrown an error');
  } catch (error) {
    runner.assert(error.message.includes('non-empty string'));
  }
});

runner.test('Error: set() throws on non-string key', function() {
  const cache = CacheManager.getInstance();
  try {
    cache.set(123, 'value');
    throw new Error('Should have thrown an error');
  } catch (error) {
    runner.assert(error.message.includes('string'));
  }
});

runner.test('Error: set() throws on undefined value', function() {
  const cache = CacheManager.getInstance();
  try {
    cache.set('key', undefined);
    throw new Error('Should have thrown an error');
  } catch (error) {
    runner.assert(error.message.includes('undefined'));
  }
});

runner.test('Error: setMaxSize() throws on invalid size', function() {
  const cache = CacheManager.getInstance();
  try {
    cache.setMaxSize(0);
    throw new Error('Should have thrown an error');
  } catch (error) {
    runner.assert(error.message.includes('positive'));
  }
});

runner.test('Error: setMaxSize() throws on negative size', function() {
  const cache = CacheManager.getInstance();
  try {
    cache.setMaxSize(-5);
    throw new Error('Should have thrown an error');
  } catch (error) {
    runner.assert(error.message.includes('positive'));
  }
});

runner.test('Integration: Complete workflow with all operations', function() {
  const cache = CacheManager.getInstance(3);
  cache.set('user-1', { name: 'Alice' });
  cache.set('user-2', { name: 'Bob' });
  cache.set('user-3', { name: 'Charlie' });
  runner.assertEquals(cache.size(), 3);

  const user1 = cache.get('user-1');
  runner.assertDeepEquals(user1, { name: 'Alice' });

  cache.set('user-4', { name: 'David' });
  runner.assertEquals(cache.get('user-2'), null);

  const stats = cache.getStats();
  runner.assertEquals(stats.size, 3);
  runner.assertEquals(stats.hits, 1);

  cache.remove('user-3');
  runner.assertEquals(cache.size(), 2);

  cache.clear();
  runner.assertEquals(cache.size(), 0);
});

runner.run();

module.exports = { CacheManager, runner };
