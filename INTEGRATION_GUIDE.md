# 🎵 MusicStream - Guía de Integración

## ✅ Archivos Creados

Se han creado todos los componentes, hooks y páginas necesarios para el proyecto MusicStream. **No se ha modificado ningún archivo existente**.

### Estructura de Archivos Nuevos:

```
src/
├── hooks/
│   ├── useSpotify.js          ✅ Hook para Spotify API
│   ├── useFavorites.js        ✅ Hook para favoritos (localStorage)
│   └── useDebounce.js         ✅ Hook para debouncing
├── components/
│   ├── layout/
│   │   ├── Sidebar.jsx        ✅ Barra lateral de navegación
│   │   ├── TopBar.jsx         ✅ Barra superior con búsqueda
│   │   └── Header.jsx         ✅ Header con navegación
│   ├── widgets/
│   │   ├── ArtistWidget.jsx   ✅ Widget de artistas
│   │   ├── TrackWidget.jsx    ✅ Widget de canciones
│   │   ├── GenreWidget.jsx    ✅ Widget de géneros
│   │   ├── DecadeWidget.jsx   ✅ Widget de décadas
│   │   ├── MoodWidget.jsx     ✅ Widget de mood/energía
│   │   └── PopularityWidget.jsx ✅ Widget de popularidad
│   ├── playlist/
│   │   ├── TrackCard.jsx      ✅ Tarjeta de canción
│   │   └── PlaylistDisplay.jsx ✅ Visualización de playlist
│   ├── ui/
│   │   ├── Button.jsx         ✅ Botón reutilizable
│   │   ├── LoadingSpinner.jsx ✅ Spinner de carga
│   │   ├── AlbumCard.jsx      ✅ Tarjeta de álbum
│   │   └── FilterChips.jsx    ✅ Chips de filtro
│   └── LoginScreen.jsx        ✅ Pantalla de login
└── app/
    └── dashboard/
        └── page.js            ✅ Dashboard principal
```

---

## 🔧 Pasos de Integración

### 1. Añadir Estilos al globals.css

Añade estas clases al archivo `src/app/globals.css`:

```css
/* Ocultar scrollbar pero mantener funcionalidad */
.no-scrollbar::-webkit-scrollbar {
  display: none;
}

.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* Estilo personalizado de scrollbar */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #121212;
}

::-webkit-scrollbar-thumb {
  background: #2a2a2a;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #333;
}
```

### 2. Integrar LoginScreen en src/app/page.js

Reemplaza el contenido de `src/app/page.js` con:

```jsx
import LoginScreen from '@/components/LoginScreen';

export default function Home() {
  return <LoginScreen />;
}
```

### 3. Verificar Variables de Entorno

Asegúrate de tener estas variables en tu `.env.local`:

```env
NEXT_PUBLIC_SPOTIFY_CLIENT_ID=tu_client_id
NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET=tu_client_secret
NEXT_PUBLIC_SPOTIFY_REDIRECT_URI=http://localhost:3000/auth/callback
```

### 4. Instalar Dependencias (si no están instaladas)

```bash
npm install lucide-react
```

---

## 🎯 Funcionalidades Implementadas

### ✅ Obligatorias

- [x] Dashboard con diseño según especificaciones
- [x] 6 widgets funcionales:
  - ArtistWidget (búsqueda + selección max 5)
  - TrackWidget (búsqueda + selección múltiple)
  - GenreWidget (búsqueda + selección max 5)
  - DecadeWidget (1950s - 2020s)
  - MoodWidget (sliders + presets)
  - PopularityWidget (rangos + custom)
- [x] Generación de playlist basada en preferencias
- [x] Eliminar tracks individuales
- [x] Sistema de favoritos con localStorage ⭐
- [x] Botón refrescar playlist
- [x] Botón añadir más canciones
- [x] Diseño responsive (mobile, tablet, desktop)
- [x] Estados de carga (LoadingSpinner)
- [x] Interfaz según mockups (colores exactos)

### 🎨 Detalles de Diseño

Todos los colores y estilos siguen las especificaciones exactas:

