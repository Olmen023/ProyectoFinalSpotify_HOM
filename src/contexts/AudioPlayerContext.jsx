/**
 * CONTEXTO: AUDIO PLAYER CONTEXT - GESTIÓN GLOBAL DEL REPRODUCTOR DE AUDIO
 * ==========================================================================
 * Este contexto proporciona acceso global al reproductor de audio de la aplicación.
 * Permite que cualquier componente pueda reproducir previews de canciones de Spotify
 * sin necesidad de manejar el estado del reproductor localmente.
 *
 * ARQUITECTURA:
 * - Wrapper sobre el hook useAudioPlayer (src/hooks/useAudioPlayer.jsx)
 * - Proporciona acceso global mediante Context API de React
 * - Gestiona una única instancia del reproductor de audio para toda la app
 *
 * REFERENCIAS:
 * - Importa useAudioPlayer desde @/hooks/useAudioPlayer (src/hooks/useAudioPlayer.jsx)
 * - Usado en: src/app/layout.js (envuelve toda la aplicación)
 *
 * COMPONENTES QUE LO UTILIZAN:
 * - src/components/playlist/TrackCard.jsx (botón de reproducir preview)
 * - src/components/widgets/TrackWidget.jsx (reproducir tracks)
 * - Cualquier componente que necesite reproducir audio
 *
 * VENTAJAS DE ESTE PATRÓN:
 * - Un solo reproductor de audio para toda la app (evita múltiples instancias)
 * - Estado compartido del track actual entre componentes
 * - Control centralizado de reproducción/pausa
 */

'use client';

import { createContext, useContext } from 'react';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';

// Creación del contexto (inicialmente undefined)
const AudioPlayerContext = createContext();

/**
 * AudioPlayerProvider - Proveedor del contexto de reproductor de audio
 *
 * DESCRIPCIÓN:
 * Componente que envuelve la aplicación y proporciona acceso global
 * al reproductor de audio. Internamente usa el hook useAudioPlayer
 * para gestionar el estado y la lógica del reproductor.
 *
 * ESTADO PROVISTO (desde useAudioPlayer):
 * - currentTrack: Object|null - Canción que se está reproduciendo actualmente
 * - isPlaying: boolean - Si el audio está reproduciéndose
 * - play(track): Function - Reproduce una canción (o pausa si es la misma)
 * - pause(): Function - Pausa la reproducción
 * - stop(): Function - Detiene y resetea el reproductor
 *
 * CICLO DE VIDA:
 * 1. Al montar: useAudioPlayer crea una instancia de Audio()
 * 2. Proporciona el objeto audioPlayer completo a través del contexto
 * 3. Los componentes hijos pueden acceder a play(), pause(), etc.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Componentes hijos que tendrán acceso al reproductor
 *
 * @returns {JSX.Element} - Provider con el estado del reproductor
 */
export function AudioPlayerProvider({ children }) {
  // Obtener todas las funciones y estado del hook useAudioPlayer
  const audioPlayer = useAudioPlayer();

  // Proveer el objeto completo audioPlayer a través del contexto
  return (
    <AudioPlayerContext.Provider value={audioPlayer}>
      {children}
    </AudioPlayerContext.Provider>
  );
}

/**
 * useAudioPlayerContext - Hook para acceder al reproductor de audio
 *
 * DESCRIPCIÓN:
 * Hook personalizado que permite a cualquier componente acceder
 * al reproductor de audio global. Incluye validación para asegurar
 * que se use dentro de un AudioPlayerProvider.
 *
 * USO TÍPICO:
 * ```jsx
 * const { play, pause, currentTrack, isPlaying } = useAudioPlayerContext();
 *
 * // Reproducir una canción
 * const handlePlay = () => {
 *   play(track); // track debe tener preview_url
 * };
 *
 * // Verificar si una canción está reproduciéndose
 * const isThisTrackPlaying = currentTrack?.id === track.id && isPlaying;
 * ```
 *
 * @returns {Object} - Objeto del reproductor con propiedades:
 *   - currentTrack: Object|null - Track actual {id, name, preview_url, ...}
 *   - isPlaying: boolean - Estado de reproducción
 *   - play: (track) => void - Reproduce/pausa una canción
 *   - pause: () => void - Pausa la reproducción
 *   - stop: () => void - Detiene completamente
 *
 * ERRORES:
 * - Lanza error si se usa fuera de AudioPlayerProvider
 *
 * EJEMPLO DE ERROR:
 * Si usas useAudioPlayerContext() en un componente que no está
 * dentro de <AudioPlayerProvider>, obtendrás:
 * "useAudioPlayerContext must be used within an AudioPlayerProvider"
 */
export function useAudioPlayerContext() {
  const context = useContext(AudioPlayerContext);
  if (context === undefined) {
    throw new Error('useAudioPlayerContext must be used within an AudioPlayerProvider');
  }
  return context;
}
