# Пояснения по реализации

## Исправленные ошибки

### 1. Ошибка 404 — неверные пути динамических импортов
- `advancedStats.mjs` -> исправлено на `advanced_feature.mjs`
- `lazyComponent.mjs` -> исправлено на `lazy_component.mjs`
- Причина: имена файлов в коде не совпадали с реальными именами на диске (camelCase vs snake_case)

### 2. TypeError: Cannot set properties of null
- `document.getElementById('lazy-container')` -> исправлено на `getElementById('lazyContainer')`
- Причина: id в HTML — `lazyContainer`, а в коде использовался `lazy-container`

### 3. Неверное имя функции
- `module.loadComponent()` -> исправлено на `module.loadLazyComponent()`
- Причина: экспортируемая функция называется `loadLazyComponent`

## Ключевые решения
- `IntersectionObserver` для ленивой загрузки — компонент загружается только при попадании в viewport
- `observer.disconnect()` после загрузки — предотвращает повторные вызовы
- `try/catch` вокруг динамических импортов — обработка ошибок загрузки
