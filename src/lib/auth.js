// Generar string aleatorio para el parámetro 'state'
export function generateRandomString(length) {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let text = '';
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

// Construir URL de autorización de Spotify
export function getSpotifyAuthUrl() {
  const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID || '';
  const redirectUri = process.env.NEXT_PUBLIC_REDIRECT_URI || '';
  const state = generateRandomString(16);

  // Guardar el state para validación posterior (prevenir CSRF)
  if (typeof window !== 'undefined') {
    try {
      // Limpiar state antiguo
      localStorage.removeItem('spotify_auth_state');
      sessionStorage.removeItem('spotify_auth_state');

      // Guardar en AMBOS storages para mayor confiabilidad
      localStorage.setItem('spotify_auth_state', state);
      sessionStorage.setItem('spotify_auth_state', state);

      // Verificar que se guardó correctamente en ambos
      const localVerification = localStorage.getItem('spotify_auth_state');
      const sessionVerification = sessionStorage.getItem('spotify_auth_state');

      if (!localVerification && !sessionVerification) {
        alert('Error: El navegador está bloqueando el almacenamiento. Por favor, desactiva el modo incógnito o permite cookies.');
      }
    } catch (error) {
      alert('Error al guardar el estado de autenticación. Por favor, verifica la configuración de tu navegador.');
    }
  }

  const scope = [
    'user-read-private',
    'user-read-email',
    'user-top-read',
    'user-library-read',
    'user-library-modify',
    'playlist-modify-public',
    'playlist-modify-private',
    'playlist-read-private'
  ].join(' ');

  const params = new URLSearchParams({
    client_id: clientId,
    response_type: 'code',
    redirect_uri: redirectUri,
    state: state,
    scope: scope
  });

  return `https://accounts.spotify.com/authorize?${params.toString()}`;
}

// Guardar tokens en localStorage
export function saveTokens(accessToken, refreshToken, expiresIn) {
  const expirationTime = Date.now() + expiresIn * 1000;
  localStorage.setItem('spotify_token', accessToken);
  localStorage.setItem('spotify_refresh_token', refreshToken);
  localStorage.setItem('spotify_token_expiration', expirationTime.toString());
}

// Obtener token actual (con verificación de expiración)
export function getAccessToken() {
  const token = localStorage.getItem('spotify_token');
  const expiration = localStorage.getItem('spotify_token_expiration');
  
  if (!token || !expiration) return null;
  
  // Si el token expiró, retornar null
  if (Date.now() > parseInt(expiration)) {
    return null;
  }
  
  return token;
}

// Verificar si hay token válido
export function isAuthenticated() {
  return getAccessToken() !== null;
}

// Cerrar sesión
export function logout() {
  localStorage.removeItem('spotify_token');
  localStorage.removeItem('spotify_refresh_token');
  localStorage.removeItem('spotify_token_expiration');
  localStorage.removeItem('spotify_auth_state');
  sessionStorage.removeItem('spotify_auth_state');
}