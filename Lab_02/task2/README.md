# CacheManager - Singleton Pattern LRU Cache

## Описание

CacheManager реализует паттерн Singleton с LRU (Least Recently Used) эвикцией. Гарантирует единственный экземпляр кэша с O(1) операциями.

## Структура

```
src/
  ├── CacheManager.js  - Реализация Singleton кэша
  └── example.js       - 7 примеров использования
test/
  └── cache.test.js    - 24 unit теста (все проходят ✓)
```

## API

```javascript
const cache = CacheManager.getInstance(maxSize = 100);

cache.set(key, value);           // Сохранить в кэш
cache.get(key);                  // Получить из кэша
cache.has(key);                  // Проверить наличие
cache.remove(key);               // Удалить
cache.clear();                   // Очистить весь кэш
cache.size();                    // Текущий размер
cache.getMaxSize();              // Максимальный размер
cache.setMaxSize(newSize);       // Изменить размер
cache.getStats();                // Статистика (hits, misses, hitRate)
cache.getAll();                  // Все элементы
```

## Запуск

```bash
# Примеры
node src/example.js

# Тесты
node test/cache.test.js

# npm
npm test
npm start
```

## Особенности

- **Singleton** - только один экземпляр в приложении
- **LRU Eviction** - удаляет наименее используемые элементы
- **O(1) операции** - Map для быстрого доступа
- **Error Handling** - валидация всех параметров
- **Statistics** - отслеживание hit rate
- **24 тестов** - полное покрытие функциональности

## Пример использования

```javascript
const CacheManager = require('./src/CacheManager');

const cache = CacheManager.getInstance();

// Кэширование
cache.set('user-123', { id: 123, name: 'John' });

// Получение
const user = cache.get('user-123'); // { id: 123, name: 'John' }

// Если кэш полон, удаляется наименее используемый элемент
cache.set('user-456', { id: 456, name: 'Jane' }); // Может удалить user-123

// Статистика
const stats = cache.getStats();
console.log(`Hit rate: ${stats.hitRate}%`);
```
