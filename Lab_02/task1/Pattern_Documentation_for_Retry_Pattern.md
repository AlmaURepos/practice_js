# Lab 2.1: Retry with Backoff Pattern

## Task 1: Имя и классификация

**Имя:** Retry with Backoff Pattern (Exponential Backoff Retry)

**Классификация:** Behavioral Pattern

**Обоснование:** Паттерн управляет поведением выполнения операции во времени и контролирует взаимодействие между клиентом и асинхронной операцией через логику повторов и стратегии задержки (Ch. 6 GoF).

---

## Task 2: Структура паттерна

### Context (Контекст)

**Когда применяется:**
- Ненадежные внешние ресурсы (APIs, БД, сети)
- Асинхронные операции
- Временные сбои (таймауты, перегрузки сервера)

**Предпосылки:**
- Операция возвращает Promise
- Операция идемпотентна (безопасно повторять)
- Возможность повторного выполнения

**Ограничения:**
- Не для фатальных ошибок
- Контроль числа повторов
- Управление задержкой между попытками

### Problem (Проблема)

**Суть:**
Асинхронные операции часто падают с временными ошибками:
- Сеть недоступна
- Таймауты
- Перегрузка сервера
- Rate limiting

**Почему простое решение недостаточно:**
- Код повторов разброса по приложению
- Без backoff произойдет лавина запросов
- Нет централизованной стратегии

### Solution (Решение)

```javascript
async function retryOperation(operation, maxRetries = 3, delay = 1000) {
  let lastError;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      if (attempt < maxRetries) {
        await new Promise(r => setTimeout(r, delay * attempt));
      }
    }
  }
  throw lastError;
}
```

**Участники:**
- **Client** - инициирует операцию
- **retryOperation()** - обертка с логикой повторов
- **operation** - асинхронная функция
- **delay** - задержка с экспоненциальным увеличением
- **maxRetries** - максимум попыток

---

## Task 3: GoF расширения

### Consequences (Последствия)

**Плюсы:**
- ✓ Повышение надежности системы
- ✓ Автоматическое восстановление от временных сбоев
- ✓ Централизация логики обработки ошибок
- ✓ Exponential backoff предотвращает перегрузку

**Минусы:**
- ✗ Увеличение латентности (ожидание между попытками)
- ✗ Может скрывать основные проблемы
- ✗ Утечки ресурсов при долгих ожиданиях

### Related Patterns

1. **Circuit Breaker** - дополняет паттерн, предотвращает повторы при падении сервиса
2. **Timeout** - работает вместе, предотвращает бесконечное ожидание
3. **Bulkhead** - изолирует сбои, предотвращает каскадные отказы

### Known Usage

- **AWS SDK** - автоматические повторы с exponential backoff
- **Google Cloud Client Libraries** - встроенная стратегия повторов
- **node-fetch-retry** - популярный npm пакет
- **Service Workers** - для offline resilience в PWA

---

## Task 4: Диаграмма выполнения

```
Client
   │
   ├─► retryOperation(fn, 3, 1000)
   │
   ├─► Loop: attempt 1..3
   │      │
   │      ├─► Execute operation()
   │      │      ├─ SUCCESS → Return result
   │      │      └─ ERROR → Continue
   │      │
   │      ├─ If attempt < maxRetries:
   │      │   Wait(delay × attempt)
   │      │   Retry
   │      │
   │      └─ If all retries fail:
   │          Throw lastError
   │
   └─► Result or Exception
```

---

## Пример кода

```javascript
// Retry с exponential backoff
async function fetchWithRetry(url) {
  return retryOperation(
    () => fetch(url).then(r => r.json()),
    3,    // максимум 3 попытки
    1000  // начальная задержка 1000ms
  );
}

// Использование
try {
  const data = await fetchWithRetry('https://api.example.com/data');
  console.log(data);
} catch (error) {
  console.error('Все попытки исчерпаны:', error);
}
```

---

**Документировано в GoF формате (Ch. 3: Structuring Patterns)**
