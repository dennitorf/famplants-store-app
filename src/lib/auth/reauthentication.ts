import {
  AccessTokenError,
  AccessTokenErrorCode,
} from "@auth0/nextjs-auth0/errors";

export function requiresReauthentication(error: unknown): boolean {
  if (!(error instanceof AccessTokenError)) {
    return false;
  }

  return (
    error.code === AccessTokenErrorCode.MISSING_REFRESH_TOKEN ||
    error.code === AccessTokenErrorCode.FAILED_TO_REFRESH_TOKEN ||
    error.code === AccessTokenErrorCode.SESSION_EXPIRED
  );
}
