/**
 * HOOK: USE FAVORITES - GESTIÓN DE CANCIONES FAVORITAS
 * ======================================================
 * Hook personalizado para gestionar las canciones favoritas del usuario.
 * Implementa persistencia dual: localStorage (inmediata) y Spotify API (sincronización).
 *
 * ARQUITECTURA DE PERSISTENCIA DUAL:
 * 1. localStorage: Actualización inmediata para UI responsive
 * 2. Spotify API: Sincronización en background para persistencia en cuenta de Spotify
 *
 * VENTAJAS DE ESTE ENFOQUE:
 * - UI instantánea: El usuario ve cambios inmediatamente
 * - Persistencia local: Funciona offline o si falla la API
 * - Sincronización con Spotify: Los favoritos se guardan en la cuenta del usuario
 * - Graceful degradation: Si falla la API, al menos funciona localmente
 *
 * UTILIZADO EN:
 * - src/app/dashboard/favorites/FavoritesClient.jsx (página de favoritos)
 * - src/components/playlist/TrackCard.jsx (botón de corazón)
 * - Cualquier componente que necesite gestionar favoritos
 *
 * REFERENCIAS:
 * - Importa getAccessToken desde @/lib/auth (src/lib/auth.js)
 *
 * ENDPOINTS DE SPOTIFY UTILIZADOS:
 * - PUT /me/tracks - Guardar tracks como favoritos
 * - DELETE /me/tracks - Eliminar tracks de favoritos
 *
 * DEPENDENCIAS DE REACT:
 * - useState: Estado de la lista de favoritos
 * - useEffect: Carga inicial desde localStorage
 * - useCallback: Memoización de funciones para optimización
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { getAccessToken } from '@/lib/auth';

/**
 * useFavorites - Hook para gestionar favoritos con persistencia dual
 *
 * ESTADO INTERNO:
 * - favorites: Array<Object> - Lista de tracks favoritos del usuario
 *
 * FLUJO DE CARGA INICIAL:
 * 1. Al montar: Lee 'favorite_tracks' de localStorage
 * 2. Parsea el JSON (o usa [] si falla)
 * 3. Establece el estado inicial de favorites
 *
 * FLUJO DE SINCRONIZACIÓN:
 * addFavorite(track):
 *   1. Actualiza estado local + localStorage inmediatamente
 *   2. Usuario ve cambio instantáneo
 *   3. Sincroniza con Spotify API en background
 *   4. Si falla API: al menos está guardado localmente
 *
 * @returns {Object} - Objeto con propiedades y métodos:
 *   - favorites: Array<Object> - Lista de tracks favoritos
 *   - addFavorite: (track) => Promise - Añade un track a favoritos
 *   - removeFavorite: (trackId) => Promise - Elimina un track de favoritos
 *   - toggleFavorite: (track) => void - Alterna el estado de favorito
 *   - isFavorite: (trackId) => boolean - Verifica si un track es favorito
 */
