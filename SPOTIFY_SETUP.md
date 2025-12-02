# 🎵 Configuración de Spotify Developer

## 📝 Guía Paso a Paso para Obtener Credenciales

### 1️⃣ Crear Aplicación en Spotify

1. Ve a **[Spotify Developer Dashboard](https://developer.spotify.com/dashboard)**
2. Inicia sesión con tu cuenta de Spotify
3. Click en **"Create app"**

### 2️⃣ Configurar la Aplicación

Rellena el formulario:

| Campo | Valor |
|-------|-------|
| **App name** | MusicStream |
| **App description** | Aplicación para generar playlists personalizadas |
| **Website** | http://localhost:3000 |
| **Redirect URI** | `http://localhost:3000/auth/callback` ⚠️ **IMPORTANTE** |

**Scopes necesarios:** (se configuran automáticamente en el código)
- ✅ user-read-private
- ✅ user-read-email
- ✅ user-top-read
- ✅ playlist-modify-public
- ✅ playlist-modify-private

Acepta los términos y click en **"Save"**

### 3️⃣ Obtener Credenciales

Una vez creada la app:

1. Click en **"Settings"** (botón verde)
2. Verás tu **Client ID** (se puede copiar directamente)
3. Click en **"View client secret"** para revelar el **Client Secret**
4. Copia ambos valores

### 4️⃣ Configurar Variables de Entorno

Abre el archivo `.env.local` en la raíz del proyecto y pega tus credenciales:

```env
NEXT_PUBLIC_SPOTIFY_CLIENT_ID=tu_client_id_aqui_pegado
NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET=tu_client_secret_aqui_pegado
NEXT_PUBLIC_REDIRECT_URI=http://localhost:3000/auth/callback
```

### 5️⃣ Verificar Configuración

**Checklist:**
- [ ] Client ID copiado correctamente (sin espacios)
- [ ] Client Secret copiado correctamente
- [ ] Redirect URI exactamente: `http://localhost:3000/auth/callback`
- [ ] Redirect URI añadida en Spotify Dashboard
- [ ] Archivo `.env.local` guardado
- [ ] No hay espacios extra en las variables

---

## 🔍 Ejemplo Visual

Tu `.env.local` debería verse así:

```env
NEXT_PUBLIC_SPOTIFY_CLIENT_ID=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET=z9y8x7w6v5u4t3s2r1q0p9o8n7m6l5k4
NEXT_PUBLIC_REDIRECT_URI=http://localhost:3000/auth/callback
```

---

## ⚠️ Errores Comunes

### Error: "Invalid redirect URI"

**Causa:** La URI en `.env.local` no coincide con la configurada en Spotify Dashboard

**Solución:**
1. Ve a Spotify Dashboard → Tu App → Settings
2. Verifica que `http://localhost:3000/auth/callback` esté en "Redirect URIs"
3. Debe ser **exactamente igual** (sin `/` al final)

### Error: "Invalid client"

**Causa:** Client ID o Client Secret incorrectos

**Solución:**
1. Ve a Spotify Dashboard → Tu App → Settings
2. Verifica Client ID (copia de nuevo)
3. Regenera Client Secret si es necesario
4. Asegúrate de no haber copiado espacios extra

### Error: "INVALID_CLIENT: Invalid client secret"

**Causa:** Client Secret mal copiado o espacios extra

**Solución:**
```bash
# Elimina .env.local y créalo de nuevo
rm .env.local

# Copia Client Secret con cuidado
# Verifica que no haya espacios antes o después
```

---

## 🚀 Testing

Una vez configurado:

```bash
# 1. Reinicia el servidor (importante)
npm run dev

# 2. Ve a http://localhost:3000

# 3. Click en "Continue with Spotify"

# 4. Si todo está bien, serás redirigido a Spotify para autorizar

# 5. Después de autorizar, volverás a /auth/callback y luego a /dashboard
```

---

## 🔒 Seguridad

**⚠️ IMPORTANTE:**

- ❌ **NUNCA** compartas tu Client Secret públicamente
- ❌ **NUNCA** subas `.env.local` a Git
- ✅ `.env.local` está en `.gitignore` por defecto
- ✅ Usa `.env.local.example` para compartir la estructura

---

## 🌐 Producción

Cuando despliegues a producción:

```env
# Cambia la URI a tu dominio real
NEXT_PUBLIC_REDIRECT_URI=https://tudominio.com/auth/callback
```

Y en Spotify Dashboard:
1. Settings → Redirect URIs
2. Añade: `https://tudominio.com/auth/callback`
3. Guarda cambios

---

## 📞 Soporte

Si tienes problemas:

1. Verifica que todas las variables estén bien copiadas
2. Reinicia el servidor después de cambiar `.env.local`
3. Revisa la consola del navegador (F12) para errores
4. Verifica que la Redirect URI coincida exactamente

---

## ✅ Resumen Rápido

```bash
# 1. Crear app en https://developer.spotify.com/dashboard
# 2. Configurar Redirect URI: http://localhost:3000/auth/callback
# 3. Copiar Client ID y Client Secret
# 4. Pegarlos en .env.local
# 5. Guardar archivo
# 6. npm run dev
# 7. Ir a http://localhost:3000
# 8. ¡Listo! 🎉
```

---

¡Tu aplicación MusicStream está lista para autenticarse con Spotify! 🎵✨
