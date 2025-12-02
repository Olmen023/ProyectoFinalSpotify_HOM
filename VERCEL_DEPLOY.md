# 🚀 Guía de Deploy en Vercel - MusicStream

## ✅ Problemas Resueltos

### 1. Error: useSearchParams sin Suspense
**Problema:** `useSearchParams() should be wrapped in a suspense boundary`

**Solución:** ✅ Envuelto en `<Suspense>` en `/auth/callback/page.js`

### 2. Error: localStorage en SSR
**Problema:** Acceso a `localStorage` durante pre-rendering

**Solución:** ✅ Agregado `isClient` state en `page.js` para verificar autenticación solo en cliente

---

## 📋 Pasos para Deploy en Vercel

### 1️⃣ Push los Cambios

```bash
# Asegúrate de que todos los cambios estén commiteados
git status

# Push a GitHub/GitLab
git push origin main
```

### 2️⃣ Configurar Variables de Entorno en Vercel

Ve a tu proyecto en Vercel → **Settings** → **Environment Variables**

Añade estas variables:

| Variable | Value | Environment |
|----------|-------|-------------|
| `SPOTIFY_CLIENT_ID` | `03fe865ff76744b4a11c5a416bb95cf6` | Production, Preview, Development |
| `SPOTIFY_CLIENT_SECRET` | `a6a6ba26d6a04e4daa9758abe1bb3f2d` | Production, Preview, Development |
| `NEXT_PUBLIC_SPOTIFY_CLIENT_ID` | `03fe865ff76744b4a11c5a416bb95cf6` | Production, Preview, Development |
| `NEXT_PUBLIC_REDIRECT_URI` | `https://tu-proyecto.vercel.app/auth/callback` | Production |
| `NEXT_PUBLIC_REDIRECT_URI` | `https://tu-preview.vercel.app/auth/callback` | Preview |
| `NEXT_PUBLIC_REDIRECT_URI` | `http://localhost:3000/auth/callback` | Development |

⚠️ **IMPORTANTE:** Reemplaza `tu-proyecto.vercel.app` con tu dominio real de Vercel.

### 3️⃣ Actualizar Spotify Dashboard

1. Ve a: https://developer.spotify.com/dashboard
2. Abre tu aplicación
3. Click en **Settings**
4. En **Redirect URIs**, añade:
   ```
   https://tu-proyecto.vercel.app/auth/callback
   https://tu-preview.vercel.app/auth/callback
   http://localhost:3000/auth/callback
   ```

5. Click en **Save**

### 4️⃣ Re-deploy en Vercel

Después de configurar las variables de entorno:

1. Ve a **Deployments**
2. Click en los `...` del último deployment
3. Click en **Redeploy**
4. Espera a que termine el build

---

## 🔧 Configuración Opcional de Vercel

### vercel.json (Opcional)

Puedes crear un archivo `vercel.json` en la raíz:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "regions": ["iad1"]
}
```

---

## 🐛 Troubleshooting

### Error: "redirect_uri_mismatch"

**Causa:** La Redirect URI en `.env` no coincide con Spotify Dashboard

**Solución:**
1. Verifica que la variable `NEXT_PUBLIC_REDIRECT_URI` en Vercel tenga tu dominio correcto
2. Verifica que esa misma URI esté en Spotify Dashboard → Redirect URIs
3. Re-deploy

### Error: Build Failed - Missing Dependencies

**Solución:**
```bash
# Verifica que package.json tenga todas las dependencias
npm install
git add package.json package-lock.json
git commit -m "Update dependencies"
git push
```

### Error: "SPOTIFY_CLIENT_ID is undefined"

**Causa:** Variables de entorno no configuradas en Vercel

**Solución:**
1. Ve a Vercel → Settings → Environment Variables
2. Añade `SPOTIFY_CLIENT_ID` y `SPOTIFY_CLIENT_SECRET`
3. Re-deploy

### Warning: baseline-browser-mapping outdated

Este es solo un warning, no afecta el funcionamiento. Si quieres eliminarlo:

```bash
npm i baseline-browser-mapping@latest -D
git add package.json package-lock.json
git commit -m "Update baseline-browser-mapping"
git push
```

---

## ✅ Verificación Post-Deploy

Una vez deployado, verifica:

### 1. Homepage
```
https://tu-proyecto.vercel.app
```
- [ ] Página de login se muestra correctamente
- [ ] No hay errores en consola (F12)
- [ ] Botón "Continue with Spotify" es visible

### 2. Login Flow
- [ ] Click en "Continue with Spotify"
- [ ] Redirige a Spotify OAuth
- [ ] Después de autorizar, vuelve a tu app
- [ ] Redirige a `/dashboard`

### 3. Dashboard
```
https://tu-proyecto.vercel.app/dashboard
```
- [ ] Sidebar se muestra
- [ ] Widgets cargan correctamente
- [ ] Puede generar playlist

---

## 🔒 Seguridad en Producción

### Variables de Entorno

✅ **Correcto:**
```env
# Servidor (NO expuesto al cliente)
SPOTIFY_CLIENT_SECRET=tu_secret

