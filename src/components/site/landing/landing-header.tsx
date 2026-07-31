import { BrandMask } from "@/components/ui/brand-mask";
import { MaskThemeToggle } from "@/components/ui/mask-view-transition-theme-toggle";
import { SITE } from "@/lib/site";

/**
 * Chrome for a site that is currently one page.
 *
 * No navigation, on purpose. `/builds`, `/start`, `/tools`, `/answers` and
 * `/join` are all planned and none of them exist yet; a header full of links
 * that 404 is a worse first impression than a header with none. The nav arrives
 * with the pages it points at.
 *
 * The wordmark is not a link either. Linking home from the top of home is a
 * control that does nothing, and a dead control costs more trust than a missing
 * one.
 *
 * It was briefly given the sliced-band assembly that the cat runs at the foot
 * of the page, so the page would open and close on the same gesture. Cut after
 * looking at it: the wordmark is 11.5:1 and about twelve pixels tall here, so
 * the bands come out at two pixels and shearing them sideways destroys the
 * letterforms instead of dissolving them. It read as a font failing to load.
 * The gesture needs the cat's height and only happens once.
 */
export function LandingHeader() {
  /* The bar is opaque, not translucent with a backdrop blur. Two reasons, both
   * real. A 65%-opaque bar over a live canvas re-reads and re-blurs its
   * backdrop on every scroll frame, which is exactly the cost a mid-range
   * Android cannot spare and exactly the device this audience is on. And
   * whatever scrolled underneath it showed through the theme toggle, dragging
   * the icon and its focus ring below the 3:1 floor at unpredictable moments.
   */
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-background">
      <div className="mx-auto flex max-w-[110rem] items-center justify-between gap-4 px-[max(1rem,4vw)] py-[clamp(0.625rem,1.5vw,0.875rem)]">
        <BrandMask
          mark="wordmark"
          label={SITE.name}
          className="w-[clamp(6rem,24vw,8.5rem)] text-foreground"
        />
        <MaskThemeToggle />
      </div>
    </header>
  );
}
