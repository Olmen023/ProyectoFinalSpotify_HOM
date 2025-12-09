/**
 * HOOK: USE SPOTIFY - INTERFAZ COMPLETA CON SPOTIFY WEB API
 * ===========================================================
 * Hook principal y más completo para interactuar con la Spotify Web API.
 * Proporciona métodos para búsqueda, obtención de datos del usuario, gestión de playlists,
 * generación de recomendaciones y gestión de favoritos.
 *
 * FUNCIONALIDADES PRINCIPALES:
 * 1. BÚSQUEDA: Artistas, canciones, géneros
 * 2. PERFIL DE USUARIO: Datos personales, top tracks, top artists
 * 3. BIBLIOTECA: Playlists, álbumes guardados, canciones favoritas
 * 4. GESTIÓN DE PLAYLISTS: Crear, eliminar, agregar/quitar canciones, reordenar
 * 5. GENERACIÓN: Crear playlists basadas en preferencias (Recommendations API)
 * 6. FAVORITOS: Guardar y eliminar canciones favoritas
 *
 * ARQUITECTURA:
 * - Estado global: loading (boolean), error (string|null)
 * - Función central: spotifyFetch() - wrapper para todas las llamadas a la API
 * - Funciones especializadas: Una para cada endpoint o grupo de endpoints
 * - Memoización: Usa useCallback para optimizar rendimiento
 *
 * MANEJO DE ERRORES:
 * - 401 (Unauthorized): Token expirado, requiere re-login
 * - 403 (Forbidden): Permisos insuficientes
 * - Otros: Error genérico con código de estado
 *
 * UTILIZADO EN:
 * - src/app/dashboard/explore/ExploreClient.jsx (explorar música)
 * - src/app/dashboard/library/LibraryClient.jsx (biblioteca del usuario)
 * - src/app/dashboard/generate-playlist/page.jsx (generar playlists)
 * - src/components/widgets/*.jsx (todos los widgets de búsqueda)
 * - src/components/modals/*.jsx (modales de playlist)
 *
 * REFERENCIAS:
 * - Importa getAccessToken desde @/lib/auth (src/lib/auth.js)
 *
 * ENDPOINTS DE SPOTIFY UTILIZADOS:
 * - /search (búsqueda de artistas, tracks)
 * - /me/* (perfil, top tracks/artists, playlists, saved tracks/albums)
 * - /playlists/* (detalles, tracks, crear, modificar, eliminar)
 * - /recommendations (generar recomendaciones personalizadas)
 * - /tracks (obtener múltiples tracks por IDs, guardar/eliminar favoritos)
 * - /artists/* (top tracks de un artista)
 *
 * DEPENDENCIAS DE REACT:
 * - useState: Estados de loading y error
 * - useCallback: Memoización de todas las funciones
 */

'use client';

import { useState, useCallback } from 'react';
import { getAccessToken } from '@/lib/auth';

/**
 * useSpotify - Hook principal para interactuar con Spotify Web API
 *
 * ESTADO INTERNO:
 * - loading: boolean - Indica si hay una operación en curso
 * - error: string|null - Mensaje de error de la última operación fallida
 *
 * FUNCIONES RETORNADAS:
 * Ver documentación individual de cada función más abajo.
 * Total: 20+ funciones para diferentes operaciones de Spotify.
 *
 * @returns {Object} - Objeto con propiedades:
 *   - loading: boolean
 *   - error: string|null
 *   - searchArtists(query): Promise<Array> - Buscar artistas
 *   - searchTracks(query): Promise<Array> - Buscar canciones
 *   - getGenres(): Promise<Array> - Obtener lista de géneros
 *   - getUserProfile(): Promise<Object> - Datos del perfil de usuario
 *   - getUserTopTracks(limit, timeRange): Promise<Array>
 *   - getUserTopArtists(limit, timeRange): Promise<Array>
 *   - getUserPlaylists(limit): Promise<Array>
 *   - getUserSavedAlbums(limit): Promise<Array>
 *   - getUserSavedTracks(limit): Promise<Array>
 *   - getPlaylistTracks(playlistId): Promise<Array>
 *   - getPlaylistDetails(playlistId): Promise<Object>
 *   - createPlaylist(name, description, isPublic): Promise<Object>
 *   - addTracksToPlaylist(playlistId, trackUris): Promise<Object>
 *   - removeTrackFromPlaylist(playlistId, trackUri): Promise<Object>
 *   - deletePlaylist(playlistId): Promise<boolean>
 *   - generatePlaylist(preferences): Promise<Array>
 *   - saveTrack(trackId): Promise<boolean>
 *   - removeTrack(trackId): Promise<boolean>
 *   - checkSavedTracks(trackIds): Promise<Array<boolean>>
 *   - getTracksByIds(trackIds): Promise<Array>
 */
