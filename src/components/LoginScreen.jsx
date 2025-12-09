'use client';

import { Music } from 'lucide-react';
import { useState } from 'react';
import { getSpotifyAuthUrl } from '@/lib/auth';

/**
 * COMPONENTE: LoginScreen - Pantalla de autenticación principal
 * ==============================================================
 * Pantalla de login de la aplicación con diseño pixel-perfect.
 * Implementa autenticación OAuth con Spotify. El formulario
 * email/password es decorativo; la autenticación real es OAuth.
 *
 * FUNCIONALIDAD:
 * - Formulario decorativo de email/contraseña (no funcional)
 * - Botón principal que redirige a Spotify OAuth
 * - Botón "Continue with Spotify" como método principal de login
 * - Estados de carga durante el proceso de autenticación
 * - Enlaces decorativos: "Forgot Password", "Sign Up", Terms, Privacy
 * - Logo y branding de la aplicación
 * - Diseño responsive centrado verticalmente
 *
 * ARQUITECTURA:
 * - Componente standalone full-screen (no requiere layout)
 * - Estados locales para campos del formulario (decorativos)
 * - Estado loading para feedback visual durante OAuth
 * - Redirección a Spotify OAuth mediante getSpotifyAuthUrl()
 * - Fondo negro con card centrada
 * - Logo de Spotify SVG inline
 *
 * DEPENDENCIAS DE REACT:
 * - useState: Manejo de campos del formulario y loading state
 *
 * DEPENDENCIAS DE LIBRERÍAS:
 * - lucide-react: Icono Music para logo de la app
 *
 * REFERENCIAS:
 * - Importa getSpotifyAuthUrl desde @/lib/auth (src/lib/auth.js)
 *
 * UTILIZADO EN:
 * - src/app/page.jsx (si usuario no autenticado)
 * - src/app/login/page.jsx (ruta dedicada de login)
 *
 * @returns {JSX.Element} Pantalla de login completa
 *
 * FLUJO DE AUTENTICACIÓN:
 * 1. Usuario ve pantalla de login con opciones
 * 2. Puede llenar formulario decorativo (no hace nada)
 * 3. Al hacer clic en cualquier botón de login:
 *    - Activa estado loading
 *    - Llama a getSpotifyAuthUrl() para obtener URL OAuth
 *    - Redirige a Spotify para autorización
 * 4. Spotify redirige de vuelta a /callback con código
 * 5. /callback procesa token y establece sesión
 * 6. Usuario es redirigido a la app autenticado
 *
 * NOTAS DE DISEÑO:
 * - Sigue guías de diseño de Spotify (colores, espaciado)
 * - Verde oficial de Spotify: #1DB954
 * - Formulario decorativo para UI/UX, pero OAuth es el único método real
 * - Botón de Spotify prominente como CTA principal
 */
export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Login decorativo - la autenticación real es con Spotify
    handleSpotifyLogin();
  };

  const handleSpotifyLogin = () => {
    setIsLoading(true);
    // Obtener la URL de autorización de Spotify
    const authUrl = getSpotifyAuthUrl();
    // Redirigir a Spotify OAuth
    window.location.href = authUrl;
  };

  return (
    <main className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-[400px] flex flex-col justify-center">
        {/* Logo Header */}
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-blue-600/50">
            <Music size={20} strokeWidth={2.5} />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            MusicStream
          </h1>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          {/* Welcome Text */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Welcome back</h2>
            <p className="text-gray-400 text-sm">
              Log in to access your personalized playlists
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 block">
                Email or username
              </label>
              <input
                type="text"
                placeholder="Enter your email or username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg bg-[#2a2a2a] border-none text-white placeholder-gray-500 py-3 px-4 focus:ring-2 focus:ring-blue-600 focus:outline-none transition-all"
              />
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-gray-300">
                  Password
                </label>
                <a
                  href="#"
                  className="text-sm font-medium text-blue-500 hover:text-blue-400 transition-colors"
                >
                  Forgot Password?
                </a>
              </div>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg bg-[#2a2a2a] border-none text-white placeholder-gray-500 py-3 px-4 focus:ring-2 focus:ring-blue-600 focus:outline-none transition-all"
              />
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 mt-6 transition-colors shadow-lg shadow-blue-600/30 hover:shadow-blue-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Connecting...' : 'Log In'}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-black text-gray-500">OR</span>
            </div>
          </div>

          {/* Spotify Login Button */}
          <button
            onClick={handleSpotifyLogin}
            disabled={isLoading}
            className="w-full rounded-full bg-[#1DB954] hover:bg-[#1ed760] text-white font-bold py-3 transition-all shadow-lg shadow-green-600/30 hover:shadow-green-500/40 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
            </svg>
            {isLoading ? 'Connecting...' : 'Continue with Spotify'}
          </button>

          {/* Sign Up Link */}
          <p className="text-center text-gray-400 mt-6 text-sm">
            Don&apos;t have an account?{' '}
            <a
              href="#"
              className="text-blue-500 font-medium hover:text-blue-400 hover:underline transition-colors"
            >
              Sign Up
            </a>
          </p>
        </div>

        {/* Footer Note */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">
            By continuing, you agree to MusicStream&apos;s{' '}
            <a href="#" className="hover:text-gray-400 underline">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" className="hover:text-gray-400 underline">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
