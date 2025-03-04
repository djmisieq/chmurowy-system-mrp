import { useState, useEffect } from 'react';

export function useFetch<T>(fetchFn: () => Promise<T>) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const result = await fetchFn();
        setData(result);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Nieznany błąd'));
        console.error('Błąd podczas pobierania danych:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [fetchFn]);

  return { data, isLoading, error };
}
