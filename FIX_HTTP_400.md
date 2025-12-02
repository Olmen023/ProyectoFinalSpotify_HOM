# 🔧 Solución a HTTP ERROR 400

## ✅ Problemas Arreglados

### 1. Variables de Entorno
**Problema:** Las variables con prefijo `NEXT_PUBLIC_` solo funcionan en el cliente (browser), pero el servidor necesita acceso sin ese prefijo.

**Solución:** Actualicé `.env.local` para incluir:
```env
# Para el SERVIDOR (API routes)
SPOTIFY_CLIENT_ID=03fe865ff76744b4a11c5a416bb95cf6
SPOTIFY_CLIENT_SECRET=a6a6ba26d6a04e4daa9758abe1bb3f2d

# Para el CLIENTE (browser)
NEXT_PUBLIC_SPOTIFY_CLIENT_ID=03fe865ff76744b4a11c5a416bb95cf6

# Redirect URI
NEXT_PUBLIC_REDIRECT_URI=http://localhost:3000/auth/callback
```

### 2. Error de Sintaxis
**Problema:** Typo en `callback/page.js` línea 35
```javascript
localStorageStorage.removeItem(...) // ❌ Error
```

**Solución:** Corregido a:
```javascript
localStorage.removeItem(...) // ✅ Correcto
```

---

## 🚀 Pasos para Probar

### 1. **IMPORTANTE: Reiniciar el servidor**
```bash
# Detener el servidor actual (Ctrl+C)
# Luego reiniciar:
npm run dev
```

### 2. Verificar Spotify Dashboard
Ve a: https://developer.spotify.com/dashboard

1. Abre tu aplicación
2. Click en **"Settings"**
3. Verifica **"Redirect URIs"**:
   ```
   http://localhost:3000/auth/callback
   ```

   ⚠️ **Debe ser EXACTAMENTE igual** (sin espacios, sin `/` al final)

### 3. Probar Login
1. Abre: `http://localhost:3000`
2. Click en **"Continue with Spotify"**
3. Autoriza en Spotify
4. Deberías volver a tu app y ver "Autenticando..."
5. Luego redirige a `/dashboard`

---

## 🔍 Si Sigue Sin Funcionar

### Verificación 1: Console del Navegador
Abre DevTools (F12) → Console

Busca errores como:
- `Failed to fetch`
- `Network error`
- `CORS error`

### Verificación 2: Terminal del Servidor
Revisa la terminal donde corre `npm run dev`

Busca errores como:
- `Error en token exchange`
- `SPOTIFY_CLIENT_ID is undefined`

### Verificación 3: Limpiar localStorage
En la consola del navegador (F12):
```javascript
localStorage.clear();
```
Luego recarga la página e intenta de nuevo.

---

## 📋 Checklist de Verificación

Antes de intentar login de nuevo:

- [ ] Servidor reiniciado (`npm run dev`)
- [ ] `.env.local` tiene las variables correctas (con y sin `NEXT_PUBLIC_`)
- [ ] Spotify Dashboard tiene la Redirect URI correcta
- [ ] La Redirect URI en `.env.local` coincide con la de Spotify Dashboard
- [ ] No hay espacios extra en las credenciales
- [ ] Client ID y Client Secret son correctos

---

## 🐛 Errores Comunes y Soluciones

### Error: "invalid_client"
**Causa:** Client ID o Client Secret incorrectos

**Solución:**
1. Ve a Spotify Dashboard
2. Regenera el Client Secret si es necesario
3. Copia de nuevo a `.env.local`
4. Reinicia servidor

### Error: "redirect_uri_mismatch"
**Causa:** La URI en `.env.local` no coincide con Spotify Dashboard

**Solución:**
```env
# En .env.local debe ser EXACTAMENTE:
NEXT_PUBLIC_REDIRECT_URI=http://localhost:3000/auth/callback

# En Spotify Dashboard debe ser EXACTAMENTE:
http://localhost:3000/auth/callback

# ❌ Errores comunes:
# http://localhost:3000/auth/callback/  (con / al final)
# https://localhost:3000/auth/callback   (https en local)
# http://127.0.0.1:3000/auth/callback    (IP en vez de localhost)
```

### Error: "CSRF validation failed"
**Causa:** El parámetro `state` no coincide

**Solución:**
```javascript
// En consola del navegador:
localStorage.clear();
// Recargar página e intentar de nuevo
```

---

## 🎯 Diferencias entre Variables de Entorno

| Variable | Uso | Disponible en |
|----------|-----|---------------|
| `SPOTIFY_CLIENT_ID` | Servidor | Solo API routes |
| `SPOTIFY_CLIENT_SECRET` | Servidor | Solo API routes |
| `NEXT_PUBLIC_SPOTIFY_CLIENT_ID` | Cliente | Browser |
| `NEXT_PUBLIC_REDIRECT_URI` | Cliente y Servidor | Ambos |

**Regla:**
- ✅ Variables sin `NEXT_PUBLIC_`: Solo servidor
- ✅ Variables con `NEXT_PUBLIC_`: Cliente (browser)
- ❌ `NEXT_PUBLIC_` + secrets = ¡NUNCA! (expones el secret)

---

## 📞 Debugging Avanzado

Si aún tienes problemas, añade logs temporales:

### En `src/app/api/spotify-token/route.js`:
```javascript
export async function POST(request) {
  try {
    const { code } = await request.json();

    // 🔍 Añadir estos logs temporales:
    console.log('📍 Code recibido:', code ? 'Sí' : 'No');
    console.log('📍 Client ID:', process.env.SPOTIFY_CLIENT_ID ? 'Configurado' : 'FALTA');
    console.log('📍 Client Secret:', process.env.SPOTIFY_CLIENT_SECRET ? 'Configurado' : 'FALTA');
    console.log('📍 Redirect URI:', process.env.NEXT_PUBLIC_REDIRECT_URI);

    // ... resto del código
  }
}
```

Luego revisa la terminal del servidor durante el login.

---

## ✅ Confirmación de Éxito

Sabrás que funciona cuando:
1. Click en "Continue with Spotify" ✅
2. Redirige a Spotify (pantalla de autorización) ✅
3. Autorizas y vuelves a tu app ✅
4. Ves "Autenticando..." brevemente ✅
5. Redirige a `/dashboard` ✅
6. Dashboard carga correctamente ✅

---

## 🎉 Próximos Pasos

Una vez que funcione el login:
1. Prueba los widgets del dashboard
2. Genera una playlist
3. Verifica que los favoritos se guardan

---

**¿Necesitas ayuda?**
- Revisa logs en consola (F12)
- Revisa logs en terminal del servidor
- Verifica que todas las variables estén configuradas

¡Buena suerte! 🚀
