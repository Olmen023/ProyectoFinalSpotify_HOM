# 🔐 Guía de Login - MusicStream

## 📋 Resumen

MusicStream ahora incluye una **página de login pixel-perfect** que sigue las especificaciones de diseño exactas con Tailwind CSS.

---

## 🎨 Especificaciones de Diseño Implementadas

### Colores (Tailwind)
- **Fondo Global**: `bg-black` (#000000)
- **Inputs**: `bg-[#2a2a2a]` (gris medio)
- **Acento Principal**: `bg-blue-600` (azul vibrante)
- **Texto Principal**: `text-white`
- **Texto Secundario**: `text-gray-400`
- **Placeholders**: `text-gray-500`

### Componentes UI
- **Inputs**: `rounded-lg` con `focus:ring-2 focus:ring-blue-600`
- **Botones primarios**: `rounded-full` con shadows
- **Botón Spotify**: `bg-[#1DB954]` (verde oficial de Spotify)
- **Logo**: Círculo azul con icono de música + texto "MusicStream"

---

## 🚀 Rutas Disponibles

### 1. Página Principal (`/`)
```
http://localhost:3000/
```

**Comportamiento:**
- Si **NO está autenticado**: Muestra pantalla de login
- Si **está autenticado**: Redirige automáticamente a `/dashboard`

### 2. Página de Login Dedicada (`/login`)
```
http://localhost:3000/login
```

**Comportamiento:**
- Siempre muestra la pantalla de login
- Ideal para enlaces directos o bookmarks

---

## 🔑 Flujo de Autenticación

### Paso 1: Usuario ve el Login
El usuario llega a `/` o `/login` y ve:
- Logo de MusicStream
- Mensaje de bienvenida: "Welcome back"
- Campos decorativos de email y password
- Botón "Log In" (decorativo)
- **Botón "Continue with Spotify"** (funcional) ✅

### Paso 2: Click en "Continue with Spotify"
```javascript
handleSpotifyLogin() {
  setIsLoading(true);
  window.location.href = '/api/spotify-token';
}
```

### Paso 3: Redirección a Spotify OAuth
El endpoint `/api/spotify-token` construye la URL de autorización:
```javascript
https://accounts.spotify.com/authorize?
  client_id=TU_CLIENT_ID
  &response_type=code
  &redirect_uri=http://localhost:3000/auth/callback
  &scope=user-read-private user-read-email user-top-read...
```

### Paso 4: Usuario autoriza en Spotify
- Spotify muestra pantalla de autorización
- Usuario acepta los permisos
- Spotify redirige a: `http://localhost:3000/auth/callback?code=...`

### Paso 5: Callback procesa el código
El componente en `/auth/callback` (ya existente):
1. Extrae el `code` de la URL
2. Intercambia el código por access token
3. Guarda token en localStorage
4. Redirige a `/dashboard`

### Paso 6: Dashboard
Usuario accede al dashboard con token válido.

---

## 🎯 Características del Login

### ✅ Implementado

1. **Diseño Pixel-Perfect**
   - Sigue especificaciones exactas de Tailwind
   - Colores arbitrarios: `bg-[#2a2a2a]`, `bg-[#121212]`, etc.
   - Sombras personalizadas: `shadow-lg shadow-blue-600/30`

2. **Logo con Icono**
   - Círculo azul con icono de música (Lucide React)
   - Texto "MusicStream" bold

3. **Inputs Estilizados**
   - Email/Username
   - Password
   - Focus ring azul: `focus:ring-2 focus:ring-blue-600`
   - Placeholder gris: `placeholder-gray-500`

4. **Botones con Estados**
   - Botón "Log In" decorativo (redirige a Spotify)
   - Botón "Continue with Spotify" con logo SVG
   - Estados hover: `hover:bg-blue-500`, `hover:bg-[#1ed760]`
   - Estado loading: `disabled:opacity-50`
   - Texto cambia a "Connecting..." durante loading

5. **Links Funcionales**
   - "Forgot Password?" (placeholder)
   - "Sign Up" (placeholder)
   - Terms of Service y Privacy Policy (placeholders)

6. **Responsive Design**
   - Max width: `max-w-[400px]`
   - Padding adaptativo: `p-4`
   - Centrado vertical y horizontal

7. **Transiciones Suaves**
   - `transition-colors` en botones
   - `transition-all` en inputs y efectos

---

## 🛠️ Configuración Requerida

### 1. Variables de Entorno

Asegúrate de tener configurado `.env.local`:

```env
NEXT_PUBLIC_SPOTIFY_CLIENT_ID=tu_client_id
NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET=tu_client_secret
NEXT_PUBLIC_REDIRECT_URI=http://localhost:3000/auth/callback
```

### 2. Spotify Developer Dashboard

En https://developer.spotify.com/dashboard:

1. Crea una aplicación
2. En **Settings** → **Redirect URIs**, añade:
   ```
   http://localhost:3000/auth/callback
   ```
3. Copia Client ID y Client Secret a `.env.local`

---

## 📁 Archivos Involucrados

```
src/
├── components/
│   └── LoginScreen.jsx          ✅ Componente de login mejorado
├── app/
│   ├── page.js                  ✅ Página principal (con lógica de auth)
│   ├── login/
│   │   └── page.js              ✅ Página de login dedicada
│   ├── auth/
│   │   └── callback/
│   │       └── page.js          ⚠️ Ya existente (no modificar)
│   └── api/
│       └── spotify-token/
│           └── route.js         ⚠️ Ya existente (no modificar)
└── lib/
    └── auth.js                  ⚠️ Ya existente (funciones de auth)
```

---

## 🧪 Testing del Login

### Test 1: Verificar Diseño
```bash
npm run dev
# Ir a http://localhost:3000
```

**Checklist visual:**
- [ ] Fondo completamente negro
- [ ] Logo azul circular con icono de música
- [ ] Inputs con fondo `#2a2a2a`
- [ ] Botón azul redondeado (rounded-full)
- [ ] Botón verde de Spotify con logo
- [ ] Focus ring azul en inputs
- [ ] Sombras en los botones

### Test 2: Verificar Autenticación
1. Click en "Continue with Spotify"
2. Verificar que redirige a Spotify OAuth
3. Autorizar la aplicación
4. Verificar que vuelve a `/auth/callback`
5. Verificar que redirige a `/dashboard`

### Test 3: Verificar Persistencia
1. Autenticarse
2. Cerrar navegador
3. Abrir de nuevo http://localhost:3000
4. **Debe redirigir automáticamente a `/dashboard`** (sin pedir login)

### Test 4: Verificar Estados
1. Click en "Continue with Spotify"
2. **Botón debe mostrar "Connecting..."**
3. **Botón debe estar disabled** (no se puede hacer click múltiple)

---

## 🎨 Personalización

### Cambiar Colores

Edita `LoginScreen.jsx`:

```jsx
// Cambiar color de acento de azul a morado
className="bg-blue-600" → className="bg-purple-600"
className="focus:ring-blue-600" → className="focus:ring-purple-600"
```

### Cambiar Textos

```jsx
<h2 className="...">Welcome back</h2>
// Cambiar a:
<h2 className="...">¡Bienvenido de nuevo!</h2>
```

### Añadir Validación

```jsx
const handleSubmit = (e) => {
  e.preventDefault();

  // Validar email
  if (!email.includes('@')) {
    alert('Please enter a valid email');
    return;
  }

  // Validar password
  if (password.length < 6) {
    alert('Password must be at least 6 characters');
    return;
  }

  handleSpotifyLogin();
};
```

---

## 🐛 Troubleshooting

### Error: "Invalid redirect URI"
**Causa:** La URI en `.env.local` no coincide con Spotify Dashboard

**Solución:**
1. Verifica `.env.local`:
   ```env
   NEXT_PUBLIC_REDIRECT_URI=http://localhost:3000/auth/callback
   ```
2. Verifica Spotify Dashboard → Settings → Redirect URIs
3. Deben ser **exactamente iguales**

### Error: "Cannot find module 'lucide-react'"
**Solución:**
```bash
npm install lucide-react
```

### El botón no hace nada
**Causa:** Endpoint `/api/spotify-token` no existe o está mal configurado

**Solución:**
1. Verifica que existe `src/app/api/spotify-token/route.js`
2. Verifica variables de entorno en `.env.local`
3. Reinicia servidor: `npm run dev`

### Bucle de redirección infinito
**Causa:** Token expirado o localStorage corrupto

**Solución:**
```javascript
// En consola del navegador (F12):
localStorage.clear();
// Recargar página
```

---

## 📱 Responsive Behavior

### Mobile (< 768px)
- Logo y formulario centrados
- Ancho máximo: `max-w-[400px]`
- Padding: `p-4`
- Todos los elementos apilados verticalmente

### Tablet/Desktop (≥ 768px)
- Mismo diseño (login es siempre centrado)
- Mejor visualización de sombras y efectos

---

## ✅ Checklist de Implementación

- [x] LoginScreen.jsx actualizado con diseño pixel-perfect
- [x] app/page.js con lógica de redirección
- [x] app/login/page.js como ruta dedicada
- [x] Integración con Spotify OAuth
- [x] Estados de loading
- [x] Botón de Spotify con logo SVG
- [x] Focus states en inputs
- [x] Hover effects en botones
- [x] Links de footer (Terms, Privacy)
- [x] Responsive design
- [x] Accesibilidad (labels, disabled states)

---

## 🚀 Próximos Pasos

1. ✅ **Login funcional** → Implementado
2. ⏭️ **Dashboard** → Ya implementado
3. 🎯 **Opcionales:**
   - Validación de formulario
   - Mensajes de error
   - Animaciones de entrada
   - Social login alternativo (Google, Apple)
   - Modo oscuro/claro toggle

---

¡Tu página de login está lista y funcional! 🎉

Para cualquier duda, revisa el código en `src/components/LoginScreen.jsx` - está completamente documentado.
