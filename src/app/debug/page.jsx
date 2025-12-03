'use client';

import { useEffect, useState } from 'react';
import { getAccessToken } from '@/lib/auth';
import Button from '@/components/ui/Button';

/**
 * Página de debug para verificar token y permisos de Spotify
 */
export default function DebugPage() {
  const [tokenInfo, setTokenInfo] = useState(null);
  const [scopes, setScopes] = useState([]);

  useEffect(() => {
    const token = getAccessToken();
    const expiration = localStorage.getItem('spotify_token_expiration');

    setTokenInfo({
      hasToken: !!token,
      token: token ? `${token.substring(0, 20)}...` : 'No token',
      expiration: expiration ? new Date(parseInt(expiration)).toLocaleString() : 'N/A',
      isExpired: expiration ? Date.now() > parseInt(expiration) : true
    });

    // Intentar decodificar scopes del token (si está disponible)
    if (token) {
      fetch('https://api.spotify.com/v1/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => {
          if (res.ok) {
            setScopes(['Token válido - permisos activos']);
          } else {
            setScopes([`Error: ${res.status} ${res.statusText}`]);
          }
        })
        .catch(err => setScopes([`Error: ${err.message}`]));
    }
  }, []);

  const clearLocalStorage = () => {
    localStorage.clear();
    sessionStorage.clear();
    alert('LocalStorage y SessionStorage limpiados. Recarga la página.');
    window.location.reload();
  };

  const testLibraryAccess = async () => {
    const token = getAccessToken();
    if (!token) {
      alert('No hay token disponible');
      return;
    }

    try {
      const response = await fetch('https://api.spotify.com/v1/me/tracks?limit=1', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        alert('✅ Acceso a biblioteca exitoso! Los permisos están correctos.');
      } else {
        const error = await response.json();
        alert(`❌ Error ${response.status}: ${error.error?.message || 'Permission denied'}\n\nNecesitas re-autenticarte con los nuevos permisos.`);
      }
    } catch (error) {
      alert(`❌ Error: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">🔧 Debug - Spotify Auth</h1>

        {/* Token Info */}
        <div className="bg-[#181818] rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">Token Information</h2>
          <div className="space-y-2 text-sm font-mono">
            <p><strong>Has Token:</strong> {tokenInfo?.hasToken ? '✅ Yes' : '❌ No'}</p>
            <p><strong>Token Preview:</strong> {tokenInfo?.token}</p>
            <p><strong>Expiration:</strong> {tokenInfo?.expiration}</p>
            <p><strong>Is Expired:</strong> {tokenInfo?.isExpired ? '❌ Yes' : '✅ No'}</p>
          </div>
        </div>

        {/* Scopes */}
        <div className="bg-[#181818] rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">API Status</h2>
          <div className="space-y-1">
            {scopes.map((scope, i) => (
              <p key={i} className="text-gray-400">• {scope}</p>
            ))}
          </div>
        </div>

        {/* Required Scopes */}
        <div className="bg-[#181818] rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">Required Scopes</h2>
          <div className="space-y-1 text-sm text-gray-400">
            <p>• user-read-private</p>
            <p>• user-read-email</p>
            <p>• user-top-read</p>
            <p className="text-green-400">• user-library-read (NEW)</p>
            <p className="text-green-400">• user-library-modify (NEW)</p>
            <p>• playlist-modify-public</p>
            <p>• playlist-modify-private</p>
            <p className="text-green-400">• playlist-read-private (NEW)</p>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-4">
          <Button
            onClick={testLibraryAccess}
            className="w-full bg-blue-600 hover:bg-blue-500"
          >
            🧪 Test Library Access (Check Permissions)
          </Button>

          <Button
            onClick={clearLocalStorage}
            className="w-full bg-red-600 hover:bg-red-500"
          >
            🗑️ Clear LocalStorage & Reload
          </Button>

          <Button
            onClick={() => window.location.href = '/login'}
            className="w-full bg-green-600 hover:bg-green-500"
          >
            🔐 Go to Login Page
          </Button>
        </div>

        {/* Instructions */}
        <div className="bg-yellow-900/20 border border-yellow-600 rounded-lg p-6 mt-8">
          <h3 className="text-xl font-bold mb-3 text-yellow-400">⚠️ Si ves errores 403:</h3>
          <ol className="list-decimal list-inside space-y-2 text-sm text-gray-300">
            <li>Haz clic en "Clear LocalStorage & Reload"</li>
            <li>Ve a <a href="https://www.spotify.com/account/apps/" target="_blank" className="text-blue-400 underline">spotify.com/account/apps</a></li>
            <li>Elimina "MusicStream" de tus apps autorizadas</li>
            <li>Vuelve a hacer login en la aplicación</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
