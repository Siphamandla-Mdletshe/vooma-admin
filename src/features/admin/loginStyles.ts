export const loginCss = `
@font-face {
  font-family: 'Inter';
  src: url('${import.meta.env.BASE_URL}fonts/inter-latin-variable.woff2') format('woff2');
  font-style: normal;
  font-weight: 100 900;
  font-display: swap;
}
.admin-login {
  --login-scale: clamp(.72px, .0598086vw, 1.15px);
  display: grid;
  grid-template-columns: minmax(0, 9fr) minmax(0, 7fr);
  width: 100%;
  min-height: 100vh;
  min-height: 100svh;
  font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  color: #111e34;
  background: #f8fbff;
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
  font-optical-sizing: none;
}
.admin-login * { box-sizing: border-box; }
.admin-login button, .admin-login input { font: inherit; }
.admin-login button { cursor: pointer; }
.admin-login button:focus-visible { outline: 3px solid var(--orange); outline-offset: 5px; }
.login-story {
  position: relative;
  isolation: isolate;
  overflow: hidden;
  min-height: 0;
  min-width: 0;
  padding: calc(43 * var(--login-scale)) 7% 0 9.8%;
  background: #d2e8fc;
}
.login-illustration { position: absolute; z-index: -1; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: center bottom; }
.login-brand { display: flex; align-items: center; gap: calc(12 * var(--login-scale)); height: calc(42 * var(--login-scale)); white-space: nowrap; }
.login-brand > svg { width: calc(40 * var(--login-scale)); height: calc(40 * var(--login-scale)); flex: none; }
.login-wordmark { font-size: calc(46 * var(--login-scale)); font-weight: 800; letter-spacing: calc(-2.4 * var(--login-scale)); line-height: 1; color: #142239; }
.login-brand-divider { width: 2px; height: calc(32 * var(--login-scale)); background: #afc9e4; margin: 0 calc(15 * var(--login-scale)) 0 calc(20 * var(--login-scale)); }
.login-console { font-size: calc(17 * var(--login-scale)); font-weight: 750; letter-spacing: calc(3 * var(--login-scale)); color: #405574; }
.login-story-copy { margin-top: clamp(32px, 9svh, 80px); margin-left: calc(10 * var(--login-scale)); position: relative; }
.login-story h2 { font-size: clamp(28px, 3vw, 48px); font-weight: 800; letter-spacing: calc(-1.8 * var(--login-scale)); line-height: 1.06; margin: 0; color: #0e1c31; }
.login-story h2::after { content: ''; display: block; width: calc(82 * var(--login-scale)); height: calc(10 * var(--login-scale)); margin-top: calc(23 * var(--login-scale)); border-radius: 3px; background: #ff8500; }
.login-story-copy > p { max-width: calc(475 * var(--login-scale)); margin: calc(25 * var(--login-scale)) 0 0; font-size: clamp(14px, 1.2vw, 18px); line-height: 1.45; letter-spacing: -.35px; color: #354d6f; }
.login-main {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  isolation: isolate;
  overflow: hidden;
  min-width: 0;
  padding: clamp(20px, 4svh, 40px) clamp(24px, 4vw, 72px);
  background: radial-gradient(ellipse at 28% 40%, #fff 0%, #f8fbff 65%, #f0f6fe 100%);
}
.login-main::before, .login-main::after { content: ''; position: absolute; z-index: -1; pointer-events: none; background: linear-gradient(135deg, #dcebff, #eaf4ff); }
.login-main::before { width: calc(210 * var(--login-scale)); height: calc(310 * var(--login-scale)); right: calc(-69 * var(--login-scale)); top: calc(-104 * var(--login-scale)); border-radius: 0 0 48% 45%; transform: rotate(33deg); }
.login-main::after { width: calc(485 * var(--login-scale)); height: calc(300 * var(--login-scale)); right: calc(-190 * var(--login-scale)); bottom: calc(-168 * var(--login-scale)); border-radius: 60% 40% 0 0; transform: rotate(-37deg); }
.login-card { width: 100%; min-width: 0; max-width: 460px; overflow-wrap: anywhere; }
.login-eyebrow { display: block; font-size: clamp(11px, .8vw, 13px); line-height: 1.5; font-weight: 750; letter-spacing: calc(3 * var(--login-scale)); color: #536583; }
.login-card h1 { margin: 16px 0 8px; font-size: clamp(26px, 2.4vw, 36px); letter-spacing: calc(-.8 * var(--login-scale)); line-height: 1.19; font-weight: 800; }
.login-subtitle { margin: 0 0 24px; font-size: clamp(14px, 1.1vw, 16px); line-height: 1.5; letter-spacing: -.5px; color: #536587; }
.login-card label { display: block; margin: 0 0 calc(8 * var(--login-scale)); font-size: calc(19 * var(--login-scale)); line-height: calc(24 * var(--login-scale)); font-weight: 700; letter-spacing: -.4px; }
.login-card label[for='admin-password'] { margin-top: calc(24 * var(--login-scale)); margin-bottom: calc(12 * var(--login-scale)); }
.login-card .login-field-label { display: block; margin: 0 0 calc(8 * var(--login-scale)); font-size: calc(19 * var(--login-scale)); line-height: calc(24 * var(--login-scale)); font-weight: 700; letter-spacing: -.4px; }
.login-input-wrap, .login-password { position: relative; }
.login-input-wrap > svg, .login-password > svg { position: absolute; left: calc(25 * var(--login-scale)); top: 50%; transform: translateY(-50%); width: calc(28 * var(--login-scale)); height: calc(28 * var(--login-scale)); fill: none; stroke: #344966; stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; pointer-events: none; }
.login-card input { display: block; width: 100%; height: calc(64 * var(--login-scale)); border: 1px solid #cad8eb; border-radius: calc(18 * var(--login-scale)); background: transparent; padding: 0 calc(18 * var(--login-scale)) 0 calc(75 * var(--login-scale)); color: var(--ink); font-size: calc(20 * var(--login-scale)); letter-spacing: -.4px; }
.login-card input::placeholder { color: #6a7d9d; opacity: 1; }
.login-card input:focus { outline: 2px solid #94b9e1; outline-offset: 2px; background: #fff; }
.login-card #admin-email, .login-card #admin-code { padding: 0 calc(18 * var(--login-scale)); }
.login-password input { padding-right: calc(88 * var(--login-scale)); }
.login-password button { position: absolute; right: calc(12 * var(--login-scale)); top: 0; height: 100%; min-width: 44px; padding: 0 calc(8 * var(--login-scale)); border: 0; background: transparent; color: #536887; font-size: calc(17 * var(--login-scale)); font-weight: 650; border-radius: 8px; }
.admin-login .login-submit { position: relative; display: flex; align-items: center; justify-content: center; width: 100%; height: calc(68 * var(--login-scale)); margin-top: 20px; border: 1px solid #17243a; border-radius: calc(25 * var(--login-scale)); background: linear-gradient(110deg, #293b54, #1b283c); box-shadow: inset 0 1px 2px #ffffff15, 0 1px 2px #15263d15; color: white; font-size: calc(23 * var(--login-scale)); font-weight: 650; transition: filter .15s; }
.login-submit:hover { filter: brightness(1.15); }
.login-arrow { width: calc(24 * var(--login-scale)); height: calc(24 * var(--login-scale)); flex: none; color: #ff8500; }
.login-submit .login-arrow { position: absolute; right: calc(22 * var(--login-scale)); width: calc(39 * var(--login-scale)); height: calc(39 * var(--login-scale)); }
.login-submit:disabled { cursor: wait; opacity: .72; }
.login-change-email { display: block; margin: calc(14 * var(--login-scale)) auto 0; border: 0; padding: 8px 12px; background: transparent; color: #536587; font-size: 15px; font-weight: 650; }
.login-change-email:hover { color: #17243a; text-decoration: underline; }
.login-access-note { margin: 20px 0 0; text-align: center; font-size: calc(17 * var(--login-scale)); line-height: calc(27 * var(--login-scale)); letter-spacing: -.4px; color: #536587; }
.login-feedback { font-size: 14px; color: var(--error); padding: 12px 14px; border: 1px solid var(--line); border-radius: 9px; background: white; }
@media (max-width: 1100px) and (min-width: 761px) {
  .admin-login { --login-scale: .72px; grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .login-story { padding-left: 7%; }
  .login-story h2 { font-size: clamp(28px, 3vw, 34px); }
  .login-story-copy { margin-left: 0; }
  .login-story-copy > p { font-size: 14px; max-width: 310px; }
  .login-brand { gap: 7px; }
  .login-wordmark { font-size: 31px; }
  .login-console { font-size: 10px; letter-spacing: 1.7px; }
  .login-brand-divider { margin-left: 6px; margin-right: 6px; }
  .login-main { padding-left: 8%; padding-right: 8%; }
  .login-card h1 { font-size: 28px; }
  .login-subtitle { font-size: 14px; letter-spacing: -.4px; }
}
@media (max-width: 760px) {
  .admin-login { --login-scale: .8px; display: flex; flex-direction: column; }
  .login-story { min-height: auto; flex: none; padding: 16px 24px; }
  .login-brand { height: 32px; gap: 8px; }
  .login-brand > svg { width: 32px; height: 32px; }
  .login-wordmark { font-size: 33px; letter-spacing: -1.7px; }
  .login-brand-divider { height: 25px; margin: 0 7px 0 10px; }
  .login-console { font-size: 10px; letter-spacing: 1.9px; }
  .login-story-copy, .login-illustration { display: none; }
  .login-main { flex: 1; padding: 24px; }
  .login-card { max-width: 460px; }
  .login-card h1 { font-size: clamp(26px, 6.5vw, 30px); }
  .login-card input { font-size: 16px; min-height: 52px; }
  .login-subtitle { font-size: 14px; letter-spacing: -.5px; }
  .login-access-note { font-size: 13px; letter-spacing: -.3px; }
}
@media (max-width: 360px) {
  .login-main, .login-story { padding-left: 20px; padding-right: 20px; }
  .login-console { font-size: 9px; letter-spacing: 1.2px; }
  .login-wordmark { font-size: 29px; }
  .login-brand-divider { margin-left: 5px; margin-right: 4px; }
  .login-subtitle { font-size: 14px; }
}
@media (max-height: 700px) {
  .login-main { padding-top: 16px; padding-bottom: 16px; }
  .login-card h1 { margin-top: 10px; }
  .login-subtitle { margin-bottom: 16px; }
  .login-card input { height: 44px; min-height: 44px; }
  .admin-login .login-submit { height: 44px; margin-top: 14px; font-size: 16px; }
  .login-change-email { margin-top: 4px; padding: 8px; font-size: 13px; }
  .login-access-note { margin-top: 12px; font-size: 12px; line-height: 1.5; }
  .login-feedback { margin: 10px 0; padding: 8px 10px; font-size: 13px; }
}
@media (max-height: 500px) {
  .login-main { padding-top: 8px; padding-bottom: 8px; }
  .login-card h1 { margin: 6px 0; font-size: 24px; }
  .login-subtitle { margin-bottom: 10px; font-size: 13px; }
  .login-card form { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .login-card .login-field-label, .login-card input, .admin-login .login-submit { grid-column: 1 / -1; }
  .login-card .login-field-label { font-size: 12px; line-height: 1.4; }
  .login-card input { height: 40px; min-height: 40px; }
  .admin-login .login-submit { height: 40px; margin-top: 10px; }
  .login-change-email { margin: 4px 0 0; padding: 6px 4px; font-size: 12px; }
  .login-feedback { margin: 6px 0; padding: 6px 8px; }
}
@media (max-height: 500px) and (max-width: 760px) {
  .login-story { display: none; }
}
.login-code-inputs { display: grid; grid-template-columns: repeat(6, minmax(0, 1fr)); gap: clamp(6px, 1vw, 12px); width: 100%; max-width: 384px; grid-column: 1 / -1; }
.login-code-status { grid-column: 1 / -1; margin: 12px 0 0; font-size: 13px; line-height: 1.5; color: #536587; }
.login-code-status:empty { margin: 0; }
.login-code-status + .login-change-email { grid-column: 1 / -1; }
.login-card .login-code-inputs input { grid-column: auto; width: 100%; min-width: 0; height: auto; min-height: 0; aspect-ratio: 1; padding: 0; border-radius: 10px; text-align: center; font-size: clamp(20px, 2vw, 26px); font-weight: 650; letter-spacing: 0; caret-color: var(--ink); }
@media (max-height: 500px) {
  .login-code-inputs { max-width: 280px; gap: 8px; }
}
.verification-card { text-align: center; }
.verification-icon { display: grid; place-items: center; width: 56px; aspect-ratio: 1; margin: 0 auto 16px; border-radius: 28%; background: #fff0e3; color: #ff8500; box-shadow: 0 5px 18px #ff850020; }
.verification-icon svg { width: 56%; height: 56%; }
.verification-header h1 { margin: 0 0 14px; letter-spacing: -1px; }
.verification-header>p { margin: 0; line-height: 1.5; color: #405b7e; }
.verification-email { display: inline-flex; align-items: center; justify-content: center; gap: 10px; max-width: 100%; margin: 16px 0 20px; padding: 8px 16px; border-radius: 16px; background: #e6f0ff; }
.verification-email svg { width: 20px; height: 20px; flex: none; padding: 2px; border-radius: 6px; background: #078dee; color: white; }
.verification-email strong { min-width: 0; font-size: clamp(14px, 1.1vw, 16px); font-weight: 700; line-height: 1.4; overflow-wrap: anywhere; }
.login-card .verification-form { display: block; }
.verification-code-label { position: absolute; width: 1px; height: 1px; padding: 0; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }
.verification-card .login-code-inputs { max-width: 280px; margin: 0 auto; gap: 8px; }
.verification-card .login-code-inputs input { border: 1px solid #c8ddff; border-radius: 8px; background: #fff; color: #091629; font-size: 16px; box-shadow: 0 3px 8px #1453a00a; opacity: 1; -webkit-text-fill-color: #091629; }
.verification-status { display: grid; align-items: center; min-height: 24px; margin: 16px 0; }
.verification-card .login-code-status { display: flex; align-items: center; justify-content: center; gap: 9px; margin: 0; font-size: clamp(13px, 1.1vw, 16px); }
.verification-card .login-code-status.verified { color: #078400; font-weight: 600; }
.verification-card .login-code-status svg { width: 24px; height: 24px; flex: none; }
.verification-error { margin: 0; color: var(--error); font-size: 14px; line-height: 1.5; }
.admin-login .verification-continue { margin: 0; background: linear-gradient(110deg, #102a48, #0b213a); }
.verification-continue:disabled { cursor: default; }
.verification-resend { margin-top: 20px; padding-top: 16px; border-top: 1px solid #e1ebf8; }
.verification-resend p { margin: 0; color: #405b7e; font-size: clamp(14px, 1.1vw, 16px); }
.verification-resend .login-change-email { display: inline-block; margin: 4px 0 0; color: #ed7500; font-size: clamp(14px, 1.1vw, 16px); font-weight: 700; }
.verification-resend .login-change-email:disabled { cursor: default; color: #8c653d; text-decoration: none; }
@media (max-width: 760px) {
  .verification-icon { width: 48px; margin-bottom: 14px; }
  .verification-email { margin: 14px 0 18px; }
  .verification-card .login-code-inputs input { border-radius: 8px; }
  .verification-status { margin: 18px 0; }
  .verification-resend { margin-top: 22px; padding-top: 16px; }
}
@media (max-height: 700px) {
  .verification-icon { width: 52px; margin-bottom: 14px; }
  .verification-header h1 { margin-bottom: 8px; }

  .verification-email { margin: 12px 0 18px; padding: 8px 16px; }
  .verification-email strong { font-size: 16px; }
  .verification-card .login-code-inputs { max-width: 280px; }
  .verification-status { min-height: 24px; margin: 14px 0; }

  .verification-resend { margin-top: 18px; padding-top: 12px; }
}
@media (max-height: 500px) {
  .verification-icon { width: 40px; margin-bottom: 8px; }
  .verification-header h1 { margin-bottom: 4px; }

  .verification-email { margin: 8px 0 10px; padding: 6px 12px; }
  .verification-email strong { font-size: 14px; }
  .verification-email svg { width: 20px; height: 20px; }
  .verification-card .login-code-inputs { max-width: 256px; }
  .verification-status { min-height: 20px; margin: 8px 0; }
  .verification-card .login-code-status, .verification-error { font-size: 12px; }
  .verification-card .login-code-status svg { width: 18px; height: 18px; }

  .verification-resend { margin-top: 10px; padding-top: 8px; }
  .verification-resend p, .verification-resend .login-change-email { font-size: 12px; }
  .verification-resend .login-change-email { margin-top: 0; padding: 4px 8px; }
}
`;
