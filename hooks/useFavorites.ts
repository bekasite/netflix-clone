// hooks/useFavorites.ts
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const useFavorites = () => {
  const { data, error, isLoading, mutate } = useSWR(
    '/api/favorites',
    fetcher,
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    }
  );

  return {
    data: data || [],
    error,
    isLoading,
    mutate
  };
};

export default useFavorites;