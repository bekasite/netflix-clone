import React from 'react';
import { PlayIcon } from '@heroicons/react/24/solid';
import { useRouter } from 'next/router';
// components/PlayButton.tsx
interface PlayButtonProps {
  movieId: string;
  hasTrailer?: boolean;
}

const PlayButton: React.FC<PlayButtonProps> = ({ movieId, hasTrailer = true }) => {
  const router = useRouter();

  const handleClick = () => {
    if (hasTrailer) {
      router.push(`/watch/${movieId}`);
    } else {
      // Show message or disable button
      alert('No trailer available for this movie');
    }
  };

  return (
    <button 
      onClick={handleClick}
      disabled={!hasTrailer}
      className={`
        bg-white 
        rounded-md 
        py-1 md:py-2 
        px-2 md:px-4
        w-auto 
        text-xs lg:text-lg 
        font-semibold
        flex
        flex-row
        items-center
        hover:bg-neutral-300
        transition
        ${!hasTrailer ? 'opacity-50 cursor-not-allowed' : ''}
      `}
    >
      <PlayIcon className="w-4 md:w-7 text-black mr-1" />
      Play
    </button>
  );
};

export default PlayButton;
