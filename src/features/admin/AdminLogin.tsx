import { useEffect, useState, type CSSProperties, type FormEvent } from "react";

import palette from "../../brand/tokens.json";
import { VoomaMark } from "../../brand/VoomaMark";
import { loginCss } from "./loginStyles";
import {
  requestAdminOtp,
  verifyAdminOtp,
  type AdminAuthResult,
  type AdminOtpChallenge,
} from "./auth";

function ArrowIcon() {
  return (
    <svg
      className="login-arrow"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M4 12h16m-7-7 7 7-7 7"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

interface AdminLoginProps {
  onAuthenticated: (result: AdminAuthResult) => void;
}

export function AdminLogin({ onAuthenticated }: AdminLoginProps) {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [challenge, setChallenge] = useState<AdminOtpChallenge | null>(null);
  const [busy, setBusy] = useState(false);
  const [localMessage, setLocalMessage] = useState("");
  const [resendWait, setResendWait] = useState(0);

  useEffect(() => {
    document.title = "Sign in | Vooma Admin";
  }, []);

  useEffect(() => {
    if (!challenge) {
      setResendWait(0);
      return;
    }
    const updateWait = () =>
      setResendWait(
        Math.max(0, Math.ceil((challenge.resendAt - Date.now()) / 1000)),
      );
    updateWait();
    const interval = window.setInterval(updateWait, 1000);
    return () => window.clearInterval(interval);
  }, [challenge]);

  async function requestCode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setLocalMessage("");
    try {
      const result = await requestAdminOtp(email);
      setChallenge(result);
    } catch (error) {
      setLocalMessage(
        error instanceof Error
          ? error.message
          : "Unable to request a sign-in code.",
      );
    } finally {
      setBusy(false);
    }
  }

  async function resendCode() {
    setBusy(true);
    setLocalMessage("");
    try {
      const result = await requestAdminOtp(email);
      setChallenge(result);
      setCode("");
    } catch (error) {
      setLocalMessage(
        error instanceof Error ? error.message : "Unable to resend the code.",
      );
    } finally {
      setBusy(false);
    }
  }

  async function verifyCode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!challenge) return;
    setBusy(true);
    setLocalMessage("");
    try {
      onAuthenticated(await verifyAdminOtp(challenge.challengeId, code));
    } catch (error) {
      setLocalMessage(
        error instanceof Error ? error.message : "Unable to verify the code.",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      className="admin-login"
      style={
        {
          "--navy": palette.navy,
          "--ink": palette.ink,
          "--muted": palette.muted,
          "--line": palette.line,
          "--tint": palette.tint,
          "--sky": palette.sky,
          "--orange": palette.orange,
          "--error": palette.error,
        } as CSSProperties
      }
    >
      <style>{loginCss}</style>
      <aside className="login-story">
        <div className="login-brand">
          <VoomaMark />
          <span className="login-wordmark">vooma</span>
          <span className="login-brand-divider" aria-hidden="true" />
          <span className="login-console">ADMIN CONSOLE</span>
        </div>
        <div className="login-story-copy">
          <h2>
            Every operation.
            <br />
            One console.
          </h2>
          <p>
            Manage your drivers, passengers and daily operations with a clear
            view of what matters.
          </p>
        </div>
        <img
          className="login-illustration"
          src={import.meta.env.BASE_URL + "images/admin-city.webp"}
          alt=""
          width="1254"
          height="1254"
          fetchPriority="high"
        />
      </aside>
      <main className="login-main">
        <div className="login-card">
          <span className="login-eyebrow">ADMINISTRATOR ACCESS</span>
          <h1>Welcome back.</h1>
          <p className="login-subtitle">Sign in with your Vooma admin email.</p>
          {localMessage && (
            <p className="login-feedback" role="alert">
              {localMessage}
            </p>
          )}
          {!challenge ? (
            <form onSubmit={(event) => void requestCode(event)}>
              <label className="login-field-label" htmlFor="admin-email">
                Admin email
              </label>
              <input
                id="admin-email"
                type="email"
                autoComplete="email"
                maxLength={254}
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@vooma.co.za"
              />
              <button className="login-submit" type="submit" disabled={busy}>
                {busy ? "Sending code…" : "Send sign-in code"}
                <ArrowIcon />
              </button>
            </form>
          ) : (
            <form onSubmit={(event) => void verifyCode(event)}>
              <label className="login-field-label" htmlFor="admin-code">
                Six-digit code sent to {email}
              </label>
              <input
                id="admin-code"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                pattern="[0-9]{6}"
                maxLength={6}
                required
                value={code}
                onChange={(event) =>
                  setCode(event.target.value.replace(/\D/g, "").slice(0, 6))
                }
                placeholder="000000"
              />
              <button
                className="login-submit"
                type="submit"
                disabled={busy || code.length !== 6}
              >
                {busy ? "Verifying…" : "Verify and sign in"}
                <ArrowIcon />
              </button>
              <button
                className="login-change-email"
                type="button"
                disabled={busy || resendWait > 0}
                onClick={() => void resendCode()}
              >
                {resendWait > 0
                  ? `Send another code in ${resendWait}s`
                  : "Send another code"}
              </button>
              <button
                className="login-change-email"
                type="button"
                disabled={busy}
                onClick={() => {
                  setChallenge(null);
                  setCode("");
                  setLocalMessage("");
                }}
              >
                Use a different email
              </button>
            </form>
          )}
          <p className="login-access-note">
            Admin access is limited to email addresses approved by Vooma.
          </p>
        </div>
      </main>
    </div>
  );
}
