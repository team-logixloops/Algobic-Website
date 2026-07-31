import InstagramIcon from "@/components/ui/instagram-icon";
import { SITE } from "@/lib/site";

/* Read from SITE rather than restated here. This is the only live external
   link on the site and it had two sources of truth. */
const HANDLE = SITE.instagramHandle;
const URL = SITE.instagram;

/** Static twin of the animated icon: the halves that ride the doors apart. */
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
      /* Says where it goes and that it leaves the site. The handle is revealed
         visually when the doors part, but a screen reader user never sees that,
         and neither group should have to discover a new tab by landing in one. */
      aria-label={`Follow @${HANDLE} on Instagram, opens in a new tab`}
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
