'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';
import LoginScreen from '@/components/LoginScreen';

/**
 * Página principal - Muestra login o redirige a dashboard
 */
export default function Home() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    // Marcar que estamos en el cliente
    setIsClient(true);

    // Verificar autenticación solo en el cliente
    const checkAuth = isAuthenticated();
    setAuthenticated(checkAuth);

    // Si ya está autenticado, redirigir al dashboard
    if (checkAuth) {
      router.push('/dashboard');
    }
  }, [router]);

  // Durante SSR, mostrar loading
  if (!isClient) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  // Si no está autenticado, mostrar pantalla de login
  if (!authenticated) {
    return <LoginScreen />;
  }

  // Mientras redirige, mostrar loading
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-white">Redirecting to dashboard...</div>
    </div>
  );
}
