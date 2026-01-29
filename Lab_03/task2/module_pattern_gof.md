# Module Pattern (GoF-Style Documentation)

## Pattern Name
Module Pattern

## Description
Модульный паттерн инкапсулирует переменные и методы, предотвращая загрязнение глобального пространства имён и обеспечивая приватность данных.

## Context Outline
Используется в JavaScript-приложениях для организации кода, когда требуется:
- Инкапсуляция данных
- Изоляция логики
- Минимизация глобальных переменных

## Problem Statement
JavaScript не поддерживает приватные члены на уровне языка (до ES2022). Глобальные переменные приводят к конфликтам имён и ошибкам. Требуется способ создавать изолированные области видимости.

## Solution
Использование немедленно вызываемых функциональных выражений (IIFE) для создания замкнутого пространства имён, возвращая объект с публичным API.

## Design
- Приватные переменные и функции определяются внутри IIFE
- Публичные методы возвращаются как свойства объекта
- Вариация: Revealing Module Pattern явно указывает публичные члены

## Implementation
### Basic Module Pattern (IIFE)
```js
const counterModule = (function() {
  let count = 0;
  return {
    increment() { count++; },
    getCount() { return count; }
  };
})();
```

### Module Pattern with Private Variables
```js
const userModule = (function() {
  let user = null;
  function login(name) { user = name; }
  function getUser() { return user; }
  return { login, getUser };
})();
```

### Modern ES6 Module Equivalent
// counter.js
```js
let count = 0;
export function increment() { count++; }
export function getCount() { return count; }
```

## Illustrations
// Структурная схема:
// [Module (IIFE)] → [Private Scope] → [Public API]

## Examples
См. файл module_examples.js для рабочих примеров.

## Consequences
**Преимущества:**
- Инкапсуляция
- Управление пространством имён
- Гибкость

**Недостатки:**
- Неудобство тестирования приватных членов
- Устаревает с появлением ES6 Modules

## Corequisites
- Revealing Module Pattern для явного API
- Namespace Pattern для группировки

## Relations
- Revealing Module Pattern
- Namespace Pattern
- ES6 Modules

## Known Usage
- jQuery, AngularJS, RequireJS, плагины до ES6

## Discussions
Модульный паттерн был стандартом до появления ES6. Современные проекты используют ES6 Modules, но понимание паттерна важно для поддержки старого кода и принципов инкапсуляции.

## References
- Ch. 3, “The Structure of a Design Pattern”
- Ch. 7, “JavaScript Design Patterns”
