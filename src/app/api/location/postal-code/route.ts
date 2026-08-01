import { NextRequest, NextResponse } from "next/server";

interface ReverseGeocodeResponse {
  address?: {
    postcode?: string;
    country_code?: string;
  };
}

export async function GET(request: NextRequest) {
  const latitude = Number(request.nextUrl.searchParams.get("latitude"));
  const longitude = Number(request.nextUrl.searchParams.get("longitude"));
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)
    || latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
    return NextResponse.json({ message: "Valid coordinates are required." }, { status: 400 });
  }

  const endpoint = new URL(process.env.REVERSE_GEOCODING_URL ?? "https://nominatim.openstreetmap.org/reverse");
  endpoint.searchParams.set("format", "jsonv2");
  endpoint.searchParams.set("addressdetails", "1");
  endpoint.searchParams.set("zoom", "18");
  endpoint.searchParams.set("lat", latitude.toFixed(5));
  endpoint.searchParams.set("lon", longitude.toFixed(5));

  const response = await fetch(endpoint, {
    headers: {
      Accept: "application/json",
      "Accept-Language": "en-US,en;q=0.8",
      "User-Agent": "FamPlantsStore/1.0 (https://famplants-store-app.vercel.app)",
    },
    next: { revalidate: 86400 },
  });
  if (!response.ok) {
    return NextResponse.json({ message: "The postal code could not be resolved." }, { status: 502 });
  }

  const result = await response.json() as ReverseGeocodeResponse;
  if (result.address?.country_code?.toLowerCase() !== "us") {
    return NextResponse.json({ message: "Hardiness-zone lookup currently supports U.S. postal codes." }, { status: 404 });
  }
  const postalCode = result.address.postcode?.match(/\b\d{5}\b/)?.[0];
  if (!postalCode) {
    return NextResponse.json({ message: "No postal code was found for this location." }, { status: 404 });
  }

  return NextResponse.json({ postalCode, attribution: "© OpenStreetMap contributors" });
}
