import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from './auth/[...nextauth]';
import prismadb from '@/libs/prismadb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = await getServerSession(req, res, authOptions);

    if (!session?.user?.email) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const currentUser = await prismadb.user.findUnique({
      where: {
        email: session.user.email,
      }
    });

    if (!currentUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Fetch TMDB movie details for each favorite
    const favoriteMovies = await Promise.all(
      currentUser.favoriteIds.map(async (movieId: string) => {
        try {
          const response = await fetch(
            `https://api.themoviedb.org/3/movie/${movieId}?api_key=b0b94cdbcca4c27ce050ef41af35b1b0`
          );
          if (response.ok) {
            const movieData = await response.json();
            return {
              id: movieData.id.toString(),
              title: movieData.title,
              thumbnailUrl: movieData.poster_path 
                ? `https://image.tmdb.org/t/p/w500${movieData.poster_path}`
                : '',
            };
          }
          return null;
        } catch (error) {
          console.error(`Error fetching movie ${movieId}:`, error);
          return null;
        }
      })
    );

    // Filter out any failed requests
    const validMovies = favoriteMovies.filter(movie => movie !== null);

    return res.status(200).json(validMovies);
  } catch (error) {
    console.error('Favorites API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}