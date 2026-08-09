import type { NextConfig } from "next";

/**
 * React's development build calls `eval()` to reconstruct callstacks across
 * environments, and Turbopack's HMR client opens a websocket. Both are blocked
 * by the production policy, which is correct, so the two allowances are added
 * only when NODE_ENV is not production. The shipped policy is unchanged.
 */
const isDev = process.env.NODE_ENV !== "production";

/**
 * The page is fully prerendered, so a nonce-based CSP is not an option: a
 * nonce has to be minted per request and would force the route dynamic.
 * `'unsafe-inline'` on script-src is therefore deliberate: it covers Next's
 * bootstrap payload, the pre-paint theme script and the JSON-LD blocks.
 * Everything else is locked to same-origin.
 */
/**
 * The one third-party origin on the site.
 *
 * Plausible is allowed on `script-src` and `connect-src` and on nothing else:
 * it may load its script and post a count, and it may not become a frame, an
 * image, a font or a form target. Naming it once here keeps the two directives
 * from drifting apart, which is how an analytics script ends up loading and
 * then silently failing to report.
 */
const ANALYTICS_ORIGIN = "https://plausible.io";

const csp = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  `script-src 'self' 'unsafe-inline' ${ANALYTICS_ORIGIN}${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  `connect-src 'self' ${ANALYTICS_ORIGIN}${isDev ? " ws: wss:" : ""}`,
  "manifest-src 'self'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
