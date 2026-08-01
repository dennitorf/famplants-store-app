export const apiBaseUrl = (
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://famplants.korat-in.ts.net"
).replace(/\/$/, "");
