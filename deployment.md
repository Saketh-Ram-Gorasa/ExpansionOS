# ExpansionOS Deployment Guide

## Backend endpoints

- `GET /api/health` — service status + dependency readiness
- `POST /api/analyze` — core agent chain analysis
- `GET /api/analyze` — request/response contract summary

## Environment variables

Create `.env.local` (dev) or set host environment variables:

- `OPENAI_API_KEY` (required for live agent calls)
- `OPENAI_CHAT_MODEL` (optional, default `gpt-4.1-mini`)
- `OPENAI_SUMMARY_MODEL` (optional, default `gpt-4.1`)
- `CRUSTDATA_API_KEY` (optional, if you have CrustData)
- `CRUSTDATA_MARKET_ENDPOINT` (optional, endpoint to fetch real market signals)

Example:

```bash
cp .env.example .env.local
```

## Run locally

```bash
npm install
npm run build
npm start
```

Service runs on `http://localhost:3000` by default.

## Vercel (recommended)

1. Push repo to GitHub.
2. Import project in Vercel.
3. Framework preset: `Next.js`.
4. Set environment variables from above.
5. Deploy.
6. Verify with:

```bash
curl https://YOUR_APP_URL/api/health
curl -X POST https://YOUR_APP_URL/api/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "productDescription":"AI workflow software for compliance teams",
    "currentIcp":{"industry":["fintech"],"companySize":"seed-to-series-b","buyerRoles":["Compliance Lead"]}
  }'
```

## Docker (self-hosted or Render/other host)

Build and run:

```bash
docker build -t expansionos-backend .
docker run --env-file .env.local -p 3000:3000 expansionos-backend
```

For Render, point build to Dockerfile and pass the same environment variables.

## Judge-safe smoke test

Before sharing with judges:

```bash
curl https://YOUR_APP_URL/api/health
curl -X POST https://YOUR_APP_URL/api/analyze -H "Content-Type: application/json" \
  -d '{"productDescription":"AI workflow software for compliance teams","currentIcp":{"industry":["fintech"]}}'
```

Expected: valid JSON payload with `market_scout`, `wedge_agent`, `memo_agent`.
