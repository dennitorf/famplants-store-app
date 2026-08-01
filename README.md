# FamPlants Online Store

Public FamPlants web experience for browsing plants, plant families, and products, plus an authenticated workspace for managing personal gardens.

## Local configuration

The application currently contains temporary development fallbacks for the Auth0 Regular Web Application used by the FamPlants admin app. Environment variables override every fallback and should replace them before production use. The development API gateway defaults to:

```text
https://famplants.korat-in.ts.net
```

Auth0 must allow these local application URLs:

```text
http://localhost:3000/auth/callback
http://localhost:3000
```

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Validation

```bash
npm run lint
npm run build
```

Plants, families, and products use public API endpoints. Garden data and mutations use the Auth0 access token for the FamPlants API audience.
