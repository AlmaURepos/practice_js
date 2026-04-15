import { useCallback, useState } from "react";
import { useApi, useMutation, usePaginatedApi } from "./hooks/useApi";
import useLocalStorage from "./hooks/useLocalStorage";
import useDebounce, { useDebouncedCallback } from "./hooks/useDebounce";
import useFetch, { useFetchSWR } from "./hooks/useFetch";

const cardStyle = {
  background: "#ffffff",
  borderRadius: "12px",
  border: "1px solid #dbe3ef",
  padding: "16px",
};

function SectionTitle({ children }) {
  return (
    <h2
      style={{
        margin: 0,
        marginBottom: "12px",
        fontSize: "18px",
        color: "#0f172a",
      }}
    >
      {children}
    </h2>
  );
}

export default function App() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  const searchApi = useCallback(async () => {
    const response = await fetch("/posts.json");
    if (!response.ok) {
      throw new Error("Не удалось загрузить posts.json");
    }

    const items = await response.json();
    const term = debouncedSearch.trim().toLowerCase();

    if (!term) {
      return items;
    }

    return items.filter((item) => item.title.toLowerCase().includes(term));
  }, [debouncedSearch]);

  const {
    data: posts,
    loading: postsLoading,
    error: postsError,
    refetch: refetchPosts,
  } = useApi(searchApi, [debouncedSearch]);

  const createPostApi = useCallback(async (payload) => {
    await new Promise((resolve) => setTimeout(resolve, 600));
    return {
      id: Date.now(),
      createdAt: new Date().toISOString(),
      ...payload,
    };
  }, []);

  const {
    mutate: createPost,
    loading: mutationLoading,
    error: mutationError,
    data: mutationData,
  } = useMutation(createPostApi);

  const [newPostTitle, setNewPostTitle] = useState("");

  const usersApi = useCallback(async (page, pageSize) => {
    const response = await fetch("/users.json");
    if (!response.ok) {
      throw new Error("Не удалось загрузить users.json");
    }

    const users = await response.json();
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    await new Promise((resolve) => setTimeout(resolve, 300));
    return users.slice(start, end);
  }, []);

  const {
    data: users,
    loading: usersLoading,
    error: usersError,
    loadMore,
    hasMore,
    reset,
    page,
  } = usePaginatedApi(usersApi, 4);

  const [note, setNote, clearNote] = useLocalStorage("lab13-note", "");
  const [saveInfo, setSaveInfo] = useState("Сохранение еще не запускалось");

  const saveNoteDebounced = useDebouncedCallback((value) => {
    setNote(value);
    setSaveInfo(`Сохранено в localStorage: ${new Date().toLocaleTimeString()}`);
  }, 700);

  const {
    data: stats,
    loading: statsLoading,
    error: statsError,
    cacheHit,
    refetch: refetchStats,
    clearCache,
  } = useFetch("/stats.json");

  const {
    data: swrData,
    loading: swrLoading,
    error: swrError,
    cacheHit: swrCacheHit,
    isStale,
    revalidate,
  } = useFetchSWR("/stats.json");

  return (
    <div style={{ maxWidth: "980px", margin: "0 auto", padding: "24px" }}>
      <h1 style={{ marginTop: 0, color: "#0b3b8c" }}>Lab 13.2: Custom Hooks - useApi</h1>

      <div style={{ display: "grid", gap: "16px" }}>
        <section style={cardStyle}>
          <SectionTitle>useApi + useDebounce (поиск по постам)</SectionTitle>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Введите текст для поиска"
            style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
          />
          <button onClick={refetchPosts} style={{ marginBottom: "10px" }}>
            Обновить вручную
          </button>
          {postsLoading && <p>Загрузка...</p>}
          {postsError && <p style={{ color: "#dc2626" }}>{postsError}</p>}
          {!postsLoading && !postsError && (
            <ul style={{ margin: 0, paddingLeft: "18px" }}>
              {(posts || []).map((post) => (
                <li key={post.id}>
                  {post.title} ({post.category})
                </li>
              ))}
            </ul>
          )}
        </section>

        <section style={cardStyle}>
          <SectionTitle>useMutation (создание записи)</SectionTitle>
          <div style={{ display: "flex", gap: "8px", marginBottom: "10px" }}>
            <input
              value={newPostTitle}
              onChange={(e) => setNewPostTitle(e.target.value)}
              placeholder="Новый заголовок"
              style={{ flex: 1, padding: "10px" }}
            />
            <button
              disabled={mutationLoading || !newPostTitle.trim()}
              onClick={async () => {
                try {
                  await createPost({ title: newPostTitle.trim(), category: "custom" });
                  setNewPostTitle("");
                } catch {
                  // Ошибка отображается через mutationError.
                }
              }}
            >
              {mutationLoading ? "Сохранение..." : "Создать"}
            </button>
          </div>
          {mutationError && <p style={{ color: "#dc2626" }}>{mutationError}</p>}
          {mutationData && (
            <pre style={{ background: "#eef3ff", padding: "10px", borderRadius: "8px" }}>
              {JSON.stringify(mutationData, null, 2)}
            </pre>
          )}
        </section>

        <section style={cardStyle}>
          <SectionTitle>usePaginatedApi (постраничная загрузка)</SectionTitle>
          <p style={{ marginTop: 0 }}>Текущая страница: {page}</p>
          {usersError && <p style={{ color: "#dc2626" }}>{usersError}</p>}
          <ul style={{ margin: 0, paddingLeft: "18px" }}>
            {users.map((user) => (
              <li key={user.id}>{user.name}</li>
            ))}
          </ul>
          <div style={{ display: "flex", gap: "8px", marginTop: "10px" }}>
            <button disabled={usersLoading || !hasMore} onClick={loadMore}>
              {usersLoading ? "Загрузка..." : hasMore ? "Загрузить еще" : "Больше данных нет"}
            </button>
            <button disabled={usersLoading} onClick={reset}>
              Сброс
            </button>
          </div>
        </section>

        <section style={cardStyle}>
          <SectionTitle>useLocalStorage + useDebouncedCallback</SectionTitle>
          <textarea
            defaultValue={note}
            onChange={(e) => saveNoteDebounced(e.target.value)}
            placeholder="Введите заметку. Сохранение в localStorage произойдет с задержкой."
            rows={4}
            style={{ width: "100%", padding: "10px", resize: "vertical" }}
          />
          <p>{saveInfo}</p>
          <button
            onClick={() => {
              clearNote();
              setSaveInfo("Значение очищено");
            }}
          >
            Очистить localStorage
          </button>
        </section>

        <section style={cardStyle}>
          <SectionTitle>useFetch с кэшем + useFetchSWR</SectionTitle>
          <div style={{ display: "flex", gap: "8px", marginBottom: "10px", flexWrap: "wrap" }}>
            <button onClick={refetchStats}>Refetch (без кэша)</button>
            <button
              onClick={() => {
                clearCache();
                refetchStats();
              }}
            >
              Очистить кэш и загрузить
            </button>
            <button onClick={revalidate}>SWR Revalidate</button>
          </div>
          {statsLoading && <p>Загрузка stats...</p>}
          {statsError && <p style={{ color: "#dc2626" }}>{statsError}</p>}
          {stats && (
            <pre style={{ background: "#eef3ff", padding: "10px", borderRadius: "8px" }}>
              {JSON.stringify({ cacheHit, stats }, null, 2)}
            </pre>
          )}

          <h3 style={{ marginBottom: "8px" }}>SWR статус</h3>
          {swrLoading && <p>SWR loading...</p>}
          {swrError && <p style={{ color: "#dc2626" }}>{swrError}</p>}
          {swrData && (
            <pre style={{ background: "#f5f8ff", padding: "10px", borderRadius: "8px" }}>
              {JSON.stringify({ swrCacheHit, isStale, swrData }, null, 2)}
            </pre>
          )}
        </section>
      </div>
    </div>
  );
}
