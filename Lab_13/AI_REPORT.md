# AI_REPORT - Lab 13

## 1. Информация о использовании AI
- Инструмент: GitHub Copilot (VS Code Extension)
- Дата: 2026-04-15
- Модель: GPT-5.3-Codex

## 2. Консультация с AI

### Вопрос 1:
"React does not recognize the `isDark` prop on a DOM element. If you intentionally want it to appear in the DOM as a custom attribute, spell it as lowercase `isdark` instead. If you accidentally passed it from a parent component, remove it from the DOM element."

AI объяснил причину ошибки:
- Проп `isDark` прокидывался HOC-оберткой дальше в базовый компонент
- Внутри компонента оставшиеся `...props` передавались напрямую в DOM-элемент (`button`, `div`, `input`)
- React предупреждает, когда нестандартный проп попадает в реальный DOM

### Вопрос 2:
"Failed to load resource: the server responded with a status of 404 (Not Found)"

AI объяснил причину ошибки:
- В браузере запрашивался ресурс по пути, который не существует в проекте
- Типичные причины: неверное имя файла, неверный путь в `src/href/import`, отсутствие расширения, либо несуществующий `favicon.ico`


## 3. Процент использования AI
- Использовано: 25%

## 4. Рефлексия
AI использовался для точечной диагностики типовых проблем React-приложений: предупреждений о лишних пропах в DOM и ошибок загрузки ресурсов. Основная реализация лабораторной (HOC и Custom Hooks) выполнена самостоятельно, а AI ускорил поиск причины ошибок и подсказал безопасные практики: не прокидывать служебные пропы в DOM и внимательно проверять пути к статическим файлам/модулям.
