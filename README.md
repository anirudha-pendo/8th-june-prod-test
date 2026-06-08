# Multi-Tenant Notes Starter

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fanirudha-pendo%2Fmulti-tenant-notes-starter&project-name=multi-tenant-notes-starter&repository-name=multi-tenant-notes-starter&env=DATABASE_URL,BETTER_AUTH_SECRET,BETTER_AUTH_URL&envDescription=MongoDB%20connection%20string%20and%20Better%20Auth%20runtime%20configuration)

A polished Next.js starter for authenticated, organization-aware note taking. The first version focuses on account setup, organization profile settings, and personal notes with a TipTap editing surface.

## Stack

- Next.js App Router
- Better Auth
- MongoDB with the Better Auth Mongo adapter
- TanStack React Query
- TipTap editor
- shadcn/ui
- Hugeicons
- Geist and Geist Mono

## Features

- Email and password authentication
- User profile settings
- Organization name settings
- Notes CRUD
- Rich text editing with TipTap
- Responsive product UI with a desktop sidebar and mobile header

Inviting other users and collaborative note editing are intentionally out of scope for v1.

## Getting Started

Install dependencies:

```bash
pnpm install
```

Create or update the shared environment file:

```bash
cp .env.example .env
```

Required environment variables:

```bash
DATABASE_URL=mongodb+srv://<user>:<password>@<cluster>/<database>
BETTER_AUTH_SECRET=<generate-with-openssl-rand-base64-32>
BETTER_AUTH_URL=http://localhost:5173
```

Run the development server:

```bash
pnpm dev
```

Open [http://localhost:5173](http://localhost:5173).

## Scripts

```bash
pnpm dev      # Start Next.js on port 5173
pnpm build    # Create a production build
pnpm start    # Start the production server
pnpm lint     # Run ESLint
```

## Deployment

Use the **Deploy with Vercel** button above, then add these environment variables in Vercel:

- `DATABASE_URL`
- `BETTER_AUTH_SECRET`
- `BETTER_AUTH_URL`

For production, set `BETTER_AUTH_URL` to the deployed Vercel URL, for example:

```bash
BETTER_AUTH_URL=https://your-project.vercel.app
```

MongoDB Atlas must allow connections from Vercel. For quick test deployments, you can allow access from anywhere in Atlas network settings; for production, use the tighter access model that matches your deployment setup.