- **Fondo Global**: `bg-black` (#000000)
- **Sidebar**: `bg-[#121212]`
- **Tarjetas**: `bg-[#181818]`
- **Inputs**: `bg-[#2a2a2a]`
- **Acento**: `bg-blue-600`
- **Texto Principal**: `text-white`
- **Texto Secundario**: `text-gray-400`

---

## 🚀 Cómo Usar la Aplicación

### 1. Login
- Ir a `http://localhost:3000`
- Click en "Continue with Spotify"
- Autenticarse con Spotify OAuth

### 2. Dashboard
- Seleccionar preferencias en los widgets:
  - **Artistas**: Buscar y seleccionar hasta 5 artistas
  - **Canciones**: Buscar y añadir canciones específicas
  - **Géneros**: Seleccionar hasta 5 géneros
  - **Décadas**: Filtrar por años (1950s-2020s)
  - **Mood**: Ajustar energía, felicidad y bailabilidad
  - **Popularidad**: Mainstream, Popular o Underground

### 3. Generar Playlist
- Click en "Generate Playlist"
- Esperar a que se genere (basado en tus preferencias)
- Ver resultado en la sección "Your Generated Playlist"

### 4. Gestionar Playlist
- **Eliminar canción**: Hover sobre canción → click en X
- **Marcar favorito**: Click en corazón (guarda en localStorage)
- **Refrescar**: Regenera playlist con mismas preferencias
- **Añadir más**: Añade canciones adicionales sin perder las actuales

---

## 🔍 Notas Técnicas

### API de Spotify

El proyecto **NO usa el endpoint deprecado `/recommendations`**.

En su lugar usa:
- `GET /search?type=artist` - Búsqueda de artistas
- `GET /search?type=track` - Búsqueda de canciones
- `GET /artists/{id}/top-tracks` - Top tracks de artista
- `GET /me/top/tracks` - Top tracks del usuario
- `GET /recommendations/available-genre-seeds` - Lista de géneros

### Generación de Playlist

La lógica en `useSpotify.js → generatePlaylist()`:

1. Obtiene top tracks de artistas seleccionados
2. Añade canciones seleccionadas directamente
3. Busca tracks de géneros seleccionados
4. Filtra por década (release_date)
5. Filtra por popularidad (min/max)
6. Completa con top tracks del usuario si es necesario
7. Limita a 30 canciones

### Persistencia

- **Favoritos**: Se guardan en `localStorage` con clave `favorite_tracks`
- **Token**: Se maneja mediante `lib/auth.js` (existente)
- **Usuario**: Se carga del endpoint `/me` de Spotify

---

## 📱 Responsive Breakpoints

- **Mobile**: `< 768px` - Sidebar oculta, diseño vertical
- **Tablet**: `768px - 1024px` - Sidebar visible, grid 2 columnas
- **Desktop**: `> 1024px` - Layout completo, grid 2-4 columnas

---

## 🐛 Troubleshooting

### "No token available"
- Verificar autenticación en `/api/spotify-token`
- Revisar variables de entorno
- Token expira en 1 hora, implementar refresh

### "No artists found"
- Verificar conexión a internet
- Revisar permisos de Spotify App
- Token debe tener scope `user-read-private`

### Estilos no se aplican
- Verificar que Tailwind está configurado
- Añadir estilos personalizados a `globals.css`
- Limpiar cache: `npm run dev` (restart)

---

## 🎓 Próximos Pasos (Opcional)

Para mejorar la aplicación:

1. **Guardar en Spotify**: Implementar `POST /users/{id}/playlists`
2. **Preview Audio**: Usar `track.preview_url` para reproducir 30s
3. **Drag & Drop**: Reordenar canciones en playlist
4. **Historial**: Guardar playlists generadas
5. **Compartir**: Generar link compartible

---

## ✅ Checklist Final

Antes de entregar, verificar:

- [ ] Todos los archivos creados están en sus carpetas
- [ ] LoginScreen integrado en `page.js`
- [ ] Estilos añadidos a `globals.css`
- [ ] Variables de entorno configuradas
- [ ] `npm run dev` funciona sin errores
- [ ] Login con Spotify funcional
- [ ] Dashboard carga correctamente
- [ ] Widgets funcionan (búsqueda, selección)
- [ ] Playlist se genera correctamente
- [ ] Favoritos persisten en localStorage
- [ ] Responsive en mobile/tablet/desktop

---

¡Proyecto MusicStream completado! 🎉🎵

Para cualquier duda, revisar el código de los componentes - todos están documentados con comentarios.