# Cliente (expuesto en el browser)
NEXT_PUBLIC_SPOTIFY_CLIENT_ID=tu_client_id
```

❌ **Incorrecto:**
```env
# NUNCA expongas el secret al cliente
NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET=tu_secret  # ❌ MAL
```

### Headers de Seguridad

Vercel automáticamente añade headers de seguridad, pero puedes personalizarlos en `vercel.json`:

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        }
      ]
    }
  ]
}
```

---

## 📊 Monitoreo

### Vercel Analytics

Activa Analytics en Vercel para monitorear:
- Page load times
- Core Web Vitals
- User traffic

### Logs

Para ver logs de errores:
1. Ve a tu proyecto en Vercel
2. Click en **Functions**
3. Selecciona una function (e.g., `/api/spotify-token`)
4. Click en **Logs**

---

## 🌐 Dominios Personalizados

### Añadir Dominio Propio

1. Ve a **Settings** → **Domains**
2. Click en **Add**
3. Ingresa tu dominio (e.g., `musicstream.com`)
4. Sigue las instrucciones para configurar DNS

### Actualizar Redirect URIs

Después de añadir dominio propio:

1. Actualiza variables en Vercel:
   ```
   NEXT_PUBLIC_REDIRECT_URI=https://musicstream.com/auth/callback
   ```

2. Actualiza Spotify Dashboard:
   - Añade: `https://musicstream.com/auth/callback`

3. Re-deploy

---

## 📝 Checklist Final

Antes de considerar el deploy completo:

- [ ] Variables de entorno configuradas en Vercel
- [ ] Redirect URIs actualizadas en Spotify Dashboard
- [ ] Build exitoso sin errores
- [ ] Login funciona en producción
- [ ] Dashboard carga correctamente
- [ ] Widgets funcionan
- [ ] Playlist se genera correctamente
- [ ] No hay errores en consola del browser
- [ ] No hay errores en logs de Vercel

---

## 🎉 Deploy Completado

Si todas las verificaciones pasaron, tu aplicación **MusicStream** está lista en producción!

**URL de tu app:** `https://tu-proyecto.vercel.app`

---

## 🔄 Continuous Deployment

Vercel hace deploy automático cuando:
- Haces push a `main` (production)
- Haces push a otras ramas (preview deployments)
- Haces PR (preview deployments)

Para desactivar auto-deploy:
- Ve a **Settings** → **Git**
- Configura según tus preferencias

---

## 📞 Soporte

Si tienes problemas:

1. **Revisa logs:** Vercel → Deployments → [tu deployment] → Logs
2. **Revisa función:** Vercel → Functions → `/api/spotify-token` → Logs
3. **Revisa variables:** Vercel → Settings → Environment Variables
4. **Prueba local:** `npm run build` para ver si reproduce el error

---

¡Tu aplicación MusicStream está lista para el mundo! 🚀🎵
