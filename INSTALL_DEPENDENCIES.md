# 📦 Instalación de Dependencias

## ⚠️ IMPORTANTE: Debes instalar lucide-react

El proyecto usa iconos de Lucide React que **no están actualmente en package.json**.

## Instalación Requerida

Ejecuta este comando en la raíz del proyecto:

```bash
npm install lucide-react
```

## Verificación

Después de instalar, tu `package.json` debería incluir:

```json
{
  "dependencies": {
    "react": "19.2.0",
    "react-dom": "19.2.0",
    "next": "16.0.1",
    "lucide-react": "^0.x.x"  ← Nueva dependencia
  }
}
```

## ¿Por qué lucide-react?

Lucide React proporciona iconos SVG modernos y optimizados usados en:

- `Music` - Logo de MusicStream
- `Home`, `Compass`, `Library`, `Heart` - Navegación del sidebar
- `Search` - Barra de búsqueda
- `Play` - Botones de reproducción
- `X` - Botones de eliminar
- `User` - Avatar por defecto
- `RefreshCw`, `Plus`, `Save`, `Download` - Acciones de playlist
- Y muchos más...

## Comandos Completos de Setup

```bash
# 1. Instalar dependencias
npm install lucide-react

# 2. Verificar instalación
npm list lucide-react

# 3. Ejecutar proyecto
npm run dev
```

## Alternativa: Usar package manager diferente

Si usas yarn o pnpm:

```bash
# Yarn
yarn add lucide-react

# pnpm
pnpm add lucide-react
```

## Troubleshooting

### Error: "Cannot find module 'lucide-react'"

**Solución:**
```bash
rm -rf node_modules
rm package-lock.json
npm install
npm install lucide-react
npm run dev
```

### Error: "Module not found: Can't resolve 'lucide-react'"

**Solución:**
1. Verifica que estás en la raíz del proyecto
2. Ejecuta `npm install lucide-react`
3. Reinicia el servidor de desarrollo

---

## Resumen de Dependencias del Proyecto

| Dependencia | Versión | Propósito |
|-------------|---------|-----------|
| react | 19.2.0 | Framework UI |
| react-dom | 19.2.0 | Renderizado |
| next | 16.0.1 | Framework |
| **lucide-react** | **latest** | **Iconos (INSTALAR)** ✅ |
| tailwindcss | ^4 | Estilos |

---

¡No olvides ejecutar `npm install lucide-react` antes de iniciar el proyecto! 🚀
