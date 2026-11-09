import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type FormEvent,
} from "react";

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

function EmailIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="5" width="18" height="14" rx="3" />
      <path d="m4 7 8 6 8-6" />
    </svg>
  );
}

interface AdminLoginProps {
  onAuthenticated: (result: AdminAuthResult) => void;
}

function CodeInput({
  digits,
  onChange,
  disabled,
}: {
  digits: string[];
  onChange: (digits: string[]) => void;
  disabled: boolean;
}) {
  const inputs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    inputs.current[0]?.focus();
  }, []);

  function enterDigits(index: number, value: string) {
    const entered = value.replace(/\D/g, "").slice(0, 6);
    if (!entered) {
      if (!value)
        onChange(digits.map((digit, i) => (i === index ? "" : digit)));
      return;
    }
    const start = entered.length === 6 ? 0 : index;
    const next = [...digits];
    for (let i = 0; i < entered.length && start + i < 6; i++) {
      next[start + i] = entered[i];
    }
    onChange(next);
    inputs.current[Math.min(start + entered.length, 5)]?.focus();
  }

  return (
    <div
      className="login-code-inputs"
      role="group"
      aria-labelledby="admin-code-label"
    >
      {digits.map((digit, index) => (
        <input
          key={index}
          ref={(element) => {
            inputs.current[index] = element;
          }}
          id={`admin-code-${index}`}
          aria-label={`Digit ${index + 1} of 6`}
          type="text"
          inputMode="numeric"
          autoComplete={index === 0 ? "one-time-code" : "off"}
          pattern="[0-9]"
          required
          disabled={disabled}
          value={digit}
          onFocus={(event) => event.currentTarget.select()}
          onChange={(event) => enterDigits(index, event.target.value)}
          onPaste={(event) => {
            event.preventDefault();
            enterDigits(index, event.clipboardData.getData("text"));
          }}
          onKeyDown={(event) => {
            if (event.ctrlKey || event.metaKey || event.altKey) return;
            if (/^[0-9]$/.test(event.key)) {
              event.preventDefault();
              enterDigits(index, event.key);
            } else if (event.key === "Backspace" || event.key === "Delete") {
              event.preventDefault();
              const target =
                event.key === "Backspace" && !digit
                  ? Math.max(0, index - 1)
                  : index;
              onChange(digits.map((value, i) => (i === target ? "" : value)));
              inputs.current[target]?.focus();
            } else if (
              event.key === "ArrowLeft" ||
              event.key === "ArrowRight"
            ) {
              event.preventDefault();
              const target = Math.max(
                0,
                Math.min(5, index + (event.key === "ArrowLeft" ? -1 : 1)),
              );
              inputs.current[target]?.focus();
            }
          }}
        />
      ))}
    </div>
  );
}

