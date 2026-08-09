import * as React from "react";
import { BrandMask } from "@/components/ui/brand-mask";

/**
 * The official lockup: cat, shatter field, ALGOBIC\ and the tagline.
 *
 * Thin wrapper over `BrandMask`, which owns the two-layer mask technique and
 * the asset table. Kept as a named component because the lockup is the one
 * mark with a fixed accessible name.
 */
export function AlgobicLockup({
  className = "",
  label = "ALGOBIC: Build Before They Do",
}: {
  className?: string;
  label?: string;
}) {
  return <BrandMask mark="lockup" label={label} className={className} />;
}
