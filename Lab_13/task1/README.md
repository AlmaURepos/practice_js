В данной лабораторной работе реализован паттерн Higher-Order Components (HOC) для внедрения темы в React-компоненты:
- Theme Context и Theme Provider (light/dark)
- HOC `withTheme` для проксирования props и внедрения `theme`, `isDark`, `toggleTheme`
- HOC `withStyles` для вычисления и передачи theme-aware стилей
- Набор theme-aware компонентов (Button, Card, Text, Input, ThemeSwitcher)

Также реализовано демо-приложение с переключением темы и проверкой ввода, показывающее повторное использование логики через HOC без prop drilling.

Запуск проекта:
```bash
npm install
npm run dev
```
