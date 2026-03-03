# AI_REPORT - Lab 07

## 1. Информация о использовании AI
- Инструмент: GitHub Copilot (VSCode Extension)
- Дата: 2026-03-03
- Модель: GPT-4.1

## 2. Консультация с AI

### Вопрос:
"Uncaught SyntaxError: Cannot use import statement outside a module (at test.js:1:1)"

AI объяснил причину ошибки:
- Импорт ES-модуля невозможен без указания type="module" в script-теге HTML
- Для корректной работы import необходимо изменить тег: <script type="module" src="test.js"></script>

AI предложил решение:
- Изменить script-тег в index.html, добавив type="module"
- После этого import будет работать корректно в браузере

## 3. Процент использования AI
- Использовано: 10%

## 4. Рефлексия
AI был использован для быстрой диагностики и исправления ошибки, решение было простым и не требовало глубокого анализа кода.
