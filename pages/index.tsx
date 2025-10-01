import React from 'react';
import { NextPageContext } from 'next';
import { getSession } from 'next-auth/react';

import Navbar from '@/components/Navbar';
import Billboard from '@/components/Billboard';
import MovieList from '@/components/MovieList';
import InfoModal from '@/components/InfoModal';
import useInfoModalStore from '@/hooks/useInfoModalStore';
import { usePopularMovies,useFavorites} from '@/hooks/useTMDB'; // Import the TMDB hook

export async function getServerSideProps(context: NextPageContext) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: '/auth',
        permanent: false,
      }
    }
  }

  return {
    props: {}
  }
}

const Home = () => {
  const { data: popularMovies = [], isLoading, error } = usePopularMovies();
  const { isOpen, closeModal, movieData } = useInfoModalStore();

  // You might want to handle loading and error states
  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="flex justify-center items-center h-screen">
          <p className="text-white text-xl">Loading...</p>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="flex justify-center items-center h-screen">
          <p className="text-white text-xl">Error loading movies</p>
        </div>
      </>
    );
  }

  return (
    <>
    
      <InfoModal visible={isOpen} onClose={closeModal} data={movieData}  />
      <Navbar />
      {popularMovies.length > 0 && <Billboard data={popularMovies[0]} />}
      <div className="pb-40">
        <MovieList title="Popular Movies" data={popularMovies} />
        {/* If you want to keep favorites, you'll need to implement it differently */}
        {/* <MovieList title="My List" data={useFavorites} /> */}
      </div>
    </>
  )
}

export default Home;