export function AdminLogin({ onAuthenticated }: AdminLoginProps) {
  const [email, setEmail] = useState("");
  const [codeDigits, setCodeDigits] = useState<string[]>(Array(6).fill(""));
  const [challenge, setChallenge] = useState<AdminOtpChallenge | null>(null);
  const [operation, setOperation] = useState<"sending" | "verifying" | null>(
    null,
  );
  const operationRef = useRef<typeof operation>(null);
  const requestVersion = useRef(0);
  const busy = operation !== null;
  const [localMessage, setLocalMessage] = useState("");
  const [resendWait, setResendWait] = useState(0);
  const [verifiedAuth, setVerifiedAuth] = useState<AdminAuthResult | null>(
    null,
  );

  useEffect(() => {
    document.title = "Sign in | Vooma Admin";
    return () => {
      requestVersion.current += 1;
    };
  }, []);

  useEffect(() => {
    document.title = challenge
      ? "Verify your email | Vooma Admin"
      : "Sign in | Vooma Admin";
  }, [challenge]);

  useEffect(() => {
    if (!verifiedAuth) return;
    const version = requestVersion.current;
    const timer = window.setTimeout(() => {
      if (version === requestVersion.current) onAuthenticated(verifiedAuth);
    }, 1200);
    return () => window.clearTimeout(timer);
  }, [verifiedAuth, onAuthenticated]);

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

  function beginOperation(next: "sending" | "verifying") {
    operationRef.current = next;
    setOperation(next);
    setLocalMessage("");
    setVerifiedAuth(null);
    return ++requestVersion.current;
  }

  function finishOperation(version: number) {
    if (version !== requestVersion.current) return;
    operationRef.current = null;
    setOperation(null);
  }

  async function requestCode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (operationRef.current) return;
    const version = beginOperation("sending");
    try {
      const result = await requestAdminOtp(email);
      if (version !== requestVersion.current) return;
      setChallenge(result);
    } catch (error) {
      if (version !== requestVersion.current) return;
      setLocalMessage(
        error instanceof Error
          ? error.message
          : "Unable to request a sign-in code.",
      );
    } finally {
      finishOperation(version);
    }
  }

  async function resendCode() {
    if (
      operationRef.current === "sending" ||
      !challenge ||
      challenge.resendAt > Date.now()
    )
      return;
    const version = beginOperation("sending");
    setCodeDigits(Array(6).fill(""));
    try {
      const result = await requestAdminOtp(email);
      if (version !== requestVersion.current) return;
      setChallenge(result);
    } catch (error) {
      if (version !== requestVersion.current) return;
      setLocalMessage(
        error instanceof Error ? error.message : "Unable to resend the code.",
      );
    } finally {
      finishOperation(version);
    }
  }

  async function verifyCode(code: string) {
    if (
      !challenge ||
      !/^[0-9]{6}$/.test(code) ||
      operationRef.current ||
      verifiedAuth
    )
      return;
    const version = beginOperation("verifying");
    try {
      const result = await verifyAdminOtp(challenge.challengeId, code);
      if (version !== requestVersion.current) return;
      setVerifiedAuth(result);
    } catch (error) {
      if (version !== requestVersion.current) return;
      setLocalMessage(
        error instanceof Error ? error.message : "Unable to verify the code.",
      );
    } finally {
      finishOperation(version);
    }
  }

  return (
    <div
      className={`admin-login${challenge ? " login-verification" : ""}`}
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
        <div className={`login-card${challenge ? " verification-card" : ""}`}>
          {challenge ? (
            <header className="verification-header">
              <div className="verification-icon">
                <EmailIcon />
              </div>
              <h1>Verify your email</h1>
              <p className="login-subtitle">
                We’ve sent a 6-digit verification code to
              </p>
              <div className="verification-email">
                <EmailIcon />
                <strong>{email}</strong>
              </div>
            </header>
          ) : (
            <>
              <span className="login-eyebrow">ADMINISTRATOR ACCESS</span>
              <h1>Welcome back.</h1>
              <p className="login-subtitle">
                Sign in with your Vooma admin email.
              </p>
            </>
          )}
          {!challenge && localMessage && (
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
            <form
              className="verification-form"
              onSubmit={(event) => {
                event.preventDefault();
                if (verifiedAuth) onAuthenticated(verifiedAuth);
                else void verifyCode(codeDigits.join(""));
              }}
            >
              <label
                className="verification-code-label"
                id="admin-code-label"
                htmlFor="admin-code-0"
              >
                Six-digit verification code
              </label>
              <CodeInput
                key={challenge.challengeId}
                digits={codeDigits}
                onChange={(digits) => {
                  if (operationRef.current || verifiedAuth) return;
                  setCodeDigits(digits);
                  setLocalMessage("");
                  if (digits.every((digit) => /^[0-9]$/.test(digit))) {
                    void verifyCode(digits.join(""));
                  }
                }}
                disabled={busy || !!verifiedAuth}
              />
              <div className="verification-status">
                {localMessage ? (
                  <p className="verification-error" role="alert">
                    {localMessage}
                  </p>
                ) : (
                  <p
                    className={`login-code-status${verifiedAuth ? " verified" : ""}`}
                    role="status"
                  >
                    {verifiedAuth ? (
                      <>
                        <svg viewBox="0 0 24 24" aria-hidden="true">
                          <circle cx="12" cy="12" r="11" fill="#25c915" />
                          <path
                            d="m7 12 3 3 7-7"
                            fill="none"
                            stroke="white"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        Code verified successfully!
                      </>
                    ) : operation === "verifying" ? (
                      "Verifying code…"
                    ) : operation === "sending" ? (
                      "Sending another code…"
                    ) : (
                      ""
                    )}
                  </p>
                )}
              </div>
              <button
                className="login-submit verification-continue"
                type="submit"
                disabled={busy || codeDigits.some((digit) => !digit)}
              >
                {operation === "verifying" ? "Verifying…" : "Continue"}
                <ArrowIcon />
              </button>
              <div className="verification-resend">
                <p>Didn’t receive the code?</p>
                <button
                  className="login-change-email"
                  type="button"
                  disabled={operation === "sending" || resendWait > 0}
                  onClick={() => void resendCode()}
                >
                  {resendWait > 0
                    ? `Resend code in ${resendWait}s`
                    : "Resend code"}
                </button>
              </div>
            </form>
          )}
          {!challenge && (
            <p className="login-access-note">
              Admin access is limited to email addresses approved by Vooma.
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
