import React, { useCallback } from 'react';
import { InformationCircleIcon } from '@heroicons/react/24/outline';

import PlayButton from '@/components/PlayButton';
import useInfoModalStore from '@/hooks/useInfoModalStore';
// import useBillboard from '@/hooks/useBillboard';

interface BillboardProps {
  data: any;
}

const Billboard: React.FC<BillboardProps> = ({ data }) => {
  const { openModal } = useInfoModalStore();

  const handleOpenModal = useCallback(() => {
    openModal(data?.id, {
      id: data.id,
      title: data.title,
      description: data.overview || data.description,
      backdrop_path:data.poster_path || data.thumbnailUrl,
      vote_average: data.vote_average,
      release_date: data.release_date
    });
  }, [openModal, data?.id]);

  return (
    <div className="relative h-[56.25vw]">
      <img 
        className="w-full h-[56.25vw] object-cover brightness-[60%] transition duration-500" 
        src={`https://image.tmdb.org/t/p/original${data?.backdrop_path}`} 
        alt={data?.title}
      />
      <div className="absolute top-[30%] md:top-[40%] ml-4 md:ml-16">
        <p className="text-white text-1xl md:text-5xl h-full w-[50%] lg:text-6xl font-bold drop-shadow-xl">
          {data?.title}
        </p>
        <p className="text-white text-[8px] md:text-lg mt-3 md:mt-8 w-[90%] md:w-[80%] lg:w-[50%] drop-shadow-xl">
          {data?.overview}
        </p>
        <div className="flex flex-row items-center mt-3 md:mt-4 gap-3">
          <PlayButton movieId={data?.id} />
          <button
            onClick={handleOpenModal}
            className="
            bg-white
            text-white
              bg-opacity-30 
              rounded-md 
              py-1 md:py-2 
              px-2 md:px-4
              w-auto 
              text-xs lg:text-lg 
              font-semibold
              flex
              flex-row
              items-center
              hover:bg-opacity-20
              transition
            "
            >
              <InformationCircleIcon className="w-4 md:w-7 mr-1" />
              More Info
          </button>
        </div>
      </div>
    </div>
  )
}
export default Billboard;