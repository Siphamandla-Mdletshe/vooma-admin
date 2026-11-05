import { useEffect, useState, type CSSProperties } from "react";

import palette from "../../brand/tokens.json";
import { VoomaMark } from "../../brand/VoomaMark";
import { loginCss } from "./loginStyles";

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

export function AdminLogin({ onPreview }: { onPreview: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    document.title = "Sign in | Vooma Admin";
  }, []);

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
          src={`${import.meta.env.BASE_URL}images/admin-city.webp`}
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
          <p className="login-subtitle">Sign in to your Vooma admin account.</p>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              setMessage(
                "Admin sign-in is not connected yet. You can explore the dashboard preview below using sample data.",
              );
            }}
          >
            <label htmlFor="admin-email">Email address</label>
            <div className="login-input-wrap">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <path d="m4 7 8 6 8-6" />
              </svg>
              <input
                id="admin-email"
                name="email"
                type="email"
                autoComplete="username"
                placeholder="you@company.com"
                required
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  setMessage("");
                }}
              />
            </div>
            <label htmlFor="admin-password">Password</label>
            <div className="login-password">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <rect x="4" y="10" width="16" height="11" rx="2" />
                <path d="M8 10V7a4 4 0 1 1 8 0v3" />
              </svg>
              <input
                id="admin-password"
                name="password"
                type={visible ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Enter your password"
                required
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);
                  setMessage("");
                }}
              />
              <button
                type="button"
                aria-label={visible ? "Hide password" : "Show password"}
                aria-pressed={visible}
                onClick={() => setVisible(!visible)}
              >
                {visible ? "Hide" : "Show"}
              </button>
            </div>
            {message && (
              <p className="login-feedback" role="alert">
                {message}
              </p>
            )}
            <button className="login-submit" type="submit">
              Sign in <ArrowIcon />
            </button>
          </form>
          <p className="login-access-note">
            Need access? Contact your Vooma administrator.
          </p>
          <div className="login-preview">
            <span className="login-preview-label">SCREEN PREVIEW</span>
            <p>Explore the admin screens with sample data.</p>
            <button type="button" onClick={onPreview}>
              Explore demo dashboard <ArrowIcon />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
