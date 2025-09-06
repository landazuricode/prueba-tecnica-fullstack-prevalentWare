# Prueba Técnica Fullstack - Prevalentware

Una aplicación fullstack desarrollada con Next.js, Prisma, PostgreSQL y Better Auth para la gestión de usuarios y movimientos financieros.

## 🚀 Características

- **Autenticación**: Sistema de autenticación con Better Auth
- **Base de datos**: PostgreSQL con Prisma ORM
- **UI**: Interfaz moderna con Tailwind CSS y Radix UI
- **API**: Documentación automática con Swagger
- **Testing**: Suite de pruebas con Jest
- **RBAC**: Control de acceso basado en roles

## 📋 Prerrequisitos

Antes de comenzar, asegúrate de tener instalado:

- [Node.js](https://nodejs.org/) (versión 18 o superior)
- [npm](https://www.npmjs.com/) o [yarn](https://yarnpkg.com/)
- [PostgreSQL](https://www.postgresql.org/) (versión 13 o superior)
- [Git](https://git-scm.com/)

## 🛠️ Instalación y Configuración Local

### 1. Clonar el repositorio

```bash
git clone https://github.com/landazuricode/prueba-tecnica-fullstack-prevalentWare.git
cd prueba-tecnica-fullstack-prevalentWare-main
```

### 2. Instalar dependencias

```bash
npm install
# o
yarn install
```

### 3. Configurar variables de entorno

Crea un archivo `.env.local` en la raíz del proyecto con las siguientes variables:

```env
NEXT_PUBLIC_BETTER_AUTH_URL=https://prueba-tecnica-fullstack-prevalent.vercel.app
BETTER_AUTH_SECRET=ZggAPmoNMNFfWqPVcr91G4ec1q4nlYFF
NEXT_PUBLIC_GITHUB_CLIENT_ID=Ov23li3JrX7T3Eikglbe
NEXT_GITHUB_CLIENT_SECRET=6f5bb9f4dd8173c650ac2fea217987391ebdd122
DATABASE_URL="postgresql://postgres:V7ZgusM7ceKHLTJm@db.wacmpiclohqcxmacrugv.supabase.co:5432/postgres"
NEXT_PUBLIC_API_URL="https://prueba-tecnica-fullstack-prevalent.vercel.app"
```

### 4. Configurar la base de datos

```bash
# Generar el cliente de Prisma
npx prisma generate

# Ejecutar las migraciones
npx prisma db push

# (Opcional) Sembrar la base de datos con datos de prueba
npx prisma db seed
```

### 5. Ejecutar el proyecto

```bash
# Modo desarrollo
npm run dev
# o
yarn dev
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000)

## 🧪 Testing

```bash
# Ejecutar todas las pruebas
npm test

# Ejecutar pruebas en modo watch
npm run test:watch

# Ejecutar pruebas con cobertura
npm run test:coverage
```

## 📦 Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run start` - Inicia el servidor de producción
- `npm run lint` - Ejecuta el linter
- `npm test` - Ejecuta las pruebas
- `npm run test:watch` - Ejecuta las pruebas en modo watch
- `npm run test:coverage` - Ejecuta las pruebas con reporte de cobertura

## 🚀 Despliegue en Vercel

### 1. Preparar el proyecto

Asegúrate de que el proyecto esté listo para producción:

```bash
# Verificar que el build funciona correctamente
npm run build
```

### 2. Conectar con Vercel

#### Opción A: Desde la interfaz web de Vercel

1. Ve a [vercel.com](https://vercel.com) y crea una cuenta o inicia sesión
2. Haz clic en "New Project"
3. Conecta tu repositorio de GitHub
4. Selecciona el repositorio del proyecto

#### Opción B: Usando Vercel CLI

```bash
# Instalar Vercel CLI globalmente
npm i -g vercel

# Iniciar sesión en Vercel
vercel login

# Desplegar desde el directorio del proyecto
vercel

# Para desplegar a producción
vercel --prod
```

### 3. Configurar variables de entorno en Vercel

En el dashboard de Vercel, ve a tu proyecto y configura las siguientes variables de entorno:

#### Variables requeridas:

- `DATABASE_URL` - URL de conexión a PostgreSQL (ej: `postgresql://user:password@host:port/database`)
- `NEXT_PUBLIC_BETTER_AUTH_URL` - URL de tu aplicación desplegada (ej: `https://tu-app.vercel.app`)

- `NEXT_PUBLIC_GITHUB_CLIENT_ID` - Client ID de GitHub OAuth
- `NEXT_GITHUB_CLIENT_SECRET` - Client Secret de GitHub OAuth

### 4. Configurar la base de datos en producción

Para la base de datos en producción, puedes usar:

#### Opción A: Vercel Postgres

1. En el dashboard de Vercel, ve a la pestaña "Storage"
2. Crea una nueva base de datos Postgres
3. Copia la `DATABASE_URL` generada automáticamente

#### Opción B: Servicios externos

- [Neon](https://neon.tech/)
- [Supabase](https://supabase.com/)
- [PlanetScale](https://planetscale.com/)
- [Railway](https://railway.app/)

### 5. Ejecutar migraciones en producción

```bash
# Conectar a tu base de datos de producción y ejecutar
npx prisma db push
```

### 6. Configurar dominio personalizado (opcional)

1. En el dashboard de Vercel, ve a "Settings" > "Domains"
2. Agrega tu dominio personalizado
3. Configura los registros DNS según las instrucciones de Vercel

## 📁 Estructura del Proyecto

```
├── components/          # Componentes React reutilizables
│   ├── auth/           # Componentes de autenticación
│   ├── layout/         # Componentes de layout
│   └── ui/             # Componentes de UI base
├── lib/                # Utilidades y configuración
│   ├── auth/           # Configuración de autenticación
│   └── hooks/          # Custom hooks
├── pages/              # Páginas de Next.js
│   ├── api/            # API routes
│   └── ...             # Páginas de la aplicación
├── prisma/             # Esquema y migraciones de Prisma
├── styles/             # Estilos globales
├── types/              # Definiciones de tipos TypeScript
└── __tests__/          # Pruebas unitarias
```

## 🔧 Tecnologías Utilizadas

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS, Radix UI
- **Backend**: Next.js API Routes
- **Base de datos**: PostgreSQL, Prisma ORM
- **Autenticación**: Better Auth
- **Testing**: Jest, Testing Library
- **Documentación**: Swagger UI
- **Deployment**: Vercel

## 📚 Documentación de la API

Una vez que la aplicación esté ejecutándose, puedes acceder a la documentación de la API en:

- **Desarrollo**: [http://localhost:3000/docs](http://localhost:3000/docs)
- **Producción**: `https://tu-dominio.vercel.app/docs`
