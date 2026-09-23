// Public verification endpoint: must not require login or redirect.
export function GET() {
  const appId = process.env.IOS_APP_ID?.trim() || "Z435A22CN4.com.famplants.app";
  return Response.json({
    applinks: {
      apps: [],
      details: [{
        appID: appId,
        paths: ["NOT /plants/tags/*", "NOT /products/tags/*", "NOT /products/categories/*", "/plants/*", "/products/*"],
      }],
    },
  }, { headers: { "Cache-Control": "public, max-age=3600" } });
}
