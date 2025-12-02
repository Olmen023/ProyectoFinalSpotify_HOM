# 🚀 MusicStream - Quick Start Guide

## Inicio Rápido en 5 Pasos

### 1️⃣ Integrar LoginScreen

Edita `src/app/page.js`:

```jsx
import LoginScreen from '@/components/LoginScreen';

export default function Home() {
  return <LoginScreen />;
}
```

---

### 2️⃣ Añadir Estilos Personalizados

**Opción A:** Añade al final de `src/app/globals.css`:

```css
/* Scrollbar personalizada */
::-webkit-scrollbar { width: 8px; height: 8px; }
::-webkit-scrollbar-track { background: #121212; }
::-webkit-scrollbar-thumb { background: #2a2a2a; border-radius: 4px; }
::-webkit-scrollbar-thumb:hover { background: #333; }

/* Ocultar scrollbar en elementos con clase no-scrollbar */
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
```

**Opción B:** Importa el archivo CSS personalizado en `src/app/layout.js`:

```jsx
import '../styles/custom.css';
```

---

### 3️⃣ Verificar Variables de Entorno

Crea/edita `.env.local`:

```env
NEXT_PUBLIC_SPOTIFY_CLIENT_ID=tu_client_id
NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET=tu_client_secret
NEXT_PUBLIC_SPOTIFY_REDIRECT_URI=http://localhost:3000/auth/callback
```

---

### 4️⃣ Instalar Lucide React (si no está)

```bash
npm install lucide-react
```

---

### 5️⃣ Ejecutar el Proyecto

```bash
npm run dev
```

Visita: `http://localhost:3000`

---

## 📋 Rutas Disponibles

| Ruta | Descripción |
|------|-------------|
| `/` | Pantalla de login |
| `/dashboard` | Dashboard principal con widgets |
| `/auth/callback` | Callback de Spotify OAuth |
| `/api/spotify-token` | Endpoint de autenticación |

---

## 🎯 Flujo de Usuario

1. **Login**: Usuario hace click en "Continue with Spotify"
2. **OAuth**: Autenticación con Spotify
3. **Dashboard**: Redirigido a dashboard
4. **Widgets**: Configura preferencias (artistas, géneros, etc.)
5. **Generate**: Click en "Generate Playlist"
6. **Playlist**: Ve y gestiona playlist generada
7. **Actions**: Eliminar tracks, marcar favoritos, refrescar

---

## 🔍 Testing Checklist

Prueba estas funcionalidades:

### Login
- [ ] Pantalla de login se ve correctamente
- [ ] Botón "Continue with Spotify" funciona
- [ ] Redirección a Spotify OAuth

### Dashboard
- [ ] Dashboard carga sin errores
- [ ] Sidebar se ve correctamente
- [ ] TopBar con buscador visible
- [ ] Nombre de usuario aparece

### Widgets
- [ ] ArtistWidget: búsqueda funciona
- [ ] TrackWidget: búsqueda funciona
- [ ] GenreWidget: lista de géneros carga
- [ ] DecadeWidget: selección funciona
- [ ] MoodWidget: sliders funcionan
- [ ] PopularityWidget: rangos funcionan

### Playlist
- [ ] "Generate Playlist" crea playlist
- [ ] Canciones se muestran correctamente
- [ ] Botón eliminar funciona
- [ ] Favoritos persisten (recargar página)
- [ ] Refrescar genera nueva playlist
- [ ] Añadir más añade canciones

### Responsive
- [ ] Mobile: sidebar oculta
- [ ] Tablet: layout adaptado
- [ ] Desktop: todo visible

---

## 🐛 Problemas Comunes

### Error: "No token available"
**Solución:** Asegúrate de estar autenticado. Ve a `/` y haz login con Spotify.

### Error: "Module not found: lucide-react"
**Solución:**
```bash
npm install lucide-react
```

### Estilos no se aplican
**Solución:**
1. Limpia cache: elimina `.next/` folder
2. Reinicia servidor: `npm run dev`
3. Verifica que Tailwind está configurado en `tailwind.config.js`

### API errors (401, 403)
**Solución:**
1. Verifica variables de entorno
2. Revisa credenciales de Spotify App
3. Token expira en 1h, vuelve a hacer login

### Widgets no cargan datos
**Solución:**
1. Verifica conexión a internet
2. Revisa console para errores
3. Verifica que el token es válido

---

## 📚 Documentación Adicional

- **INTEGRATION_GUIDE.md** - Guía completa de integración
- **FEATURES.md** - Lista detallada de funcionalidades
- Componentes con JSDoc en el código

---

## 🎨 Personalización

### Cambiar colores

Edita variables en Tailwind o usa clases directamente:

```jsx
// Cambiar color de acento de azul a verde
bg-blue-600 → bg-green-600
text-blue-500 → text-green-500
```

### Ajustar límites de selección

```jsx
// En ArtistWidget.jsx
const MAX_ARTISTS = 5; // Cambiar a 10, 20, etc.

// En GenreWidget.jsx
const MAX_GENRES = 5; // Cambiar según necesidad
```

### Modificar algoritmo de playlist

Edita `src/hooks/useSpotify.js` → función `generatePlaylist()`:

```javascript
// Cambiar límite de canciones
return tracks.slice(0, 30); // Cambiar 30 a 50, 100, etc.

// Ajustar pesos de fuentes
// Más tracks de artistas vs géneros
```

---

## 🚀 Próximos Pasos

1. ✅ Testea todas las funcionalidades
2. ✅ Verifica diseño responsive
3. ✅ Prueba con cuenta real de Spotify
4. 🎯 (Opcional) Implementa guardar en Spotify
5. 🎯 (Opcional) Añade preview de audio
6. 🎯 (Opcional) Implementa drag & drop

---

## 📞 Soporte

Si encuentras problemas:

1. Revisa console del navegador (F12)
2. Revisa terminal del servidor
3. Verifica que todos los archivos están en su lugar
4. Compara con INTEGRATION_GUIDE.md

---

¡Disfruta de MusicStream! 🎵✨
