import React from 'react';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/router';
import useMovie from '@/hooks/useMovie';

const Watch = () => {
  const router = useRouter();
  const { movieId } = router.query;
  const { data } = useMovie(movieId as string);

  // Check if it's a YouTube URL
  const isYouTube = data?.videoUrl?.includes('youtube.com/embed');

  return (
    <div className="h-screen w-screen bg-black">
      <nav className="fixed w-full p-4 z-10 flex flex-row items-center gap-8 bg-black bg-opacity-100">
        <ArrowLeftIcon 
          onClick={() => router.push('/')} 
          className="w-4 md:w-10 text-white cursor-pointer hover:opacity-80 transition" 
        />
        <p className="text-white text-1xl md:text-3xl font-bold">
          <span className="font-light">Watching:</span> {data?.title}
        </p>
      </nav>
      
      {isYouTube ? (
        // For YouTube videos, use iframe
        <iframe
          className="h-full w-full mt-1"
          src={data?.videoUrl}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title={data?.title}
        />
      ) : data?.videoUrl ? (
        // For direct video files, use video element
        <video 
          className="h-full w-full" 
          autoPlay 
          controls 
          src={data.videoUrl}
        />
      ) : (
        // No video available
        <div className="h-full w-full flex items-center justify-center">
          <div className="text-center">
            <p className="text-white text-xl mb-4">Loading ...</p>
           
          </div>
        </div>
      )}
    </div>
  );
};

export default Watch;