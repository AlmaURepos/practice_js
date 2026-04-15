import { useState, useEffect, useCallback, useRef } from "react";

/**
 * Custom hook for API data fetching with loading and error states.
 * @param {Function} apiFunction Async function to call.
 * @param {Array} dependencies Dependencies that trigger refetch.
 * @returns {{data:any, loading:boolean, error:string|null, refetch:Function}}
 */
export function useApi(apiFunction, dependencies = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [trigger, setTrigger] = useState(0);
  const isMounted = useRef(true);
  const abortController = useRef(null);

  const execute = useCallback(async () => {
    if (abortController.current) {
      abortController.current.abort();
    }

    abortController.current = new AbortController();
    setLoading(true);
    setError(null);

    try {
      const result = await apiFunction(abortController.current.signal);

      if (isMounted.current) {
        setData(result);
        setError(null);
      }
    } catch (err) {
      if (err?.name === "AbortError") {
        return;
      }

      if (isMounted.current) {
        setError(err?.message || "An error occurred");
        setData(null);
      }
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, [apiFunction, ...dependencies]);

  useEffect(() => {
    isMounted.current = true;
    execute();

    return () => {
      isMounted.current = false;
      if (abortController.current) {
        abortController.current.abort();
      }
    };
  }, [execute, trigger]);

  const refetch = useCallback(() => {
    setTrigger((t) => t + 1);
  }, []);

  return { data, loading, error, refetch };
}

/**
 * Hook for making POST/PUT/DELETE requests.
 */
export function useMutation(apiFunction) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const mutate = useCallback(
    async (payload) => {
      setLoading(true);
      setError(null);

      try {
        const result = await apiFunction(payload);
        setData(result);
        return result;
      } catch (err) {
        setError(err?.message || "An error occurred");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [apiFunction]
  );

  return { mutate, loading, error, data };
}

/**
 * Hook for paginated data fetching.
 */
export function usePaginatedApi(apiFunction, pageSize = 10) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchPage = useCallback(
    async (pageNum) => {
      setLoading(true);
      setError(null);

      try {
        const result = await apiFunction(pageNum, pageSize);

        if (!Array.isArray(result)) {
          throw new Error("Paginated API must return an array");
        }

        if (result.length < pageSize) {
          setHasMore(false);
        }

        setData((prev) => (pageNum === 1 ? result : [...prev, ...result]));
      } catch (err) {
        setError(err?.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    },
    [apiFunction, pageSize]
  );

  useEffect(() => {
    fetchPage(1);
  }, [fetchPage]);

  const loadMore = useCallback(() => {
    if (loading || !hasMore) {
      return;
    }

    const nextPage = page + 1;
    setPage(nextPage);
    fetchPage(nextPage);
  }, [loading, hasMore, fetchPage, page]);

  const reset = useCallback(() => {
    setData([]);
    setPage(1);
    setHasMore(true);
    fetchPage(1);
  }, [fetchPage]);

  return { data, loading, error, loadMore, hasMore, reset, page };
}

export default useApi;
