// pages/api/movies/[movieId].ts
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { movieId } = req.query;

  try {
    // Fetch movie data from TMDB
    const movieResponse = await fetch(
      `https://api.themoviedb.org/3/movie/${movieId}?api_key=b0b94cdbcca4c27ce050ef41af35b1b0`
    );

    // Fetch videos (trailers, clips) for the movie
    const videosResponse = await fetch(
      `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=b0b94cdbcca4c27ce050ef41af35b1b0`
    );

    if (!movieResponse.ok || !videosResponse.ok) {
      throw new Error("Failed to fetch from TMDB");
    }

    const movieData = await movieResponse.json();
    const videosData = await videosResponse.json();

    // Find a trailer (usually YouTube videos)
    const trailer = videosData.results.find(
      (video: any) => video.type === "Trailer" && video.site === "YouTube"
    );

    // Transform TMDB data
    // pages/api/movies/[movieId].ts
    // Update the transformedData to match what InfoModal expects:
    const transformedData = {
      id: movieData.id.toString(),
      title: movieData.title,
      overview: movieData.overview, // instead of description
      backdrop_path: movieData.backdrop_path
        ? `https://image.tmdb.org/t/p/original${movieData.backdrop_path}`
        : "",
      vote_average: movieData.vote_average,
      release_date: movieData.release_date,
      // Keep other properties if needed elsewhere
      thumbnailUrl: movieData.poster_path
        ? `https://image.tmdb.org/t/p/w500${movieData.poster_path}`
        : "",
      videoUrl: trailer ? `https://www.youtube.com/embed/${trailer.key}` : "",
      duration: movieData.runtime
        ? `${Math.floor(movieData.runtime / 60)}h ${movieData.runtime % 60}m`
        : "Unknown",
      genre: movieData.genres
        ? movieData.genres.map((g: any) => g.name).join(", ")
        : "Unknown",
    };

    res.status(200).json(transformedData);
  } catch (error) {
    console.error("Error fetching movie:", error);
    res.status(500).json({ error: "Failed to fetch movie" });
  }
}
