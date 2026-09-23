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

Copy `.env.local.example` to `.env.local` and set
`NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` to the Stripe test-mode publishable key.
Stripe secret and webhook-signing keys belong only in the Orders API runtime
environment.

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

### Open shared catalog links in the mobile app

The public `/.well-known/apple-app-site-association` and
`/.well-known/assetlinks.json` endpoints associate this website with FamPlants.
They bypass Auth0 middleware. Set `ANDROID_APP_SHA256_FINGERPRINTS` in Vercel to
the comma-separated SHA-256 fingerprints of the production **app-signing**
certificates (Play Console → App integrity; not the upload key). Without this
configuration the Android endpoint returns 503 deliberately. `ANDROID_APP_PACKAGE`
defaults to `com.famplants.app`. `IOS_APP_ID` defaults to the project identity
`Z435A22CN4.com.famplants.app`; verify against the released app's application identifier.

Deploy these endpoints on `https://famplants-store-app.vercel.app`, then release
the mobile app with its Android intent filter and iOS Associated Domains
entitlement. Enable Associated Domains for the Apple App ID/provisioning profile.
Existing installed app versions need an update to support these links.

Test a `/plants/{slug}` and `/products/{slug}` link tapped from a message with
and without the updated app installed, with the app closed and already running.
When sign-in is needed, the app retains the destination until sign-in completes.
The OS chooses the app or browser; browser preferences, typing/pasting a URL,
and same-domain Safari navigation may keep a link on the web. There is no
browser installation probe or timed redirect. Normal website pages stay available.
If the storefront domain changes, update both native domain declarations and
`STORE_BASE_URL`, and host the association endpoints on the new domain.
