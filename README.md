# QFLOW

The AI-powered business OS for freelance web developers — AI proposal generation,
scope-creep detection, contracts, invoices, and client portals.

## Stack

| Layer            | Tech                                                        |
| ---------------- | ----------------------------------------------------------- |
| Frontend         | React 18 · Vite · Tailwind CSS · shadcn/ui · React Router v6 |
| Backend          | Node.js 20 · Express (deployed to a Contabo VPS)            |
| Database / Auth  | Supabase (PostgreSQL · Auth · Storage)                     |
| AI               | Anthropic Claude (`@anthropic-ai/sdk`)                     |

## Repository layout

```
qflow-app/
├── frontend/                 # React + Vite SPA
│   ├── src/
│   │   ├── pages/            # Route components (public + /app/*)
│   │   ├── components/       # AppLayout, shared UI
│   │   ├── lib/             # supabase.js, utils.js (cn helper)
│   │   ├── hooks/           # useAuth, ...
│   │   └── api/             # backend fetch client
│   ├── .env.local           # VITE_ env vars (gitignored)
│   ├── tailwind.config.js
│   └── vite.config.js
├── backend/                  # Express API
│   ├── routes/              # health.js, proposals.js
│   ├── middleware/          # auth.js
│   ├── services/            # anthropic.js
│   ├── .env                 # server env vars (gitignored)
│   └── server.js
└── README.md
```

## Prerequisites

- Node.js 20+
- A Supabase project (URL + anon key)
- An Anthropic API key (for AI features)

## Frontend — setup

```bash
cd frontend
npm install
cp .env.example .env.local   # then fill in your Supabase values
npm run dev                  # http://localhost:5173
```

`.env.local`:

```
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
VITE_API_URL=http://localhost:8080
```

Other scripts: `npm run build`, `npm run preview`, `npm run lint`.

### Adding shadcn/ui components

The `cn()` helper, `components.json`, and the `@` path alias are pre-wired:

```bash
cd frontend
npx shadcn@latest add button card input
```

## Backend — setup

```bash
cd backend
npm install
cp .env.example .env         # then fill in your keys
npm run dev                  # http://localhost:8080  (node --watch)
```

`.env`:

```
PORT=8080
FRONTEND_URL=https://qflow.vercel.app
ANTHROPIC_API_KEY=sk-ant-...
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

Health check:

```bash
curl http://localhost:8080/health
# { "status": "ok", "service": "qflow-api", ... }
```

CORS is allowlisted for `http://localhost:5173` and whatever `FRONTEND_URL` is set to.

## Routes

| Path               | Page             |
| ------------------ | ---------------- |
| `/`                | Landing          |
| `/login`           | Login            |
| `/signup`          | Signup           |
| `/app/dashboard`   | Dashboard        |
| `/app/proposals`   | Proposals (AI)   |
| `/app/scope-creep` | Scope Creep (AI) |
| `/app/clients`     | Clients          |
| `/app/invoices`    | Invoices         |
| `/app/contracts`   | Contracts        |
| `/app/revenue`     | Revenue          |
| `/app/settings`    | Settings         |

## Deploying the frontend to Vercel

1. Push this repo to GitHub.
2. In Vercel: **Add New → Project**, import the repo.
3. Set **Root Directory** to `frontend`.
4. Framework preset: **Vite** (Build `npm run build`, Output `dist`).
5. Add env vars `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_API_URL`.
6. Deploy. `frontend/vercel.json` rewrites all paths to `index.html` so
   React Router deep links work.

The backend deploys separately to the Contabo VPS (e.g. behind nginx + pm2);
remember to set `FRONTEND_URL` to the Vercel URL so CORS allows it.

## Design system

Color tokens live as CSS variables in `frontend/src/index.css` and are mirrored
in `tailwind.config.js`, so use `bg-qf-surface`, `text-qf-text2`,
`border-qf-border`, etc. Fonts: **Syne** (headings), **JetBrains Mono**
(labels/code), **DM Sans** (body).
