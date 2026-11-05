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
  grid-template-columns: 56.25% 43.75%;
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
  min-height: max(100svh, calc(900 * var(--login-scale)));
  padding: calc(43 * var(--login-scale)) 7% 0 9.8%;
  background: #d2e8fc;
}
.login-illustration { position: absolute; z-index: -1; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: center bottom; }
.login-brand { display: flex; align-items: center; gap: calc(12 * var(--login-scale)); height: calc(42 * var(--login-scale)); white-space: nowrap; }
.login-brand > svg { width: calc(40 * var(--login-scale)); height: calc(40 * var(--login-scale)); flex: none; }
.login-wordmark { font-size: calc(46 * var(--login-scale)); font-weight: 800; letter-spacing: calc(-2.4 * var(--login-scale)); line-height: 1; color: #142239; }
.login-brand-divider { width: 2px; height: calc(32 * var(--login-scale)); background: #afc9e4; margin: 0 calc(15 * var(--login-scale)) 0 calc(20 * var(--login-scale)); }
.login-console { font-size: calc(17 * var(--login-scale)); font-weight: 750; letter-spacing: calc(3 * var(--login-scale)); color: #405574; }
.login-story-copy { margin-top: calc(99 * var(--login-scale)); margin-left: calc(10 * var(--login-scale)); position: relative; }
.login-story h2 { font-size: max(13px, calc(56 * var(--login-scale))); font-weight: 800; letter-spacing: calc(-1.8 * var(--login-scale)); line-height: 1.06; margin: 0; color: #0e1c31; }
.login-story h2::after { content: ''; display: block; width: calc(82 * var(--login-scale)); height: calc(10 * var(--login-scale)); margin-top: calc(23 * var(--login-scale)); border-radius: 3px; background: #ff8500; }
.login-story-copy > p { max-width: calc(475 * var(--login-scale)); margin: calc(25 * var(--login-scale)) 0 0; font-size: max(13px, calc(18 * var(--login-scale))); line-height: 1.45; letter-spacing: -.35px; color: #354d6f; }
.login-main {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  isolation: isolate;
  overflow: hidden;
  min-width: 0;
  padding: calc(70 * var(--login-scale)) 10.5% calc(70 * var(--login-scale)) 13.2%;
  background: radial-gradient(ellipse at 28% 40%, #fff 0%, #f8fbff 65%, #f0f6fe 100%);
}
.login-main::before, .login-main::after { content: ''; position: absolute; z-index: -1; pointer-events: none; background: linear-gradient(135deg, #dcebff, #eaf4ff); }
.login-main::before { width: calc(210 * var(--login-scale)); height: calc(310 * var(--login-scale)); right: calc(-69 * var(--login-scale)); top: calc(-104 * var(--login-scale)); border-radius: 0 0 48% 45%; transform: rotate(33deg); }
.login-main::after { width: calc(485 * var(--login-scale)); height: calc(300 * var(--login-scale)); right: calc(-190 * var(--login-scale)); bottom: calc(-168 * var(--login-scale)); border-radius: 60% 40% 0 0; transform: rotate(-37deg); }
.login-card { width: 100%; max-width: 642px; }
.login-eyebrow { display: block; font-size: calc(17 * var(--login-scale)); line-height: calc(22 * var(--login-scale)); font-weight: 750; letter-spacing: calc(3 * var(--login-scale)); color: #536583; }
.login-card h1 { margin: calc(28 * var(--login-scale)) 0 calc(8 * var(--login-scale)); font-size: max(13px, calc(44 * var(--login-scale))); letter-spacing: calc(-.8 * var(--login-scale)); line-height: 1.19; font-weight: 800; }
.login-subtitle { margin: 0 0 calc(40 * var(--login-scale)); font-size: max(13px, calc(20 * var(--login-scale))); line-height: calc(34 * var(--login-scale)); letter-spacing: -.5px; color: #536587; }
.login-card label { display: block; margin: 0 0 calc(8 * var(--login-scale)); font-size: max(13px, calc(17 * var(--login-scale))); line-height: calc(24 * var(--login-scale)); font-weight: 700; letter-spacing: -.4px; }
.login-card label[for='admin-password'] { margin-top: calc(24 * var(--login-scale)); margin-bottom: calc(12 * var(--login-scale)); }
.login-input-wrap, .login-password { position: relative; }
.login-input-wrap > svg, .login-password > svg { position: absolute; left: calc(25 * var(--login-scale)); top: 50%; transform: translateY(-50%); width: calc(28 * var(--login-scale)); height: calc(28 * var(--login-scale)); fill: none; stroke: #344966; stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; pointer-events: none; }
.login-card input { display: block; width: 100%; height: calc(64 * var(--login-scale)); border: 1px solid #cad8eb; border-radius: calc(18 * var(--login-scale)); background: transparent; padding: 0 calc(18 * var(--login-scale)) 0 calc(75 * var(--login-scale)); color: var(--ink); font-size: max(13px, calc(18 * var(--login-scale))); letter-spacing: -.4px; }
.login-card input::placeholder { color: #6a7d9d; opacity: 1; }
.login-card input:focus { outline: 2px solid #94b9e1; outline-offset: 2px; background: #fff; }
.login-password input { padding-right: calc(88 * var(--login-scale)); }
.login-password button { position: absolute; right: calc(12 * var(--login-scale)); top: 0; height: 100%; min-width: 44px; padding: 0 calc(8 * var(--login-scale)); border: 0; background: transparent; color: #536887; font-size: calc(17 * var(--login-scale)); font-weight: 650; border-radius: 8px; }
.admin-login .login-submit { position: relative; display: flex; align-items: center; justify-content: center; width: 100%; height: calc(68 * var(--login-scale)); margin-top: calc(38 * var(--login-scale)); border: 1px solid #17243a; border-radius: calc(25 * var(--login-scale)); background: linear-gradient(110deg, #293b54, #1b283c); box-shadow: inset 0 1px 2px #ffffff15, 0 1px 2px #15263d15; color: white; font-size: max(13px, calc(20 * var(--login-scale))); font-weight: 650; transition: filter .15s; }
.login-submit:hover { filter: brightness(1.15); }
.login-arrow { width: calc(24 * var(--login-scale)); height: calc(24 * var(--login-scale)); flex: none; color: #ff8500; }
.login-submit .login-arrow { position: absolute; right: calc(22 * var(--login-scale)); width: calc(39 * var(--login-scale)); height: calc(39 * var(--login-scale)); }
.login-access-note { margin: calc(26 * var(--login-scale)) 0 calc(42 * var(--login-scale)); text-align: center; font-size: calc(17 * var(--login-scale)); line-height: calc(27 * var(--login-scale)); letter-spacing: -.4px; color: #536587; }
.login-feedback { font-size: 14px; color: var(--error); padding: 12px 14px; border: 1px solid var(--line); border-radius: 9px; background: white; }
.login-preview { border-top: 1px solid #d6e1ed; padding-top: calc(39 * var(--login-scale)); }
.login-preview-label { display: block; font-size: calc(17 * var(--login-scale)); line-height: calc(24 * var(--login-scale)); font-weight: 750; letter-spacing: calc(2.7 * var(--login-scale)); color: #526482; }
.login-preview p { margin: calc(8 * var(--login-scale)) 0 calc(18 * var(--login-scale)); color: #536587; font-size: max(13px, calc(16 * var(--login-scale))); line-height: calc(28 * var(--login-scale)); letter-spacing: -.3px; }
.login-preview button { display: inline-flex; align-items: center; gap: calc(14 * var(--login-scale)); border: 0; padding: 0; background: transparent; color: #101e35; font-size: max(13px, calc(18 * var(--login-scale))); line-height: calc(28 * var(--login-scale)); font-weight: 750; letter-spacing: -.4px; }
.login-preview button:hover { color: #42658c; }
@media (max-width: 1100px) and (min-width: 761px) {
  .admin-login { --login-scale: .72px; grid-template-columns: 50% 50%; }
  .login-story { padding-left: 7%; }
  .login-story h2 { font-size: clamp(30px, 3.5vw, 38px); }
  .login-story-copy { margin-left: 0; }
  .login-story-copy > p { font-size: 15px; max-width: 310px; }
  .login-brand { gap: 7px; }
  .login-wordmark { font-size: 31px; }
  .login-console { font-size: 10px; letter-spacing: 1.7px; }
  .login-brand-divider { margin-left: 6px; margin-right: 6px; }
  .login-main { padding-left: 8%; padding-right: 8%; }
  .login-card h1 { font-size: 31px; }
  .login-subtitle { font-size: 15px; letter-spacing: -.4px; }
}
@media (max-width: 760px) {
  .admin-login { --login-scale: .8px; display: flex; flex-direction: column; }
  .login-story { min-height: auto; padding: 25px 24px; }
  .login-brand { height: 32px; gap: 8px; }
  .login-brand > svg { width: 32px; height: 32px; }
  .login-wordmark { font-size: 33px; letter-spacing: -1.7px; }
  .login-brand-divider { height: 25px; margin: 0 7px 0 10px; }
  .login-console { font-size: 10px; letter-spacing: 1.9px; }
  .login-story-copy, .login-illustration { display: none; }
  .login-main { flex: 1; padding: 44px 24px; }
  .login-card { max-width: 460px; }
  .login-card h1 { font-size: clamp(28px, 7.5vw, 36px); }
  .login-card input { font-size: 16px; min-height: 52px; }
  .login-subtitle { font-size: 15px; letter-spacing: -.5px; }
  .login-access-note { font-size: 13px; letter-spacing: -.3px; }
  .login-preview button { min-height: 44px; }
}
@media (max-width: 360px) {
  .login-main, .login-story { padding-left: 20px; padding-right: 20px; }
  .login-console { font-size: 9px; letter-spacing: 1.2px; }
  .login-wordmark { font-size: 29px; }
  .login-brand-divider { margin-left: 5px; margin-right: 4px; }
  .login-subtitle { font-size: 15px; }
}
`;
