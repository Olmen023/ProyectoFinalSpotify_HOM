import LoginScreen from '@/components/LoginScreen';

/**
 * Página de Login dedicada
 * Ruta: /login
 */
export default function LoginPage() {
  return <LoginScreen />;
}

export const metadata = {
  title: 'Login - MusicStream',
  description: 'Log in to access your personalized playlists on MusicStream',
};
