"use client";

import InstagramIcon from "@/components/ui/instagram-icon";

const HANDLE = "algobic.in";
const URL = "https://www.instagram.com/algobic.in?igsh=cWlsZXNtZDJmOW1v";

/** Static twin of the animated icon — the halves that ride the doors apart. */
function Glyph() {
  return (
    <svg
      className="trapdoor__glyph"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 8a4 4 0 0 1 4 -4h8a4 4 0 0 1 4 4v8a4 4 0 0 1 -4 4h-8a4 4 0 0 1 -4 -4z" />
      <path d="M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" />
      <path d="M16.5 7.5v.01" />
    </svg>
  );
}

export function InstagramTrapdoor() {
  return (
    <a
      href={URL}
      target="_blank"
      rel="noreferrer noopener"
      className="trapdoor"
      aria-label={`Follow ${HANDLE} on Instagram`}
    >
      <span className="trapdoor__reveal">
        <InstagramIcon size={34} strokeWidth={1.6} />
        <span className="trapdoor__handle">@{HANDLE}</span>
      </span>

      <span className="trapdoor__door trapdoor__door--top" aria-hidden="true">
        <Glyph />
      </span>
      <span className="trapdoor__door trapdoor__door--bottom" aria-hidden="true">
        <Glyph />
      </span>
    </a>
  );
}
