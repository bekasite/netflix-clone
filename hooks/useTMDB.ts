// hooks/useTmdb.ts
import useSWR from 'swr';
import axios from 'axios';

interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  vote_average: number;
  // Add other properties as needed
}

interface MoviesResponse {
  results: Movie[];
  page: number;
  total_pages: number;
  total_results: number;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export const usePopularMovies = () => {
  const { data, error, isLoading } = useSWR<MoviesResponse>(
    'https://api.themoviedb.org/3/movie/popular?api_key=b0b94cdbcca4c27ce050ef41af35b1b0',
    fetcher
  );

  return {
    data: data?.results,
    error,
    isLoading
  };
};

export const useMovie = (id?: string) => {
  const { data, error, isLoading } = useSWR<Movie>(
    id ? `https://api.themoviedb.org/3/movie/${id}?api_key=b0b94cdbcca4c27ce050ef41af35b1b0` : null,
    fetcher
  );

  return {
    data,
    error,
    isLoading
  };
};

// Update useFavorites to work with your existing FavoriteButton component
export const useFavorites = () => {
  const { data, error, isLoading, mutate } = useSWR<Movie[]>(
    '/api/favorites',
    fetcher
  );

  return {
    data: data || [],
    error,
    isLoading,
    mutate
  };
};