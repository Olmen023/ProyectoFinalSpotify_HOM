/**
 * HOOK: USE AUDIO PLAYER - REPRODUCTOR DE PREVIEWS DE SPOTIFY
 * =============================================================
 * Hook personalizado para gestionar la reproducción de previews de audio (30 segundos)
 * de las canciones de Spotify. Utiliza la Web Audio API del navegador.
 *
 * FUNCIONALIDAD:
 * - Reproducción de previews de 30 segundos de canciones de Spotify
 * - Toggle play/pause para la misma canción
 * - Cambio automático entre diferentes canciones
 * - Detección automática de fin de reproducción
 * - Manejo de errores de audio
 *
 * ARQUITECTURA:
 * - Estado: Maneja currentTrack e isPlaying con useState
 * - Ref: Mantiene instancia persistente de Audio() con useRef
 * - Event Listeners: 'ended' y 'error' para manejo automático
 *
 * UTILIZADO POR:
 * - src/contexts/AudioPlayerContext.jsx (wrapper de contexto)
 * - Indirectamente: TrackCard, widgets de tracks, etc.
 *
 * DEPENDENCIAS DE REACT:
 * - useState: Estado de track actual y estado de reproducción
 * - useRef: Referencia persistente al objeto Audio
 * - useEffect: Inicialización y limpieza del reproductor
 *
 * NOTA IMPORTANTE:
 * Spotify solo proporciona previews de 30 segundos en la propiedad preview_url.
 * No todos los tracks tienen preview_url disponible.
 */

'use client';

import { useState, useRef, useEffect } from 'react';

/**
 * useAudioPlayer - Hook para reproducir previews de audio de Spotify
 *
 * ESTADOS INTERNOS:
 * - currentTrack: Object|null - Track que se está reproduciendo actualmente
 * - isPlaying: boolean - Si el audio está en reproducción
 * - audioRef: Ref<Audio> - Referencia al objeto Audio del navegador
 *
 * CICLO DE VIDA:
 * 1. Al montar: Crea instancia de Audio() y configura listeners
 * 2. Durante uso: Maneja play/pause/stop de tracks
 * 3. Al desmontar: Pausa y limpia la instancia de Audio
 *
 * FLUJO DE REPRODUCCIÓN:
 * play(track1) -> Reproduce track1
 * play(track1) de nuevo -> Pausa track1 (toggle)
 * play(track1) de nuevo -> Reanuda track1
 * play(track2) -> Detiene track1 y reproduce track2
 *
 * @returns {Object} - Objeto con propiedades y métodos:
 *   - currentTrack: Object|null - Track actual {id, name, preview_url, ...}
 *   - isPlaying: boolean - Estado de reproducción
 *   - play: (track) => void - Reproduce o pausa un track
 *   - pause: () => void - Pausa la reproducción
 *   - stop: () => void - Detiene y resetea completamente
 */
export function useAudioPlayer() {
  // Estado del track que se está reproduciendo actualmente
  const [currentTrack, setCurrentTrack] = useState(null);
  // Estado que indica si el audio está reproduciéndose
  const [isPlaying, setIsPlaying] = useState(false);
  // Referencia al objeto Audio (persiste entre re-renders)
  const audioRef = useRef(null);

  // EFECTO: Inicialización y limpieza del reproductor de audio
  // Se ejecuta solo una vez al montar el componente
  useEffect(() => {
    if (!audioRef.current) {
      // Crear instancia del reproductor de audio HTML5
      audioRef.current = new Audio();

      // LISTENER 1: Cuando la canción termina de reproducirse
      // Actualiza isPlaying a false automáticamente
      audioRef.current.addEventListener('ended', () => {
        setIsPlaying(false);
      });

      // LISTENER 2: Cuando ocurre un error al cargar o reproducir
      // Por ejemplo: preview_url inválido, problema de red, CORS, etc.
      audioRef.current.addEventListener('error', () => {
        setIsPlaying(false);
      });
    }

    // Función de limpieza: se ejecuta al desmontar el componente
    // Detiene la reproducción y limpia la referencia
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  /**
   * play - Reproduce un track o alterna play/pause si es el mismo track
   *
   * COMPORTAMIENTO:
   * - Si el track no tiene preview_url: no hace nada
   * - Si es el mismo track que está sonando: pausa
   * - Si es el mismo track pausado: reanuda
   * - Si es un track diferente: cambia de canción
   *
   * @param {Object} track - Objeto track de Spotify con propiedades:
   *   - id: string - ID único del track
   *   - preview_url: string - URL del preview de 30 segundos (puede ser null)
   *   - name: string - Nombre de la canción
   *   - artists: Array - Lista de artistas
   */
  const play = (track) => {
    // Validación: El track debe tener preview_url
    if (!track?.preview_url) {
      return;
    }

    if (audioRef.current) {
      // CASO 1: Es la misma canción que está cargada
      // Toggle entre play y pause
      if (currentTrack?.id === track.id) {
        if (isPlaying) {
          audioRef.current.pause();
          setIsPlaying(false);
        } else {
          audioRef.current.play();
          setIsPlaying(true);
        }
      } else {
        // CASO 2: Es una canción diferente
        // Cambiar el source y reproducir la nueva canción
        audioRef.current.src = track.preview_url;
        audioRef.current.play();
        setCurrentTrack(track);
        setIsPlaying(true);
      }
    }
  };

  /**
   * pause - Pausa la reproducción actual sin resetear
   *
   * COMPORTAMIENTO:
   * - Pausa el audio en su posición actual
   * - No cambia currentTrack
   * - Permite reanudar con play() después
   */
  const pause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  /**
   * stop - Detiene completamente la reproducción y resetea
   *
   * COMPORTAMIENTO:
   * - Pausa el audio
   * - Resetea la posición a 0
   * - Limpia currentTrack (vuelve a null)
   * - Actualiza isPlaying a false
   *
   * DIFERENCIA CON pause():
   * - pause(): Mantiene la posición y el track
   * - stop(): Resetea todo completamente
   */
  const stop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
      setCurrentTrack(null);
    }
  };

  // Retornar el estado y las funciones de control
  return {
    currentTrack,
    isPlaying,
    play,
    pause,
    stop,
  };
}
