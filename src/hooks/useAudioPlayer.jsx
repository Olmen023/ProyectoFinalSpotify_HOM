'use client';

import { useState, useRef, useEffect } from 'react';

/**
 * Hook para manejar la reproducción de audio
 */
export function useAudioPlayer() {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();

      audioRef.current.addEventListener('ended', () => {
        setIsPlaying(false);
      });

      audioRef.current.addEventListener('error', () => {
        setIsPlaying(false);
      });
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const play = (track) => {
    if (!track?.preview_url) {
      return;
    }

    if (audioRef.current) {
      // Si es la misma canción, pausar/reanudar
      if (currentTrack?.id === track.id) {
        if (isPlaying) {
          audioRef.current.pause();
          setIsPlaying(false);
        } else {
          audioRef.current.play();
          setIsPlaying(true);
        }
      } else {
        // Nueva canción
        audioRef.current.src = track.preview_url;
        audioRef.current.play();
        setCurrentTrack(track);
        setIsPlaying(true);
      }
    }
  };

  const pause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const stop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
      setCurrentTrack(null);
    }
  };

  return {
    currentTrack,
    isPlaying,
    play,
    pause,
    stop,
  };
}
