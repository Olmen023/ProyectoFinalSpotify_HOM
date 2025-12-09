/**
 * PÁGINA: LOGIN - AUTENTICACIÓN CON SPOTIFY
 * ==========================================
 * Página dedicada de login que muestra la pantalla de autenticación con Spotify.
 * Es una simple wrapper page que renderiza el componente LoginScreen.
 *
 * FUNCIONALIDAD:
 * - Renderiza el componente LoginScreen
 * - Proporciona metadata SEO para la página
 * - Ruta pública accesible sin autenticación
 *
 * ARQUITECTURA:
 * - Server Component (no usa hooks de cliente)
 * - Simple wrapper sin lógica adicional
 * - Delega toda la UI a LoginScreen
 *
 * REFERENCIAS:
 * - Importa LoginScreen desde @/components/LoginScreen (src/components/LoginScreen.jsx)
 *
 * RUTAS:
 * - Ruta: /login
 * - Accesible desde: Página principal (/) cuando no hay token
 * - Redirige a: /dashboard después de login exitoso
 *
 * METADATA:
 * - title: "Login - MusicStream"
 * - description: SEO friendly para login
 *
 * FLUJO:
 * 1. Usuario sin token accede a /login
 * 2. Se renderiza LoginScreen
 * 3. Usuario hace clic en "Login with Spotify"
 * 4. Redirige a Spotify OAuth
 * 5. Callback procesa autenticación
 * 6. Redirige a /dashboard
 *
 * @returns {JSX.Element} - Componente LoginScreen
 */

import LoginScreen from '@/components/LoginScreen';

export default function LoginPage() {
  return <LoginScreen />;
}

export const metadata = {
  title: 'Login - MusicStream',
  description: 'Log in to access your personalized playlists on MusicStream',
};
