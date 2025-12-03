'use client';

import { useState, useCallback } from 'react';
import { getAccessToken } from '@/lib/auth';

/**
 * Hook principal para interactuar con la Spotify Web API
 * Proporciona métodos para búsqueda, recomendaciones y gestión de playlists
 */
export function useSpotify() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const spotifyFetch = useCallback(async (endpoint) => {
    const token = getAccessToken();
    if (!token) throw new Error('No token available');

    const response = await fetch(`https://api.spotify.com/v1${endpoint}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!response.ok) {
      if (response.status === 401) {
        // Token expirado - aquí podrías implementar refresh
        throw new Error('Token expired. Please login again.');
      }
      if (response.status === 403) {
        throw new Error('Permission denied. Please re-authenticate with required permissions.');
      }
      throw new Error(`API Error: ${response.status}`);
    }

    return response.json();
  }, []);

  const searchArtists = useCallback(async (query) => {
    if (!query || query.trim().length === 0) return [];

    setLoading(true);
    setError(null);
    try {
      const data = await spotifyFetch(`/search?type=artist&q=${encodeURIComponent(query)}&limit=10`);
      return data.artists.items;
    } catch (err) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, [spotifyFetch]);

  const searchTracks = useCallback(async (query) => {
    if (!query || query.trim().length === 0) return [];

    setLoading(true);
    setError(null);
    try {
      const data = await spotifyFetch(`/search?type=track&q=${encodeURIComponent(query)}&limit=20`);
      return data.tracks.items;
    } catch (err) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, [spotifyFetch]);

  const getGenres = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await spotifyFetch('/recommendations/available-genre-seeds');
      return data.genres;
    } catch (err) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, [spotifyFetch]);

  const getArtistTopTracks = useCallback(async (artistId) => {
    setLoading(true);
    setError(null);
    try {
      const data = await spotifyFetch(`/artists/${artistId}/top-tracks?market=US`);
      return data.tracks;
    } catch (err) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, [spotifyFetch]);

  const getUserProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      return await spotifyFetch('/me');
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [spotifyFetch]);

  const getUserTopTracks = useCallback(async (limit = 20, timeRange = 'medium_term') => {
    setLoading(true);
    setError(null);
    try {
      const data = await spotifyFetch(`/me/top/tracks?limit=${limit}&time_range=${timeRange}`);
      return data.items;
    } catch (err) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, [spotifyFetch]);

  const getUserTopArtists = useCallback(async (limit = 20, timeRange = 'medium_term') => {
    setLoading(true);
    setError(null);
    try {
      const data = await spotifyFetch(`/me/top/artists?limit=${limit}&time_range=${timeRange}`);
      return data.items;
    } catch (err) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, [spotifyFetch]);

  const getUserPlaylists = useCallback(async (limit = 50) => {
    setLoading(true);
    setError(null);
    try {
      const data = await spotifyFetch(`/me/playlists?limit=${limit}`);
      return data.items;
    } catch (err) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, [spotifyFetch]);

  const getUserSavedAlbums = useCallback(async (limit = 20) => {
    setLoading(true);
    setError(null);
    try {
      const data = await spotifyFetch(`/me/albums?limit=${limit}`);
      return data.items.map(item => item.album);
    } catch (err) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, [spotifyFetch]);

  const getUserSavedTracks = useCallback(async (limit = 50) => {
    setLoading(true);
    setError(null);
    try {
      const data = await spotifyFetch(`/me/tracks?limit=${limit}`);
      return data.items;
    } catch (err) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, [spotifyFetch]);

  const createPlaylist = useCallback(async (name, description = '', isPublic = true) => {
    setLoading(true);
    setError(null);
    try {
      const token = getAccessToken();
      if (!token) throw new Error('No token available');

      const response = await fetch(`https://api.spotify.com/v1/me/playlists`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name,
          description,
          public: isPublic
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || 'Failed to create playlist');
      }
      return await response.json();
    } catch (err) {
      setError(err.message);
      console.error('Error creating playlist:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const addTracksToPlaylist = useCallback(async (playlistId, trackUris) => {
    setLoading(true);
    setError(null);
    try {
      const token = getAccessToken();
      if (!token) throw new Error('No token available');

      const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          uris: trackUris
        })
      });

      if (!response.ok) throw new Error('Failed to add tracks to playlist');
      return await response.json();
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const saveTrack = useCallback(async (trackId) => {
    setLoading(true);
    setError(null);
    try {
      const token = getAccessToken();
      if (!token) throw new Error('No token available');

      const response = await fetch(`https://api.spotify.com/v1/me/tracks`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ids: [trackId]
        })
      });

      if (!response.ok) throw new Error('Failed to save track');
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const removeTrack = useCallback(async (trackId) => {
    setLoading(true);
    setError(null);
    try {
      const token = getAccessToken();
      if (!token) throw new Error('No token available');

      const response = await fetch(`https://api.spotify.com/v1/me/tracks`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ids: [trackId]
        })
      });

      if (!response.ok) throw new Error('Failed to remove track');
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const checkSavedTracks = useCallback(async (trackIds) => {
    setLoading(true);
    setError(null);
    try {
      const data = await spotifyFetch(`/me/tracks/contains?ids=${trackIds.join(',')}`);
      return data;
    } catch (err) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, [spotifyFetch]);

  /**
   * Genera una playlist basada en las preferencias del usuario
   * Usa artist top tracks y búsqueda por géneros
   */
  const generatePlaylist = useCallback(async (preferences) => {
    setLoading(true);
    setError(null);

    try {
      let tracks = [];
      const seenIds = new Set();

      // Por artistas seleccionados
      if (preferences.artists && preferences.artists.length > 0) {
        for (const artist of preferences.artists) {
          const artistTracks = await getArtistTopTracks(artist.id);
          artistTracks.forEach(track => {
            if (!seenIds.has(track.id)) {
              tracks.push(track);
              seenIds.add(track.id);
            }
          });
        }
      }

      // Por canciones seleccionadas directamente
      if (preferences.tracks && preferences.tracks.length > 0) {
        preferences.tracks.forEach(track => {
          if (!seenIds.has(track.id)) {
            tracks.push(track);
            seenIds.add(track.id);
          }
        });
      }

      // Por géneros (buscar tracks populares de ese género)
      if (preferences.genres && preferences.genres.length > 0) {
        for (const genre of preferences.genres.slice(0, 3)) {
          const genreTracks = await searchTracks(`genre:${genre}`);
          genreTracks.slice(0, 10).forEach(track => {
            if (!seenIds.has(track.id)) {
              tracks.push(track);
              seenIds.add(track.id);
            }
          });
        }
      }

      // Filtrar por década si está especificado
      if (preferences.decades && preferences.decades.length > 0) {
        tracks = tracks.filter(track => {
          if (!track.album || !track.album.release_date) return false;
          const year = parseInt(track.album.release_date.substring(0, 4));
          return preferences.decades.some(decade => {
            const decadeStart = parseInt(decade);
            return year >= decadeStart && year < decadeStart + 10;
          });
        });
      }

      // Filtrar por popularidad si está especificado
      if (preferences.popularity) {
        const { min, max } = preferences.popularity;
        tracks = tracks.filter(track =>
          track.popularity >= min && track.popularity <= max
        );
      }

      // Si no hay suficientes tracks, añadir top tracks del usuario
      if (tracks.length < 20) {
        const topTracks = await getUserTopTracks(30 - tracks.length);
        topTracks.forEach(track => {
          if (!seenIds.has(track.id)) {
            tracks.push(track);
            seenIds.add(track.id);
          }
        });
      }

      // Limitar a 30 canciones
      return tracks.slice(0, 30);

    } catch (err) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, [getArtistTopTracks, searchTracks, getUserTopTracks]);

  return {
    loading,
    error,
    searchArtists,
    searchTracks,
    getGenres,
    getArtistTopTracks,
    getUserProfile,
    getUserTopTracks,
    getUserTopArtists,
    getUserPlaylists,
    getUserSavedAlbums,
    getUserSavedTracks,
    createPlaylist,
    addTracksToPlaylist,
    generatePlaylist,
    saveTrack,
    removeTrack,
    checkSavedTracks
  };
}
