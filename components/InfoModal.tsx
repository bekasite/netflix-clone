import React, { useCallback, useEffect, useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

import PlayButton from "@/components/PlayButton";
import FavoriteButton from "@/components/FavoriteButton";
import useInfoModalStore from "../hooks/useInfoModalStore";

interface InfoModalProps {
  visible?: boolean;
  onClose: () => void;
  data: {
    id: string;
    title: string;
    description: string;
    backdrop_path: string; // Changed from backdrop_path to thumbnailUrl
    vote_average: number;
    release_date: string;
  };
}

const InfoModal: React.FC<InfoModalProps> = ({ visible, onClose, data }) => {
  const [isVisible, setIsVisible] = useState<boolean>(!!visible);

  useEffect(() => {
    setIsVisible(!!visible);
  }, [visible]);

  const handleClose = useCallback(() => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300);
  }, [onClose]);

  if (!visible) {
    return null;
  }

  return (
    <div className="z-50 transition duration-300 bg-black bg-opacity-80 flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0">
      <div className="relative w-auto mx-auto max-w-3xl rounded-md overflow-hidden">
        <div
          className={`${
            isVisible ? "scale-100" : "scale-0"
          } transform duration-300 relative flex-auto bg-zinc-900 drop-shadow-md`}
        >
          <div className="relative h-96">
            <img
              src={
                data?.backdrop_path
                  ? `https://image.tmdb.org/t/p/w500${data.backdrop_path}` // Use w500 for poster size
                  : "https://via.placeholder.com/500x750/1a1a1a/ffffff?text=No+Image"
              }
              alt={data?.title || "Movie backdrop"}
              className="w-full brightness-[60%] object-cover h-full"
              onError={(e) => {
                e.currentTarget.src =
                  "https://via.placeholder.com/500x750/1a1a1a/ffffff?text=No+Image";
              }}
            />
            <div
              onClick={handleClose}
              className="cursor-pointer absolute top-3 right-3 h-10 w-10 rounded-full bg-black bg-opacity-70 flex items-center justify-center"
            >
              <XMarkIcon className="text-white w-6" />
            </div>
            <div className="absolute bottom-[10%] left-10">
              <p className="text-white text-3xl md:text-4xl h-full lg:text-5xl font-bold mb-8">
                {data?.title}
              </p>
              <div className="flex flex-row gap-4 items-center">
                <PlayButton movieId={data.id} hasTrailer={true} />
                <FavoriteButton movieId={data.id} />
              </div>
            </div>
          </div>

          <div className="px-12 py-8">
            <div className="flex flex-row items-center gap-2 mb-8">
              <p className="text-green-400 font-semibold text-lg">
                Rating: {data?.vote_average?.toFixed(1)}/10
              </p>
              <p className="text-white text-lg">
                {data?.release_date
                  ? new Date(data.release_date).getFullYear()
                  : "N/A"}
              </p>
            </div>
            <p className="text-white text-lg">
              {data?.description || "No description available."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoModal;
