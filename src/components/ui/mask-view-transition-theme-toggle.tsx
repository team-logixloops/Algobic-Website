"use client";

import * as React from "react";
import { flushSync } from "react-dom";

export type Theme = "light" | "dark";

const STORAGE_KEY = "algobic-theme";

/** `startViewTransition` is not in every lib.dom yet. */
type ViewTransitionDocument = Document & {
  startViewTransition?: (callback: () => void) => { finished: Promise<void> };
};

/**
 * The `dark` class on <html> is the source of truth — the layout's inline
 * script sets it before first paint. Components subscribe to it rather than
 * mirroring it, so there is nothing to keep in sync and nothing to hydrate
 * wrong.
 */
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

function subscribe(onStoreChange: () => void) {
  listeners.add(onStoreChange);
  // Covers class changes made outside applyTheme (devtools, other components).
  const observer = new MutationObserver(emit);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
  return () => {
    listeners.delete(onStoreChange);
    observer.disconnect();
  };
}

const getSnapshot = (): Theme =>
  document.documentElement.classList.contains("dark") ? "dark" : "light";

const getServerSnapshot = (): Theme => "light";

function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
  document.documentElement.style.colorScheme = theme;
  // Synchronous so this still lands inside flushSync, before the view
  // transition snapshots the new state.
  emit();
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // private mode — the class still applies, it just won't persist
  }
}

export function useThemeSystem() {
  const theme = React.useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );

  return { theme, toggleTheme: applyTheme };
}

interface MaskThemeToggleProps {
  /** SVG/GIF used as the reveal mask. Must be solid — masks read alpha only. */
  maskUrl?: string;
  /** Total length of the reveal. */
  duration?: string;
  className?: string;
}

export function MaskThemeToggle({
  maskUrl,
  duration,
  className = "",
}: MaskThemeToggleProps) {
  const { theme, toggleTheme } = useThemeSystem();

  React.useEffect(() => {
    const root = document.documentElement;
    if (maskUrl) root.style.setProperty("--algobic-vt-mask", `url("${maskUrl}")`);
    if (duration) root.style.setProperty("--algobic-vt-duration", duration);
  }, [maskUrl, duration]);

  const handleToggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    const doc = document as ViewTransitionDocument;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!doc.startViewTransition || reduced) {
      toggleTheme(next);
      return;
    }

    doc.startViewTransition(() => {
      flushSync(() => toggleTheme(next));
    });
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
      className={`flex h-9 w-9 cursor-pointer items-center justify-center rounded-[10px] border border-line text-muted transition-colors hover:border-accent hover:text-accent sm:h-10 sm:w-10 ${className}`}
    >
      {theme === "dark" ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="17"
          height="17"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2" />
          <path d="M12 20v2" />
          <path d="m4.93 4.93 1.41 1.41" />
          <path d="m17.66 17.66 1.41 1.41" />
          <path d="M2 12h2" />
          <path d="M20 12h2" />
          <path d="m6.34 17.66-1.41 1.41" />
          <path d="m19.07 4.93-1.41 1.41" />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="17"
          height="17"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
        </svg>
      )}
    </button>
  );
}
