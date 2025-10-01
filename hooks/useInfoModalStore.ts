// hooks/useInfoModalStore.ts
import { create } from "zustand";

// hooks/useInfoModalStore.ts
export interface MovieData {
  id: string;
  title: string;
  description: string; // Add this line
  backdrop_path: string; // Add this line
  vote_average: number;
  release_date: string;
  // Add other properties you need
}

interface InfoModalStore {
  movieId?: string;
  movieData?: MovieData;
  isOpen: boolean;
  openModal: (movieId: string, movieData?: MovieData) => void;
  closeModal: () => void;
  setMovieData: (data: MovieData) => void;
}

const useInfoModalStore = create<InfoModalStore>((set) => ({
  movieId: undefined,
  movieData: undefined,
  isOpen: false,
  openModal: (movieId: string, movieData?: MovieData) =>
    set({ isOpen: true, movieId, movieData }),
  closeModal: () =>
    set({ isOpen: false, movieId: undefined, movieData: undefined }),
  setMovieData: (data: MovieData) => set({ movieData: data }),
}));

export default useInfoModalStore;
