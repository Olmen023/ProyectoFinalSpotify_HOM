'use client';

import { createContext, useContext } from 'react';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';

const AudioPlayerContext = createContext();

export function AudioPlayerProvider({ children }) {
  const audioPlayer = useAudioPlayer();

  return (
    <AudioPlayerContext.Provider value={audioPlayer}>
      {children}
    </AudioPlayerContext.Provider>
  );
}

export function useAudioPlayerContext() {
  const context = useContext(AudioPlayerContext);
  if (context === undefined) {
    throw new Error('useAudioPlayerContext must be used within an AudioPlayerProvider');
  }
  return context;
}
