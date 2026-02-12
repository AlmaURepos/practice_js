AI Report by Aidos Amangeldi, SE
# AI_REPORT

1. Информация о использовании AI
- Инструмент: Claude Code (CLI), Claude Opus 4.6
- Дата: 2026-02-12

2. Промпты

Промпт 1:
"Failed to load resource: the server responded with a status of 404 (Not Found) — Error loading lazy component: TypeError: Failed to fetch dynamically imported module: http://127.0.0.1:5500/Lab_05/task2/modules/lazyComponent.mjs — advancedStats.mjs:1 Failed to load resource: the server responded with a status of 404 (Not Found) — Error loading module: TypeError: Failed to fetch dynamically imported module: http://127.0.0.1:5500/Lab_05/task2/modules/advancedStats.mjs"

AI определил, что пути импортов в index.html не совпадают с реальными именами файлов на диске (camelCase vs snake_case)

Промпт 2:
"Uncaught (in promise) TypeError: Cannot set properties of null (setting 'textContent') at Module.loadLazyComponent (lazy_component.mjs:3:27) at IntersectionObserver.<anonymous> (index.html:36:28)"

AI определил, что в `lazy_component.mjs` используется `getElementById('lazy-container')`, тогда как в HTML элемент имеет id `lazyContainer`. 

3. Модификация и проверка
- Исправлены пути динамических импортов в `index.html` (2 файла)
- Исправлено имя вызываемой функции в `index.html`
- Исправлен id элемента в `lazy_component.mjs`
- Все изменения проверены на соответствие реальной структуре файлов проекта

4. Что узнал
Я узнал о важности точного соответствия путей импортов реальным именам файлов, особенно при динамических импортах. Также убедился, что id элементов в JavaScript-коде должны точно совпадать с id в HTML.

5. Процент использования
Я оцениваю использование AI как 30%. AI помог найти и исправить ошибки по сообщениям из консоли, но анализ архитектуры и проверка результатов выполнены мной.