export function useSpotify() {
  // ESTADO: Loading indica si hay una operación en curso
  const [loading, setLoading] = useState(false);
  // ESTADO: Error guarda el mensaje de error de la última operación fallida
  const [error, setError] = useState(null);

  /**
   * spotifyFetch - Función wrapper centralizada para todas las llamadas a Spotify API
   *
   * PROPÓSITO:
   * Centraliza la lógica de autenticación y manejo de errores para todas
   * las llamadas a la API de Spotify. Todas las demás funciones usan esta.
   *
   * FLUJO:
   * 1. Obtiene el token de acceso
   * 2. Hace fetch a la API de Spotify con el token en headers
   * 3. Maneja errores comunes (401, 403, otros)
   * 4. Retorna los datos parseados como JSON
   *
   * MANEJO DE ERRORES:
   * - 401: Token expirado, requiere nuevo login
   * - 403: Permisos insuficientes (scopes faltantes)
   * - Otros: Error genérico con código de estado
   *
   * @param {string} endpoint - Endpoint de la API (sin el prefijo /v1, ej: '/me/playlists')
   * @returns {Promise<Object>} - Datos JSON de la respuesta
   * @throws {Error} - Si no hay token, si la API devuelve error, o problemas de red
   */
  const spotifyFetch = useCallback(async (endpoint) => {
    const token = getAccessToken();
    if (!token) throw new Error('No token available');

    const response = await fetch(`https://api.spotify.com/v1${endpoint}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!response.ok) {
      if (response.status === 401) {
        // Token expirado - el usuario necesita volver a hacer login
        throw new Error('Token expired. Please login again.');
      }
      if (response.status === 403) {
        // Permisos insuficientes - faltan scopes en la autenticación
        throw new Error('Permission denied. Please re-authenticate with required permissions.');
      }
      // Otro tipo de error de API
      throw new Error(`API Error: ${response.status}`);
    }

    return response.json();
  }, []);

  /**
   * searchArtists - Busca artistas en Spotify por término de búsqueda
   *
   * ENDPOINT: GET /search?type=artist&q={query}&limit=10
   *
   * @param {string} query - Término de búsqueda (nombre del artista)
   * @returns {Promise<Array>} - Array de hasta 10 objetos artista con propiedades:
   *   - id: string - ID del artista
   *   - name: string - Nombre del artista
   *   - images: Array - Imágenes del artista
   *   - genres: Array - Géneros del artista
   *   - popularity: number - Popularidad (0-100)
   *
   * UTILIZADO EN: src/components/widgets/ArtistWidget.jsx
   */
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

  /**
   * searchTracks - Busca canciones en Spotify por término de búsqueda
   *
   * ENDPOINT: GET /search?type=track&q={query}&limit=20
   *
   * @param {string} query - Término de búsqueda (nombre de canción, artista, etc.)
   * @returns {Promise<Array>} - Array de hasta 20 objetos track
   *
   * UTILIZADO EN: src/components/widgets/TrackWidget.jsx
   */
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

  /**
   * getGenres - Obtiene la lista de géneros disponibles para recomendaciones
   *
   * IMPLEMENTACIÓN:
   * Usa una lista hardcodeada en lugar del endpoint de Spotify porque
   * /recommendations/available-genre-seeds devuelve 404 inconsistentemente.
   * La lista incluye todos los géneros válidos para el Recommendations API.
   *
   * NOTA: Esta lista es oficial de Spotify y raramente cambia.
   *
   * @returns {Promise<Array<string>>} - Array de strings con nombres de géneros
   *
   * UTILIZADO EN: src/components/widgets/GenreWidget.jsx
   */
  const getGenres = useCallback(async () => {
    // Usar lista hardcodeada de géneros populares en lugar del endpoint problemático
    // El endpoint /recommendations/available-genre-seeds devuelve 404 inconsistentemente
    const popularGenres = [
      'acoustic', 'afrobeat', 'alt-rock', 'alternative', 'ambient',
      'anime', 'black-metal', 'bluegrass', 'blues', 'bossanova',
      'brazil', 'breakbeat', 'british', 'cantopop', 'chicago-house',
      'children', 'chill', 'classical', 'club', 'comedy',
      'country', 'dance', 'dancehall', 'death-metal', 'deep-house',
      'detroit-techno', 'disco', 'disney', 'drum-and-bass', 'dub',
      'dubstep', 'edm', 'electro', 'electronic', 'emo',
      'folk', 'forro', 'french', 'funk', 'garage',
      'german', 'gospel', 'goth', 'grindcore', 'groove',
      'grunge', 'guitar', 'happy', 'hard-rock', 'hardcore',
      'hardstyle', 'heavy-metal', 'hip-hop', 'holidays', 'honky-tonk',
      'house', 'idm', 'indian', 'indie', 'indie-pop',
      'industrial', 'iranian', 'j-dance', 'j-idol', 'j-pop',
      'j-rock', 'jazz', 'k-pop', 'kids', 'latin',
      'latino', 'malay', 'mandopop', 'metal', 'metal-misc',
      'metalcore', 'minimal-techno', 'movies', 'mpb', 'new-age',
      'new-release', 'opera', 'pagode', 'party', 'philippines-opm',
      'piano', 'pop', 'pop-film', 'post-dubstep', 'power-pop',
      'progressive-house', 'psych-rock', 'punk', 'punk-rock', 'r-n-b',
      'rainy-day', 'reggae', 'reggaeton', 'road-trip', 'rock',
      'rock-n-roll', 'rockabilly', 'romance', 'sad', 'salsa',
      'samba', 'sertanejo', 'show-tunes', 'singer-songwriter', 'ska',
      'sleep', 'songwriter', 'soul', 'soundtracks', 'spanish',
      'study', 'summer', 'swedish', 'synth-pop', 'tango',
      'techno', 'trance', 'trip-hop', 'turkish', 'work-out',
      'world-music'
    ];

    return new Promise((resolve) => {
      // Simular pequeño delay para mantener consistencia con otras llamadas API
      setTimeout(() => resolve(popularGenres), 100);
    });
  }, []);

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
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getPlaylistTracks = useCallback(async (playlistId) => {
    setLoading(true);
    setError(null);
    try {
      const data = await spotifyFetch(`/playlists/${playlistId}/tracks`);
      return data.items || [];
    } catch (err) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, [spotifyFetch]);

  const getPlaylistDetails = useCallback(async (playlistId) => {
    setLoading(true);
    setError(null);
    try {
      const data = await spotifyFetch(`/playlists/${playlistId}`);
      return data;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [spotifyFetch]);

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

  const removeTrackFromPlaylist = useCallback(async (playlistId, trackUri) => {
    setLoading(true);
    setError(null);
    try {
      const token = getAccessToken();
      if (!token) throw new Error('No token available');

      const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          tracks: [{ uri: trackUri }]
        })
      });

      if (!response.ok) throw new Error('Failed to remove track from playlist');
      return await response.json();
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const deletePlaylist = useCallback(async (playlistId) => {
    setLoading(true);
    setError(null);
    try {
      const token = getAccessToken();
      if (!token) throw new Error('No token available');

      const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/followers`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Failed to delete playlist');
      return true;
    } catch (err) {
      setError(err.message);
      return false;
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

  const getTracksByIds = useCallback(async (trackIds) => {
    setLoading(true);
    setError(null);
    try {
      // Spotify API limita a 50 tracks por llamada
      const chunkSize = 50;
      const chunks = [];

      for (let i = 0; i < trackIds.length; i += chunkSize) {
        chunks.push(trackIds.slice(i, i + chunkSize));
      }

      const results = await Promise.all(
        chunks.map(chunk =>
          spotifyFetch(`/tracks?ids=${chunk.join(',')}`)
        )
      );

      // Combinar todos los resultados
      const allTracks = results.flatMap(result => result.tracks || []);

      // Filtrar tracks null o undefined
      return allTracks.filter(track => track !== null && track !== undefined);
    } catch (err) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, [spotifyFetch]);

  /**
   * Función auxiliar para mezclar aleatoriamente un array (Fisher-Yates shuffle)
   */
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  /**
   * Genera una playlist basada en las preferencias del usuario
   * Usa el Recommendations API de Spotify para mayor variedad
   */
  const generatePlaylist = useCallback(async (preferences) => {
    setLoading(true);
    setError(null);

    try {
      let tracks = [];
      const seenIds = new Set();

      // Construir seeds para el Recommendations API
      const seedArtists = (preferences.artists || []).slice(0, 2).map(a => a.id);
      const seedTracks = (preferences.tracks || []).slice(0, 2).map(t => t.id);
      const seedGenres = (preferences.genres || []).slice(0, 2);

      // Construir parámetros de audio features desde mood
      const audioParams = {};
      if (preferences.mood) {
        if (preferences.mood.energy !== undefined) {
          audioParams.target_energy = preferences.mood.energy / 100;
        }
        if (preferences.mood.valence !== undefined) {
          audioParams.target_valence = preferences.mood.valence / 100;
        }
        if (preferences.mood.danceability !== undefined) {
          audioParams.target_danceability = preferences.mood.danceability / 100;
        }
        if (preferences.mood.acousticness !== undefined) {
          audioParams.target_acousticness = preferences.mood.acousticness / 100;
        }
      }

      // Añadir filtros de popularidad
      if (preferences.popularity) {
        const { min, max } = preferences.popularity;
        if (min > 0) audioParams.min_popularity = min;
        if (max < 100) audioParams.max_popularity = max;
      }

      // Calcular rango de años para decades
      if (preferences.decades && preferences.decades.length > 0) {
        const years = preferences.decades.map(d => parseInt(d));
        const minYear = Math.min(...years);
        const maxYear = Math.max(...years) + 9;
        const currentYear = new Date().getFullYear();

        // Convertir a timestamp unix (en segundos)
        const minDate = new Date(minYear, 0, 1);
        const maxDate = new Date(Math.min(maxYear, currentYear), 11, 31);

        audioParams.min_release_date = minDate.toISOString().split('T')[0];
        audioParams.max_release_date = maxDate.toISOString().split('T')[0];
      }

      // Función para hacer llamada al Recommendations API
      const getRecommendations = async (artists, genres, trackIds, limit = 20) => {
        const params = new URLSearchParams();

        if (artists.length > 0) params.append('seed_artists', artists.join(','));
        if (genres.length > 0) params.append('seed_genres', genres.join(','));
        if (trackIds.length > 0) params.append('seed_tracks', trackIds.join(','));

        params.append('limit', limit);

        // Añadir parámetros de audio
        Object.keys(audioParams).forEach(key => {
          params.append(key, audioParams[key]);
        });

        try {
          const data = await spotifyFetch(`/recommendations?${params.toString()}`);
          return data.tracks || [];
        } catch (err) {
          return [];
        }
      };

      // Estrategia 1: Usar seeds del usuario
      const totalSeeds = seedArtists.length + seedGenres.length + seedTracks.length;

      if (totalSeeds > 0) {
        // Hacer múltiples llamadas con diferentes combinaciones para más variedad
        const calls = [];

        // Llamada 1: Con todos los seeds disponibles (máximo 5)
        const allSeeds = {
          artists: seedArtists.slice(0, 2),
          genres: seedGenres.slice(0, 2),
          tracks: seedTracks.slice(0, 1)
        };
        calls.push(getRecommendations(allSeeds.artists, allSeeds.genres, allSeeds.tracks, 20));

        // Llamada 2: Solo artistas y géneros (si hay)
        if (seedArtists.length > 0 || seedGenres.length > 0) {
          calls.push(getRecommendations(
            seedArtists.slice(0, 3),
            seedGenres.slice(0, 2),
            [],
            15
          ));
        }

        // Llamada 3: Diferentes combinaciones de seeds para más variedad
        if (seedGenres.length > 2) {
          // Usar géneros diferentes
          calls.push(getRecommendations(
            seedArtists.slice(0, 2),
            seedGenres.slice(2, 4),
            [],
            15
          ));
        }

        // Esperar todas las llamadas
        const results = await Promise.all(calls);

        // Combinar resultados
        results.forEach(trackList => {
          trackList.forEach(track => {
            if (!seenIds.has(track.id)) {
              tracks.push(track);
              seenIds.add(track.id);
            }
          });
        });
      }

      // Estrategia 2: Si no hay suficientes seeds, usar géneros populares
      if (totalSeeds === 0 || tracks.length < 15) {
        // Usar géneros variados para obtener diferentes resultados
        const defaultGenres = ['pop', 'rock', 'indie', 'electronic', 'hip-hop', 'jazz', 'classical'];
        const randomGenres = shuffleArray(defaultGenres).slice(0, 3);

        const defaultRecs = await getRecommendations([], randomGenres, [], 20);
        defaultRecs.forEach(track => {
          if (!seenIds.has(track.id)) {
            tracks.push(track);
            seenIds.add(track.id);
          }
        });
      }

      // Estrategia 3: Si aún no hay suficientes, añadir algunas top tracks pero mezcladas
      if (tracks.length < 10) {
        const topTracks = await getUserTopTracks(15);

        // Tomar solo algunas aleatoriamente para evitar repetición
        const randomTopTracks = shuffleArray(topTracks).slice(0, 10);
        randomTopTracks.forEach(track => {
          if (!seenIds.has(track.id)) {
            tracks.push(track);
            seenIds.add(track.id);
          }
        });
      }

      // Mezclar aleatoriamente las canciones para variedad
      tracks = shuffleArray(tracks);

      // Limitar a 30 canciones
      return tracks.slice(0, 30);

    } catch (err) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, [spotifyFetch, getUserTopTracks]);

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
    getPlaylistTracks,
    getPlaylistDetails,
    createPlaylist,
    addTracksToPlaylist,
    removeTrackFromPlaylist,
    deletePlaylist,
    generatePlaylist,
    saveTrack,
    removeTrack,
    checkSavedTracks,
    getTracksByIds
  };
}
