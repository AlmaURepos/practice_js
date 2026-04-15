# AI_REPORT - Lab 12

## 1. Информация о использовании AI
- Инструмент: GitHub Copilot (VS Code Extension)
- Дата: 2026-04-15
- Модель: GPT-5.3-Codex

## 2. Консультация с AI

### Вопрос 1:
"Uncaught Error: Mismatched anonymous define() module ... Uncaught ReferenceError: MyLib is not defined"

AI объяснил причину ошибки:
- В `task1/index.html` одновременно использовались `require.js` и прямое подключение UMD-бандла через `<script src="./modules/umd/MyLib.js"></script>`
- При наличии AMD-loader UMD-модуль выбирал ветку `define(...)`, из-за чего не создавался глобальный объект `MyLib`
- В результате появлялись ошибка `Mismatched anonymous define()` и затем `MyLib is not defined` при нажатии кнопки UMD demo

Результат: ошибка загрузки модуля устранена, UMD demo работает через `require(["./modules/umd/MyLib"], ...)`, объект `MyLib` корректно доступен в callback

## 3. Процент использования AI
- Использовано: 20%

## 4. Рефлексия
AI использовался для точечной диагностики конфликта между AMD и UMD в браузерном окружении. Основная реализация лабораторной (task1: AMD/CommonJS/UMD, task2: nested namespacing, namespace injection и plugin architecture) выполнена самостоятельно, а AI помог быстро выявить причину ошибки и предложить корректный способ подключения модуля через RequireJS. Полученный опыт укрепил понимание различий между модульными системами и правил их совместного использования в одном проекте.
