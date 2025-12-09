'use client';

import { useState, useEffect, useCallback } from 'react';
import { getAccessToken } from '@/lib/auth';

/**
 * Hook para gestionar favoritos con Spotify API y localStorage como fallback
 * Permite añadir, eliminar y verificar canciones favoritas
 */
export function useFavorites() {
  const [favorites, setFavorites] = useState([]);

  // Cargar favoritos desde localStorage al montar (fallback)
  useEffect(() => {
    const stored = localStorage.getItem('favorite_tracks');
    if (stored) {
      try {
        setFavorites(JSON.parse(stored));
      } catch (error) {
        setFavorites([]);
      }
    }
  }, []);

  const addFavorite = useCallback(async (track) => {
    // Actualizar localStorage inmediatamente para UI rápida
    setFavorites(prev => {
      const updated = [...prev, track];
      localStorage.setItem('favorite_tracks', JSON.stringify(updated));
      return updated;
    });

    // Sincronizar con Spotify API
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
      // Error silenciado
    }
  }, []);

  const removeFavorite = useCallback(async (trackId) => {
    // Actualizar localStorage inmediatamente para UI rápida
    setFavorites(prev => {
      const updated = prev.filter(t => t.id !== trackId);
      localStorage.setItem('favorite_tracks', JSON.stringify(updated));
      return updated;
    });

    // Sincronizar con Spotify API
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
      // Error silenciado
    }
  }, []);

  const toggleFavorite = useCallback((track) => {
    const isFav = favorites.some(f => f.id === track.id);
    if (isFav) {
      removeFavorite(track.id);
    } else {
      addFavorite(track);
    }
  }, [favorites, addFavorite, removeFavorite]);

  const isFavorite = useCallback((trackId) => {
    return favorites.some(f => f.id === trackId);
  }, [favorites]);

  return {
    favorites,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite
  };
}
