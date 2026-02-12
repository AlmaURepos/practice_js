const CacheManager = require('./CacheManager');

function example1_BasicUsage() {
  const cache = CacheManager.getInstance(5);
  cache.set('user-1', { id: 1, name: 'Alice' });
  cache.set('user-2', { id: 2, name: 'Bob' });
  cache.set('user-3', { id: 3, name: 'Charlie' });
  const user1 = cache.get('user-1');
  const stats = cache.getStats();
  return { user1, stats };
}

function example2_LRUEviction() {
  CacheManager.reset();
  const cache = CacheManager.getInstance(3);
  cache.set('entry-1', 'Value 1');
  cache.set('entry-2', 'Value 2');
  cache.set('entry-3', 'Value 3');
  const initialState = cache.getAll();
  cache.get('entry-1');
  cache.set('entry-4', 'Value 4');
  return { initialState, afterEviction: cache.getAll() };
}

function example3_SingletonVerification() {
  CacheManager.reset();
  const cache1 = CacheManager.getInstance();
  const cache2 = CacheManager.getInstance();
  cache1.set('test-key', 'test-value');
  return {
    isSameInstance: cache1 === cache2,
    value1: cache1.get('test-key'),
    value2: cache2.get('test-key'),
  };
}

function example4_APIResponseCaching() {
  CacheManager.reset();
  const cache = CacheManager.getInstance(10);
  const mockDatabase = {
    'user-123': { id: 123, name: 'John Doe', role: 'admin' },
    'user-456': { id: 456, name: 'Jane Smith', role: 'user' },
  };
  let apiCalls = 0;

  function getUser(userId) {
    let user = cache.get(userId);
    if (user) return user;
    apiCalls++;
    user = mockDatabase[userId];
    if (user) cache.set(userId, user);
    return user;
  }

  getUser('user-123');
  getUser('user-123');
  getUser('user-456');
  return { apiCalls, stats: cache.getStats() };
}

function example5_ErrorHandling() {
  CacheManager.reset();
  const cache = CacheManager.getInstance();
  const errors = [];

  try {
    cache.set('', 'value');
  } catch (e) {
    errors.push(e.message);
  }

  try {
    cache.set('key', undefined);
  } catch (e) {
    errors.push(e.message);
  }

  try {
    cache.setMaxSize(-5);
  } catch (e) {
    errors.push(e.message);
  }

  return errors;
}

function example6_SizeManagement() {
  CacheManager.reset();
  const cache = CacheManager.getInstance(5);
  for (let i = 1; i <= 5; i++) {
    cache.set(`item-${i}`, `Value ${i}`);
  }
  const before = { size: cache.size(), items: Object.keys(cache.getAll()) };
  cache.setMaxSize(3);
  const afterReduce = { size: cache.size(), items: Object.keys(cache.getAll()) };
  cache.setMaxSize(10);
  const afterExpand = { size: cache.size(), maxSize: cache.getMaxSize() };
  return { before, afterReduce, afterExpand };
}

function example7_CacheOperations() {
  CacheManager.reset();
  const cache = CacheManager.getInstance();
  cache.set('key-1', 'Value 1');
  cache.set('key-2', 'Value 2');
  cache.set('key-3', 'Value 3');
  const initialSize = cache.size();
  const hasKey1 = cache.has('key-1');
  cache.remove('key-2');
  const afterRemove = cache.getAll();
  cache.clear();
  return { initialSize, hasKey1, afterRemove, finalSize: cache.size() };
}

module.exports = {
  example1_BasicUsage,
  example2_LRUEviction,
  example3_SingletonVerification,
  example4_APIResponseCaching,
  example5_ErrorHandling,
  example6_SizeManagement,
  example7_CacheOperations,
};
