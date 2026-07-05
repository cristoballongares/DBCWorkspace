# DBCWorkspace

Herramienta privada de entrenamiento para un equipo de 3 personas (Cristobal, Briana, David) que compiten en ICPC. No es un producto publico. Registro solo por invitacion generada manualmente desde el panel de admin.

## Stack

- Next.js 14+ (App Router)
- PostgreSQL + Prisma ORM
- Auth.js (invitacion, sin registro publico)
- Tiptap (editor con LaTeX y bloques de codigo)
- Vercel Blob (storage de archivos)
- Despliegue en Vercel

## Setup local

```bash
git clone <repo>
cd dbcworkspace
npm install
cp .env.example .env.local   # completar valores
npx prisma migrate dev
npm run prisma:seed
npm run dev
```

## Estructura del proyecto

- `src/app` — rutas de Next.js (App Router), agrupadas en `(auth)`, `(dashboard)`, `(contest)`, `api`
- `src/components` — UI compartida (`ui/`, `editor/`, `problems/`, `contest/`, `charts/`)
- `src/lib` — utilidades tecnicas (Prisma client, Auth.js config, Blob helpers, validaciones)
- `src/services` — logica de negocio (calculo de penalizacion ICPC, rating, changelog)
- `prisma` — esquema y seed de base de datos

## Flujo de Git

- `main` -> produccion (Vercel), `dev` -> staging (Vercel preview)
- Todo desarrollo sale de `dev` en ramas `feat/`, `fix/`, `chore/`, `docs/`
- PR de la feature branch hacia `dev`; PR de `dev` hacia `main` solo cuando `dev` este estable
- Conventional Commits obligatorio (`feat(scope): ...`, `fix(scope): ...`, etc.)
- Un commit por unidad atomica de trabajo

## Modo Contest

Interfaz separada del resto de la app (`src/app/(contest)`), pantalla completa, sin navegacion lateral, inspirada funcionalmente en PC² (el judge real de ICPC): penalizacion de 20 minutos por intento fallido, freeze de scoreboard en la ultima hora, ranking estilo ICPC.
