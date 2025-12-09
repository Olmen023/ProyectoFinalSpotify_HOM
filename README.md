# 🎵 MusicStream - Aplicación de Música con Spotify

> Aplicación web completa para explorar, gestionar y generar playlists personalizadas usando la API de Spotify

## 📋 Tabla de Contenidos

- [Descripción General](#-descripción-general)
- [Características Principales](#-características-principales)
- [Tecnologías Utilizadas](#️-tecnologías-utilizadas)
- [Arquitectura del Proyecto](#-arquitectura-del-proyecto)
- [Estructura de Carpetas](#-estructura-de-carpetas)
- [Instalación y Configuración](#-instalación-y-configuración)
- [Guía de Uso](#-guía-de-uso)
- [Documentación de Componentes](#-documentación-de-componentes)
- [API de Spotify](#-api-de-spotify)
- [Flujos de Datos](#-flujos-de-datos)
- [Gestión de Estado](#-gestión-de-estado)
- [Hooks Personalizados](#-hooks-personalizados)
- [Contribuir](#-contribuir)

---

## 📖 Descripción General

MusicStream es una aplicación web moderna construida con **Next.js 14** y **React 19** que se integra completamente con la **Spotify Web API**. Permite a los usuarios explorar música, gestionar sus bibliotecas personales, crear playlists personalizadas basadas en preferencias musicales y reproducir previews de canciones.

La aplicación implementa un sistema de autenticación OAuth 2.0 con Spotify, gestión de estado global con Context API, y una interfaz de usuario inspirada en el diseño de Spotify con soporte para tema claro/oscuro.

### 🎯 Objetivo del Proyecto

Proporcionar una experiencia de usuario fluida y moderna para la gestión de música, con funcionalidades avanzadas de generación de playlists basadas en:
- Artistas favoritos
- Géneros musicales
- Décadas musicales
- Parámetros de audio (energía, valencia, tempo)
- Rangos de popularidad

---

## ✨ Características Principales

### 🔐 Autenticación
- ✅ Login con Spotify OAuth 2.0
- ✅ Gestión automática de tokens de acceso
- ✅ Manejo de estados de autenticación con CSRF protection
- ✅ Persistencia de sesión en localStorage

### 🎵 Exploración de Música
- ✅ Búsqueda en tiempo real con debouncing
- ✅ Búsqueda de artistas, canciones y álbumes
- ✅ Filtros por categorías (All, Tracks, Artists)
- ✅ Recomendaciones personalizadas basadas en historial

### 📚 Biblioteca Personal
- ✅ Visualización de playlists propias
- ✅ Gestión de artistas favoritos
- ✅ Álbumes guardados
- ✅ Canciones favoritas (Liked Songs)
- ✅ Filtros interactivos por tipo de contenido

### 🎨 Generación de Playlists
- ✅ **Selector de Artistas**: Búsqueda y selección de artistas
- ✅ **Selector de Géneros**: Más de 120 géneros disponibles
- ✅ **Selector de Décadas**: Desde 1960 hasta 2020
- ✅ **Control de Estado de Ánimo**: Sliders para energía, valencia, bailabilidad y acusticidad
- ✅ **Rango de Popularidad**: Control de min/max popularity
- ✅ Algoritmo avanzado usando Spotify Recommendations API
- ✅ Generación de hasta 30 canciones personalizadas
- ✅ Guardado directo en Spotify

### 🎼 Gestión de Playlists
- ✅ Creación de nuevas playlists
- ✅ Edición y eliminación de playlists
- ✅ Agregar/eliminar canciones
- ✅ **Drag & Drop** para reordenar canciones
- ✅ Compartir playlists con URL única
- ✅ Vista detallada con información completa

### 🎧 Reproductor de Audio
- ✅ Preview de 30 segundos de canciones
- ✅ Control play/pause desde cualquier componente
- ✅ Indicador visual de canción reproduciéndose
- ✅ Gestión global de estado del reproductor

### 🌙 Interfaz de Usuario
- ✅ Tema claro/oscuro con persistencia
- ✅ Diseño responsive (mobile, tablet, desktop)
- ✅ Animaciones suaves y transiciones
- ✅ Spinners de carga personalizados
- ✅ Modales y overlays
- ✅ Tooltips y feedback visual

---

## 🛠️ Tecnologías Utilizadas

### Frontend Framework
- **Next.js 16.0.7** - Framework React con SSR y App Router
- **React 19.2.1** - Biblioteca de UI
- **React DOM 19.2.1** - Renderizado de componentes

### Estilos y UI
- **Tailwind CSS 4** - Framework de utilidades CSS
- **Lucide React** - Biblioteca de iconos
- **PostCSS** - Procesador CSS

### Drag & Drop
- **@dnd-kit/core 6.3.1** - Core de drag & drop
- **@dnd-kit/sortable 10.0.0** - Componentes sortables
- **@dnd-kit/utilities 3.2.2** - Utilidades DnD

### API y Autenticación
- **Spotify Web API** - API REST de Spotify
- **OAuth 2.0** - Protocolo de autenticación

### Herramientas de Desarrollo
- **ESLint 9** - Linter para JavaScript
- **eslint-config-next** - Configuración de ESLint para Next.js

---

## 🏗 Arquitectura del Proyecto

### Patrón de Arquitectura
La aplicación sigue una arquitectura **Component-Based** con los siguientes patrones:

1. **Context API** para gestión de estado global
2. **Custom Hooks** para lógica reutilizable
3. **Client Components** (Next.js 14 App Router)
4. **Separation of Concerns** (presentación vs lógica)
5. **Atomic Design** (atoms, molecules, organisms)

### Flujo de Autenticación

```
Usuario → Login → Spotify OAuth → Callback → Token Storage → Dashboard
```

1. Usuario hace clic en "Login with Spotify"
2. Redirige a Spotify Authorization
3. Usuario autoriza la aplicación
4. Spotify redirige al callback con código
5. Se intercambia código por access token y refresh token
6. Tokens se almacenan en localStorage
7. Usuario accede al dashboard

### Flujo de Generación de Playlists

```
Preferencias → Widgets → Estado → Algoritmo → Spotify API → Playlist
```

1. Usuario selecciona preferencias (artistas, géneros, etc.)
2. Cada widget actualiza el estado global
3. Al generar, se llama al algoritmo de generación
4. Se consulta Spotify Recommendations API con múltiples combinaciones
5. Se filtran y eliminan duplicados
6. Se guardan las canciones en Spotify
7. Playlist aparece en la biblioteca del usuario

---

## 📁 Estructura de Carpetas

```
ProyectoFinalSpotify_HOM/
│
├── src/                          # Código fuente
│   │
│   ├── app/                      # App Router de Next.js
│   │   ├── dashboard/            # Página principal del dashboard
│   │   │   ├── explore/          # Página de exploración
│   │   │   │   ├── ExploreClient.jsx
│   │   │   │   └── page.jsx
│   │   │   ├── favorites/        # Página de canciones favoritas
│   │   │   │   ├── FavoritesClient.jsx
│   │   │   │   └── page.jsx
│   │   │   ├── generate-playlist/# Generador de playlists
│   │   │   │   └── page.jsx
│   │   │   ├── library/          # Biblioteca del usuario
│   │   │   │   ├── LibraryClient.jsx
│   │   │   │   └── page.jsx
│   │   │   └── page.jsx          # Dashboard home
│   │   │
│   │   ├── api/                  # API Routes
│   │   │   ├── auth/             # Autenticación OAuth
│   │   │   │   ├── callback/     # Callback de Spotify
│   │   │   │   └── login/        # Inicio de sesión
│   │   │
│   │   ├── debug/                # Página de debug
│   │   ├── login/                # Página de login
│   │   ├── shared-playlist/      # Playlists compartidas
│   │   ├── layout.js             # Layout principal
│   │   └── page.js               # Página home
│   │
│   ├── components/               # Componentes React
│   │   ├── layout/               # Componentes de layout
│   │   │   ├── Header.jsx        # Encabezado con navegación
│   │   │   ├── Sidebar.jsx       # Barra lateral de navegación
│   │   │   └── TopBar.jsx        # Barra superior con búsqueda
│   │   │
│   │   ├── modals/               # Componentes de modales
│   │   │   ├── AddToPlaylistModal.jsx      # Agregar a playlist
│   │   │   ├── PlaylistModal.jsx           # Vista de playlist
│   │   │   └── SharePlaylistModal.jsx      # Compartir playlist
│   │   │
│   │   ├── playlist/             # Componentes de playlist
│   │   │   ├── PlaylistDisplay.jsx         # Display de playlist
│   │   │   └── TrackCard.jsx               # Tarjeta de canción
│   │   │
│   │   ├── ui/                   # Componentes de UI
│   │   │   ├── AlbumCard.jsx               # Tarjeta de álbum
│   │   │   ├── Button.jsx                  # Botón reutilizable
│   │   │   ├── CreatePlaylistModal.jsx     # Modal de crear playlist
│   │   │   ├── FilterChips.jsx             # Chips de filtro
│   │   │   └── LoadingSpinner.jsx          # Spinner de carga
│   │   │
│   │   ├── widgets/              # Widgets de generación
│   │   │   ├── ArtistWidget.jsx            # Selector de artistas
│   │   │   ├── DecadeWidget.jsx            # Selector de décadas
│   │   │   ├── GenreWidget.jsx             # Selector de géneros
│   │   │   ├── MoodWidget.jsx              # Control de mood
│   │   │   ├── PopularityWidget.jsx        # Control de popularidad
│   │   │   └── TrackWidget.jsx             # Selector de tracks
│   │   │
│   │   └── LoginScreen.jsx       # Pantalla de login
│   │
│   ├── contexts/                 # React Contexts
│   │   ├── AudioPlayerContext.jsx          # Contexto del reproductor
│   │   └── ThemeContext.jsx                # Contexto del tema
│   │
│   ├── hooks/                    # Custom Hooks
│   │   ├── useAudioPlayer.jsx              # Hook del reproductor
│   │   ├── useDebounce.jsx                 # Hook de debouncing
│   │   ├── useFavorites.jsx                # Hook de favoritos
│   │   └── useSpotify.jsx                  # Hook principal de Spotify
│   │
│   └── lib/                      # Utilidades y helpers
│       ├── auth.js                         # Lógica de autenticación
│       └── spotify.js                      # Funciones de Spotify API
│
├── public/                       # Archivos estáticos
├── .env.local                    # Variables de entorno (local)
├── .gitignore                    # Archivos ignorados por Git
├── eslint.config.mjs             # Configuración de ESLint
├── jsconfig.json                 # Configuración de JavaScript
├── next.config.mjs               # Configuración de Next.js
├── package.json                  # Dependencias del proyecto
├── postcss.config.mjs            # Configuración de PostCSS
├── tailwind.config.js            # Configuración de Tailwind CSS
└── README.md                     # Este archivo
```

---

## 🚀 Instalación y Configuración

### Prerrequisitos

- Node.js 18.x o superior
- npm o yarn
- Cuenta de desarrollador de Spotify
- Credenciales de Spotify API (Client ID y Client Secret)

### Paso 1: Clonar el Repositorio

```bash
git clone https://github.com/tu-usuario/musicstream.git
cd musicstream
```

### Paso 2: Instalar Dependencias

```bash
npm install
# o
yarn install
```

### Paso 3: Configurar Spotify API

1. Ve a [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Crea una nueva aplicación
3. Copia el **Client ID** y **Client Secret**
4. Añade la Redirect URI: `http://localhost:3000/api/auth/callback`

### Paso 4: Configurar Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```env
# Spotify API Credentials
NEXT_PUBLIC_SPOTIFY_CLIENT_ID=tu_client_id_aqui
SPOTIFY_CLIENT_SECRET=tu_client_secret_aqui
NEXT_PUBLIC_REDIRECT_URI=http://localhost:3000/api/auth/callback

# Session Secret (genera uno aleatorio)
SESSION_SECRET=tu_session_secret_aleatorio_aqui
```

### Paso 5: Ejecutar la Aplicación

```bash
# Modo desarrollo
npm run dev

# Compilar para producción
npm run build

# Ejecutar en producción
npm start
```

La aplicación estará disponible en `http://localhost:3000`

### Scopes de Spotify Requeridos

La aplicación solicita los siguientes permisos:

- `user-read-private` - Leer información de perfil
- `user-read-email` - Leer email del usuario
- `user-top-read` - Leer top artistas y tracks
- `user-library-read` - Leer biblioteca guardada
- `user-library-modify` - Modificar biblioteca guardada
- `playlist-read-private` - Leer playlists privadas
- `playlist-modify-public` - Modificar playlists públicas
- `playlist-modify-private` - Modificar playlists privadas
- `user-read-recently-played` - Leer historial reciente

---

## 📖 Guía de Uso

### 1. Iniciar Sesión

1. Abre la aplicación en tu navegador
2. Haz clic en "Login with Spotify"
3. Autoriza la aplicación en Spotify
4. Serás redirigido al dashboard

### 2. Explorar Música

1. Ve a la sección "Explore" en la barra lateral
2. Usa la barra de búsqueda para encontrar artistas o canciones
3. Filtra por categoría (All, Tracks, Artists)
4. Haz clic en una canción para reproducir el preview
5. Añade canciones a playlists con el botón "+"

### 3. Generar Playlist Personalizada

1. Ve a "Generate Playlist" en la barra lateral
2. Selecciona tus preferencias:
   - **Artistas**: Busca y selecciona hasta 5 artistas
   - **Géneros**: Elige géneros musicales
   - **Décadas**: Selecciona décadas (1960-2020)
   - **Mood**: Ajusta energía, valencia, bailabilidad y acusticidad
   - **Popularidad**: Define rango de popularidad
3. Haz clic en "Generate Playlist"
4. Revisa las canciones generadas
5. Guarda la playlist en Spotify

### 4. Gestionar Biblioteca

1. Ve a "Your Library"
2. Filtra por: Playlists, Artists, Albums
3. Haz clic en una playlist para ver detalles
4. Reordena canciones con drag & drop
5. Elimina canciones con el botón "-"
6. Comparte playlists con el botón de compartir

### 5. Canciones Favoritas

1. Ve a "Liked Songs"
2. Visualiza todas tus canciones favoritas
3. Ordena por: Recientes, Título, Artista
4. Añade canciones a playlists
5. Reproduce previews de 30 segundos

---

## 📚 Documentación de Componentes

### Contexts

#### AudioPlayerContext
**Ubicación**: `src/contexts/AudioPlayerContext.jsx`

Proporciona acceso global al reproductor de audio de la aplicación.

```jsx
import { useAudioPlayerContext } from '@/contexts/AudioPlayerContext';

function MyComponent() {
  const { play, pause, currentTrack, isPlaying } = useAudioPlayerContext();

  return (
    <button onClick={() => play(track)}>
      {isPlaying && currentTrack?.id === track.id ? 'Pause' : 'Play'}
    </button>
  );
}
```

**Propiedades:**
- `currentTrack`: Track actual reproduciéndose
- `isPlaying`: Estado de reproducción
- `play(track)`: Reproduce una canción
- `pause()`: Pausa la reproducción
- `stop()`: Detiene completamente

#### ThemeContext
**Ubicación**: `src/contexts/ThemeContext.jsx`

Gestiona el tema de la aplicación (dark/light mode).

```jsx
import { useTheme } from '@/contexts/ThemeContext';

function MyComponent() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button onClick={toggleTheme}>
      {theme === 'dark' ? '🌙' : '☀️'}
    </button>
  );
}
```

**Propiedades:**
- `theme`: 'dark' | 'light'
- `toggleTheme()`: Alterna el tema

---

### Custom Hooks

#### useSpotify
**Ubicación**: `src/hooks/useSpotify.jsx`

Hook principal para interactuar con la Spotify Web API.

```jsx
import { useSpotify } from '@/hooks/useSpotify';

function MyComponent() {
  const {
    loading,
    error,
    searchTracks,
    createPlaylist,
    getUserProfile
  } = useSpotify();

  const handleSearch = async (query) => {
    const tracks = await searchTracks(query);
    console.log(tracks);
  };
}
```

**Funciones disponibles:**

**Búsqueda:**
- `searchArtists(query)` - Buscar artistas
- `searchTracks(query)` - Buscar canciones
- `getGenres()` - Obtener lista de géneros

**Usuario:**
- `getUserProfile()` - Perfil del usuario
- `getUserTopTracks(limit, timeRange)` - Top tracks
- `getUserTopArtists(limit, timeRange)` - Top artists
- `getUserPlaylists(limit)` - Playlists del usuario
- `getUserSavedAlbums(limit)` - Álbumes guardados
- `getUserSavedTracks(limit)` - Canciones guardadas

**Playlists:**
- `createPlaylist(name, description, isPublic)` - Crear playlist
- `getPlaylistDetails(playlistId)` - Detalles de playlist
- `getPlaylistTracks(playlistId)` - Tracks de playlist
- `addTracksToPlaylist(playlistId, trackUris)` - Añadir tracks
- `removeTrackFromPlaylist(playlistId, trackUri)` - Eliminar track
- `deletePlaylist(playlistId)` - Eliminar playlist

**Generación:**
- `generatePlaylist(preferences)` - Generar playlist personalizada

**Favoritos:**
- `saveTrack(trackId)` - Guardar track
- `removeTrack(trackId)` - Eliminar track
- `checkSavedTracks(trackIds)` - Verificar tracks guardados

#### useFavorites
**Ubicación**: `src/hooks/useFavorites.jsx`

Gestiona las canciones favoritas con persistencia dual (localStorage + Spotify API).

```jsx
import { useFavorites } from '@/hooks/useFavorites';

function MyComponent() {
  const {
    favorites,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite
  } = useFavorites();

  return (
    <button onClick={() => toggleFavorite(track)}>
      {isFavorite(track.id) ? '♥' : '♡'}
    </button>
  );
}
```

#### useDebounce
**Ubicación**: `src/hooks/useDebounce.jsx`

Retrasa la actualización de un valor para optimizar búsquedas.

```jsx
import { useDebounce } from '@/hooks/useDebounce';

function SearchComponent() {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    if (debouncedSearchTerm) {
      // Solo se ejecuta 500ms después de que el usuario deje de escribir
      performSearch(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm]);
}
```

#### useAudioPlayer
**Ubicación**: `src/hooks/useAudioPlayer.jsx`

Hook para gestionar el reproductor de audio (usado internamente por AudioPlayerContext).

---

### Componentes UI

#### Button
**Ubicación**: `src/components/ui/Button.jsx`

Botón reutilizable con variantes.

```jsx
<Button variant="primary" size="lg" onClick={handleClick}>
  Click me
</Button>
```

**Props:**
- `variant`: 'primary' | 'secondary' | 'danger'
- `size`: 'sm' | 'md' | 'lg'
- `disabled`: boolean
- `onClick`: Function

#### AlbumCard
**Ubicación**: `src/components/ui/AlbumCard.jsx`

Tarjeta para mostrar álbumes/playlists.

```jsx
<AlbumCard
  title="My Playlist"
  subtitle="50 songs"
  imageUrl="https://..."
  onClick={() => console.log('clicked')}
/>
```

#### LoadingSpinner
**Ubicación**: `src/components/ui/LoadingSpinner.jsx`

Spinner de carga animado.

```jsx
<LoadingSpinner size="lg" />
```

---

### Widgets de Generación

#### ArtistWidget
**Ubicación**: `src/components/widgets/ArtistWidget.jsx`

Selector de artistas con búsqueda.

```jsx
<ArtistWidget
  value={selectedArtists}
  onChange={setSelectedArtists}
  maxSelections={5}
/>
```

#### GenreWidget
**Ubicación**: `src/components/widgets/GenreWidget.jsx`

Selector de géneros musicales.

```jsx
<GenreWidget
  value={selectedGenres}
  onChange={setSelectedGenres}
/>
```

#### MoodWidget
**Ubicación**: `src/components/widgets/MoodWidget.jsx`

Control de parámetros de audio (energía, valencia, etc.).

```jsx
<MoodWidget
  value={mood}
  onChange={setMood}
/>
```

---

## 🔌 API de Spotify

### Endpoints Utilizados

#### Autenticación
- `GET /authorize` - Autorización OAuth
- `POST /api/token` - Intercambio de token

#### Usuario
- `GET /v1/me` - Perfil del usuario
- `GET /v1/me/top/tracks` - Top tracks del usuario
- `GET /v1/me/top/artists` - Top artists del usuario

#### Búsqueda
- `GET /v1/search` - Búsqueda general

#### Playlists
- `GET /v1/me/playlists` - Playlists del usuario
- `POST /v1/me/playlists` - Crear playlist
- `GET /v1/playlists/{id}` - Detalles de playlist
- `GET /v1/playlists/{id}/tracks` - Tracks de playlist
- `POST /v1/playlists/{id}/tracks` - Añadir tracks
- `DELETE /v1/playlists/{id}/tracks` - Eliminar tracks

#### Biblioteca
- `GET /v1/me/tracks` - Canciones guardadas
- `PUT /v1/me/tracks` - Guardar canciones
- `DELETE /v1/me/tracks` - Eliminar canciones guardadas

#### Recomendaciones
- `GET /v1/recommendations` - Obtener recomendaciones

### Rate Limiting

Spotify impone límites de tasa en sus APIs:
- **Standard**: 180 requests por minuto
- **Extended**: Hasta 360 requests por minuto (con aprobación)

La aplicación implementa:
- Debouncing en búsquedas (500ms)
- Caché en localStorage para datos frecuentes
- Manejo de errores 429 (Too Many Requests)

---

## 🔄 Flujos de Datos

### Flujo de Búsqueda

```
Input → Debounce (500ms) → Spotify API → Results → UI Update
```

### Flujo de Generación de Playlist

```
1. Usuario selecciona preferencias
   ↓
2. Estado se actualiza en cada widget
   ↓
3. Click en "Generate"
   ↓
4. generatePlaylist() recopila todas las preferencias
   ↓
5. Llama a Recommendations API con múltiples combinaciones
   ↓
6. Combina y deduplica resultados
   ↓
7. Filtra por preferencias adicionales
   ↓
8. Retorna hasta 30 tracks
   ↓
9. Usuario puede guardar en Spotify
```

### Flujo de Favoritos

```
Click ♥ → Actualización local (optimista) → localStorage → Spotify API
```

---

## 🎨 Gestión de Estado

### Estado Global (Context API)

**AudioPlayerContext:**
- `currentTrack`: Track actual
- `isPlaying`: Estado de reproducción

**ThemeContext:**
- `theme`: 'dark' | 'light'

### Estado Local (useState)

Cada componente maneja su propio estado local:
- Formularios: valores de inputs
- Modales: estado de apertura/cierre
- Listas: items mostrados

### Persistencia

**localStorage:**
- `spotify_access_token` - Token de acceso
- `spotify_refresh_token` - Token de refresco
- `spotify_token_expiry` - Tiempo de expiración
- `theme` - Tema seleccionado
- `favorite_tracks` - Canciones favoritas

---

## 🪝 Hooks Personalizados

### useSpotify()
Hook principal para todas las operaciones con Spotify API.

**Estados:**
- `loading`: boolean
- `error`: string | null

**20+ funciones** para interactuar con diferentes endpoints.

### useFavorites()
Gestión de favoritos con persistencia dual.

**Estados:**
- `favorites`: Array de tracks

**Funciones:**
- `addFavorite(track)`
- `removeFavorite(trackId)`
- `toggleFavorite(track)`
- `isFavorite(trackId)`

### useDebounce(value, delay)
Optimización de búsquedas y inputs.

**Retorna:** Valor debounced

### useAudioPlayer()
Lógica del reproductor de audio.

**Estados:**
- `currentTrack`: Track actual
- `isPlaying`: boolean

**Funciones:**
- `play(track)`
- `pause()`
- `stop()`

---

## 🤝 Contribuir

### Cómo Contribuir

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

### Guía de Estilo

- Usa ESLint para mantener el código limpio
- Sigue las convenciones de React y Next.js
- Añade comentarios detallados en español
- Documenta nuevos componentes y hooks

### Reportar Bugs

Abre un issue en GitHub con:
- Descripción del bug
- Pasos para reproducir
- Comportamiento esperado vs actual
- Screenshots si aplica

---

## 📄 Licencia

Este proyecto está bajo la licencia MIT. Ver archivo `LICENSE` para más detalles.

---

## 👨‍💻 Autor

**Hugo Olza**
- GitHub: [@Olmen023](https://github.com/Olmen023)

---

## 🙏 Agradecimientos

- [Spotify Web API](https://developer.spotify.com/documentation/web-api) - Por proporcionar una API completa
- [Next.js](https://nextjs.org) - Framework increíble
- [Tailwind CSS](https://tailwindcss.com) - Sistema de diseño utility-first
- [Lucide Icons](https://lucide.dev) - Iconos hermosos
- [dnd-kit](https://dndkit.com) - Librería de drag & drop

---

## 📞 Soporte

Si tienes preguntas o necesitas ayuda:
- Abre un issue en GitHub
- Consulta la [documentación de Spotify](https://developer.spotify.com/documentation/web-api)

---

**⭐ Si te gusta este proyecto, dale una estrella en GitHub!**
