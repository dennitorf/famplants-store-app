export const dynamic = "force-dynamic";

// Use the Play App Signing certificate, not the upload-key certificate.
export function GET() {
  const fingerprints = (process.env.ANDROID_APP_SHA256_FINGERPRINTS ?? "")
    .split(",").map((value) => value.trim().toUpperCase()).filter(Boolean);
  if (!fingerprints.length || fingerprints.some((value) => !/^(?:[0-9A-F]{2}:){31}[0-9A-F]{2}$/.test(value))) {
    return Response.json({ error: "Android app signing fingerprints are not configured." }, {
      status: 503, headers: { "Cache-Control": "no-store" },
    });
  }
  return Response.json([{
    relation: ["delegate_permission/common.handle_all_urls"],
    target: {
      namespace: "android_app",
      package_name: process.env.ANDROID_APP_PACKAGE?.trim() || "com.famplants.app",
      sha256_cert_fingerprints: fingerprints,
    },
  }], { headers: { "Cache-Control": "public, max-age=3600" } });
}
