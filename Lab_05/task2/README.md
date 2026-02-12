# Task 2 - Статические и динамические импорты

## До (исходное состояние)
- Неправильные пути импортов (`advancedStats.mjs`, `lazyComponent.mjs`) - файлы не найдены (404)
- Несовпадение id элемента (`lazy-container` vs `lazyContainer`)
- Вызов несуществующей функции `loadComponent()` вместо `loadLazyComponent()`

## После (исправленное состояние)
- Пути импортов исправлены на реальные имена файлов (`advanced_feature.mjs`, `lazy_component.mjs`)
- ID элемента приведён в соответствие с HTML (`lazyContainer`)
- Вызов функции исправлен на `loadLazyComponent()`
- Статический импорт: `app.mjs` загружается сразу
- Динамические импорты: `advanced_feature.mjs` по клику, `lazy_component.mjs` при скролле (IntersectionObserver)
