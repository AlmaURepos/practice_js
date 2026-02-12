const CacheManager = require('./CacheManager');

function example1_BasicUsage() {
  const cache = CacheManager.getInstance(5);

  cache.set('user-1', { id: 1, name: 'Alice', email: 'alice@example.com' });
  cache.set('user-2', { id: 2, name: 'Bob', email: 'bob@example.com' });
  cache.set('user-3', { id: 3, name: 'Charlie', email: 'charlie@example.com' });

  const user1 = cache.get('user-1');
  const stats = cache.getStats();

  console.log('\n=== EXAMPLE 1: Basic Usage ===');
  console.log('User:', user1);
  console.log('Stats:', stats);
}

function example2_LRUEviction() {
  CacheManager.reset();
  const cache = CacheManager.getInstance(3);

  cache.set('entry-1', 'Value 1');
  cache.set('entry-2', 'Value 2');
  cache.set('entry-3', 'Value 3');

  console.log('\n=== EXAMPLE 2: LRU Eviction ===');
  console.log('Initial:', cache.getAll());

  cache.get('entry-1');
  cache.set('entry-4', 'Value 4');

  console.log('After eviction:', cache.getAll());
  console.log('Size:', `${cache.size()}/${cache.getMaxSize()}`);
}

function example3_SingletonVerification() {
  CacheManager.reset();
  const cache1 = CacheManager.getInstance();
  const cache2 = CacheManager.getInstance();

  cache1.set('test-key', 'test-value');

  console.log('\n=== EXAMPLE 3: Singleton Pattern ===');
  console.log('cache1 === cache2:', cache1 === cache2);
  console.log('Value from cache1:', cache1.get('test-key'));
  console.log('Value from cache2:', cache2.get('test-key'));
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

  console.log('\n=== EXAMPLE 4: API Caching ===');
  console.log('1st call:', getUser('user-123'));
  console.log('2nd call (cached):', getUser('user-123'));
  console.log('3rd call:', getUser('user-456'));
  console.log('API calls:', apiCalls);
  console.log('Stats:', cache.getStats());
}

function example5_ErrorHandling() {
  CacheManager.reset();
  const cache = CacheManager.getInstance();

  console.log('\n=== EXAMPLE 5: Error Handling ===');

  try {
    cache.set('', 'value');
  } catch (error) {
    console.log('✓ Empty key error:', error.message);
  }

  try {
    cache.set('key', undefined);
  } catch (error) {
    console.log('✓ Undefined value error:', error.message);
  }

  try {
    cache.setMaxSize(-5);
  } catch (error) {
    console.log('✓ Negative size error:', error.message);
  }
}

function example6_SizeManagement() {
  CacheManager.reset();
  const cache = CacheManager.getInstance(5);

  for (let i = 1; i <= 5; i++) {
    cache.set(`item-${i}`, `Value ${i}`);
  }

  console.log('\n=== EXAMPLE 6: Size Management ===');
  console.log('Initial size:', `${cache.size()}/${cache.getMaxSize()}`);
  console.log('Items:', Object.keys(cache.getAll()));

  cache.setMaxSize(3);
  console.log('After resize to 3:', Object.keys(cache.getAll()));

  cache.setMaxSize(10);
  console.log('After resize to 10:', `${cache.size()}/${cache.getMaxSize()}`);
}

function example7_CacheOperations() {
  CacheManager.reset();
  const cache = CacheManager.getInstance();

  cache.set('key-1', 'Value 1');
  cache.set('key-2', 'Value 2');
  cache.set('key-3', 'Value 3');

  console.log('\n=== EXAMPLE 7: Operations ===');
  console.log('Initial size:', cache.size());
  console.log('Has key-1:', cache.has('key-1'));

  cache.remove('key-2');
  console.log('After remove key-2:', cache.getAll());

  cache.clear();
  console.log('After clear size:', cache.size());
}

console.log('\n╔════════════════════════════════════════════════════╗');
console.log('║     CacheManager - Usage Examples                  ║');
console.log('╚════════════════════════════════════════════════════╝');

example1_BasicUsage();
example2_LRUEviction();
example3_SingletonVerification();
example4_APIResponseCaching();
example5_ErrorHandling();
example6_SizeManagement();
example7_CacheOperations();

console.log('\n════════════════════════════════════════════════════\n');

module.exports = { example1_BasicUsage, example2_LRUEviction, example3_SingletonVerification };
