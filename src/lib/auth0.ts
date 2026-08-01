import { Auth0Client } from "@auth0/nextjs-auth0/server";

const developmentAuth0 = {
  domain: "dev-dcpilwgmwxkfk7kz.us.auth0.com",
  clientId: "FBfrHI7rNi5gfG5P38Mv14m8RSZCmgXs",
  clientSecret: "SkrhFxYu6tMJQ0Gen3yCuV3WtQ9AVPeCITCTLNlaW5GjiMbzf2BRHD_YTkGtRB-V",
  secret: "fca2a29423ababacc418cd4e7aeee827a21a0eec6e958980c0208edcbd1fdc10",
  audience: "https://famplants.korat-in.ts.net",
};

export const auth0Audience =
  process.env.AUTH0_AUDIENCE?.trim() || developmentAuth0.audience;

export const auth0 = new Auth0Client({
  domain: process.env.AUTH0_DOMAIN?.trim() || developmentAuth0.domain,
  clientId: process.env.AUTH0_CLIENT_ID?.trim() || developmentAuth0.clientId,
  clientSecret:
    process.env.AUTH0_CLIENT_SECRET?.trim() || developmentAuth0.clientSecret,
  secret: process.env.AUTH0_SECRET?.trim() || developmentAuth0.secret,
  appBaseUrl: process.env.APP_BASE_URL?.trim() || undefined,
  authorizationParameters: {
    scope: "openid profile email offline_access",
    audience: auth0Audience,
  },
});
