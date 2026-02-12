# Task 1 - Модернизация legacy-кода

## До (legacy_code.js)
- Весь код в одном файле, глобальная область видимости
- Переменные через `var`, конструкторы через `function` и `prototype`
- Нет модулей, нет `import/export`

## После (modernized/)
- Код разбит на 4 модуля: `config.mjs`, `utils.mjs`, `core.mjs`, `main.mjs`
- Используются `const`, ES6-классы с приватными полями (`#`)
- Модульная система ES Modules (`export/import`)
- Шаблонные строки вместо конкатенации
