# Plataforma de Entrenamiento ICPC

Una plataforma integral diseñada para la gestión, entrenamiento y seguimiento de competidores de programación competitiva (ICPC).

## Características Principales

- **Dashboard**: Vista general de la actividad reciente, tareas públicas y calendario de eventos.
- **Problemas**: Base de datos de problemas con etiquetas, niveles de dificultad y enlaces a diferentes jueces (Codeforces, CSES, etc.).
- **Soluciones y Editoriales**: Espacio para redactar y guardar soluciones utilizando un editor de texto enriquecido (Markdown + KaTeX).
- **Entrenamientos**: Gestión de calendarios de entrenamiento, sesiones y seguimiento de asistencia.
- **Temas**: Jerarquía de temas y subtemas para organizar el aprendizaje.

## Tecnologías Utilizadas

- **Frontend**: Next.js 14 (App Router), React, Tailwind CSS
- **Componentes**: Base UI, Radix UI, Lucide Icons
- **Backend & Base de Datos**: Prisma ORM, PostgreSQL (Neon)
- **Autenticación**: NextAuth.js (Credenciales cifradas con bcrypt)

## Despliegue

Este proyecto está optimizado para ser desplegado en **Vercel**.

1. Importa el repositorio en Vercel.
2. Configura las siguientes variables de entorno:
   - `DATABASE_URL`: URL principal de PostgreSQL.
   - `DIRECT_URL`: URL directa (sin pooling) para migraciones de Prisma.
   - `AUTH_SECRET`: Cadena aleatoria segura para cifrar sesiones.
   - `NEXTAUTH_URL`: URL pública de la aplicación.
3. El comando de instalación recomendado es `npm install --legacy-peer-deps`.
4. Vercel ejecutará automáticamente la construcción (`npm run build`).
