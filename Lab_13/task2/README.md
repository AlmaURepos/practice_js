В данной лабораторной работе реализованы кастомные React-хуки для повторного использования stateful-логики:
- useApi, useMutation, usePaginatedApi для работы с API и состояниями загрузки/ошибок
- useLocalStorage для синхронизации состояния с localStorage
- useDebounce и useDebouncedCallback для оптимизации ввода и колбэков
- useFetch и useFetchSWR с кэшированием и повторной валидацией данных

Также реализовано демо-приложение, где каждый хук применяется в отдельном сценарии: поиск с debounce, мутация, пагинация, сохранение в localStorage и fetch с кэшем.

Краткое API хуков:
- useApi(apiFunction, dependencies): возвращает data, loading, error, refetch
- useMutation(apiFunction): возвращает mutate, loading, error, data
- usePaginatedApi(apiFunction, pageSize): возвращает data, loading, error, loadMore, hasMore, reset, page
- useLocalStorage(key, initialValue): возвращает [value, setValue, removeValue]
- useDebounce(value, delay): возвращает debouncedValue
- useDebouncedCallback(callback, delay): возвращает debounced function
- useFetch(url, options): возвращает data, loading, error, cacheHit, refetch, clearCache
- useFetchSWR(url, options): возвращает data, loading, error, cacheHit, isStale, revalidate

Запуск проекта:
- npm install
- npm run dev
