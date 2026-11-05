export interface AdminSession {
  authenticated: true;
  subject: string;
}

export interface AdminAuthResult {
  accessToken: string;
  expiresAt: number;
  session: AdminSession;
}

export interface AdminOtpChallenge {
  challengeId: string;
  expiresAt: number;
  resendAt: number;
  delivery: "provider" | "localTest";
}

function apiBaseUrl() {
  const baseUrl = new URL(
    import.meta.env.VITE_API_BASE_URL?.trim() || "http://localhost:4000",
  );
  const localHttp =
    baseUrl.protocol === "http:" &&
    ["localhost", "127.0.0.1", "::1"].includes(baseUrl.hostname);
  if (baseUrl.protocol !== "https:" && !(import.meta.env.DEV && localHttp)) {
    throw new Error("The Vooma API must use HTTPS outside local development.");
  }
  return baseUrl.href.replace(/\/$/, "");
}

async function post<T>(path: string, body: unknown): Promise<T> {
  let response: Response;
  try {
    response = await fetch(apiBaseUrl() + path, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      cache: "no-store",
      credentials: "omit",
    });
  } catch {
    throw new Error("Unable to reach the Vooma API. Check that it is running.");
  }
  if (!response.ok) {
    if (response.status === 400)
      throw new Error("Enter a valid email address or code.");
    if (response.status === 401)
      throw new Error(
        "That code is invalid or has expired. Request a new one.",
      );
    if (response.status === 429)
      throw new Error("Too many attempts. Wait a moment and try again.");
    if (response.status === 503)
      throw new Error(
        "Email delivery is unavailable. Check the local API and Mailpit services.",
      );
    throw new Error("Admin sign-in failed. Try again.");
  }
  return (await response.json()) as T;
}

export function requestAdminOtp(email: string) {
  return post<AdminOtpChallenge>("/v1/admin/auth/otp/request", { email });
}

export async function verifyAdminOtp(
  challengeId: string,
  code: string,
): Promise<AdminAuthResult> {
  const token = await post<{
    accessToken: string;
    expiresAt: number;
    verifiedChannel: "email";
  }>("/v1/admin/auth/otp/verify", { challengeId, code });
  let response: Response;
  try {
    response = await fetch(apiBaseUrl() + "/v1/admin/session", {
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + token.accessToken,
      },
      cache: "no-store",
      credentials: "omit",
    });
  } catch {
    throw new Error("Unable to verify your admin session with the Vooma API.");
  }
  if (!response.ok)
    throw new Error("Your admin sign-in could not be verified.");
  const session = (await response.json()) as AdminSession;
  if (session.authenticated !== true || typeof session.subject !== "string")
    throw new Error("The Vooma API returned an invalid admin session.");
  return {
    accessToken: token.accessToken,
    expiresAt: token.expiresAt,
    session,
  };
}

export async function logoutAdmin(accessToken: string) {
  try {
    await fetch(apiBaseUrl() + "/v1/admin/session/logout", {
      method: "POST",
      headers: { Authorization: "Bearer " + accessToken },
      cache: "no-store",
      credentials: "omit",
    });
  } catch {
    // Clear the browser-held token even if the API cannot be reached.
  }
}