export function useFavorites() {
  // Estado que mantiene la lista de canciones favoritas
  const [favorites, setFavorites] = useState([]);

  // EFECTO: Cargar favoritos desde localStorage al montar el componente
  // Esto proporciona persistencia local incluso si la API de Spotify no está disponible
  useEffect(() => {
    const stored = localStorage.getItem('favorite_tracks');
    if (stored) {
      try {
        // Intentar parsear el JSON guardado
        setFavorites(JSON.parse(stored));
      } catch (error) {
        // Si falla el parsing (JSON corrupto), usar array vacío
        setFavorites([]);
      }
    }
  }, []);

  /**
   * addFavorite - Añade una canción a favoritos
   *
   * ESTRATEGIA OPTIMISTA:
   * Actualiza la UI inmediatamente (optimistic update) antes de la confirmación de la API.
   * Esto proporciona una experiencia de usuario más fluida.
   *
   * FLUJO:
   * 1. Añade el track al estado local inmediatamente
   * 2. Guarda en localStorage
   * 3. Usuario ve el cambio instantáneamente
   * 4. En paralelo: intenta sincronizar con Spotify API
   * 5. Si falla la API: el favorito se mantiene localmente
   *
   * @param {Object} track - Objeto track de Spotify con propiedades:
   *   - id: string - ID del track
   *   - name: string - Nombre de la canción
   *   - artists: Array - Artistas
   *   - album: Object - Información del álbum
   *   - preview_url: string - URL del preview
   */
  const addFavorite = useCallback(async (track) => {
    // PASO 1: Actualizar localStorage inmediatamente para UI rápida
    setFavorites(prev => {
      const updated = [...prev, track];
      localStorage.setItem('favorite_tracks', JSON.stringify(updated));
      return updated;
    });

    // PASO 2: Sincronizar con Spotify API en background
    // Esto guarda el favorito en la cuenta de Spotify del usuario
    try {
      const token = getAccessToken();
      if (token) {
        await fetch(`https://api.spotify.com/v1/me/tracks`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            ids: [track.id]
          })
        });
      }
    } catch (error) {
      // Error silenciado - la actualización local ya se hizo
      // En una implementación más robusta, podrías:
      // - Mostrar un toast de "Guardado localmente, sincronización fallida"
      // - Reintentar la sincronización más tarde
      // - Revertir el cambio local si es crítico
    }
  }, []);

  /**
   * removeFavorite - Elimina una canción de favoritos
   *
   * ESTRATEGIA OPTIMISTA:
   * Similar a addFavorite, actualiza la UI inmediatamente.
   *
   * FLUJO:
   * 1. Elimina el track del estado local inmediatamente
   * 2. Actualiza localStorage
   * 3. Usuario ve el cambio instantáneamente
   * 4. En paralelo: intenta sincronizar con Spotify API
   *
   * @param {string} trackId - ID del track a eliminar
   */
  const removeFavorite = useCallback(async (trackId) => {
    // PASO 1: Actualizar localStorage inmediatamente para UI rápida
    setFavorites(prev => {
      const updated = prev.filter(t => t.id !== trackId);
      localStorage.setItem('favorite_tracks', JSON.stringify(updated));
      return updated;
    });

    // PASO 2: Sincronizar con Spotify API en background
    try {
      const token = getAccessToken();
      if (token) {
        await fetch(`https://api.spotify.com/v1/me/tracks`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            ids: [trackId]
          })
        });
      }
    } catch (error) {
      // Error silenciado - la actualización local ya se hizo
    }
  }, []);

  /**
   * toggleFavorite - Alterna el estado de favorito de un track
   *
   * DESCRIPCIÓN:
   * Función de conveniencia que verifica si el track es favorito
   * y llama a addFavorite o removeFavorite según corresponda.
   *
   * USO TÍPICO:
   * <button onClick={() => toggleFavorite(track)}>
   *   {isFavorite(track.id) ? '♥' : '♡'}
   * </button>
   *
   * @param {Object} track - Objeto track completo de Spotify
   */
  const toggleFavorite = useCallback((track) => {
    const isFav = favorites.some(f => f.id === track.id);
    if (isFav) {
      removeFavorite(track.id);
    } else {
      addFavorite(track);
    }
  }, [favorites, addFavorite, removeFavorite]);

  /**
   * isFavorite - Verifica si un track es favorito
   *
   * DESCRIPCIÓN:
   * Función de utilidad para comprobar si un track específico
   * está en la lista de favoritos.
   *
   * @param {string} trackId - ID del track a verificar
   * @returns {boolean} - true si el track es favorito, false si no
   *
   * USO:
   * const heartIcon = isFavorite(track.id) ? '♥' : '♡';
   */
  const isFavorite = useCallback((trackId) => {
    return favorites.some(f => f.id === trackId);
  }, [favorites]);

  // Retornar todas las funciones y estado para uso externo
  return {
    favorites,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite
  };
}
