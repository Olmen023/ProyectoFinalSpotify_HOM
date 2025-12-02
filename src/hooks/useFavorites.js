'use client';

import { useState, useEffect, useCallback } from 'react';

/**
 * Hook para gestionar favoritos con localStorage
 * Permite añadir, eliminar y verificar canciones favoritas
 */
export function useFavorites() {
  const [favorites, setFavorites] = useState([]);

  // Cargar favoritos desde localStorage al montar
  useEffect(() => {
    const stored = localStorage.getItem('favorite_tracks');
    if (stored) {
      try {
        setFavorites(JSON.parse(stored));
      } catch (error) {
        console.error('Error parsing favorites:', error);
        setFavorites([]);
      }
    }
  }, []);

  const addFavorite = useCallback((track) => {
    setFavorites(prev => {
      const updated = [...prev, track];
      localStorage.setItem('favorite_tracks', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const removeFavorite = useCallback((trackId) => {
    setFavorites(prev => {
      const updated = prev.filter(t => t.id !== trackId);
      localStorage.setItem('favorite_tracks', JSON.stringify(updated));
      return updated;
    });
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
