import { hexToOklab } from "./color";

export type ColorFamily =
  | "Red"
  | "Orange"
  | "Yellow"
  | "Green"
  | "Cyan"
  | "Teal"
  | "Blue"
  | "Purple"
  | "Pink"
  | "Brown"
  | "Black"
  | "Gray"
  | "White";

export function colorFamilyLabel(family: ColorFamily): string {
  if (family === "Cyan") return "Cyan — mostly blue";
  if (family === "Teal") return "Teal — mostly green";
  return family;
}

/**
 * An English-language naming convention, not a universal perceptual boundary.
 * Classifies the actual sRGB value independently of its named-color match.
 * OKLCH hue separates chromatic families; lightness and chroma distinguish
 * neutrals, brown from orange, pink from red, and teal from bright cyan.
 * Thresholds are calibrated against the representative colors in family.test.ts.
 */
export function identifyColorFamily(hex: string): ColorFamily {
  const [lightness, a, b] = hexToOklab(hex);
  const chroma = Math.hypot(a, b);
  const hue = ((Math.atan2(b, a) * 180) / Math.PI + 360) % 360;

  // Hue is unreliable near the neutral axis. Preserve saturated dark colors
  // (navy, maroon, forest green) rather than calling everything dark black.
  if (chroma < 0.025) {
    if (lightness < 0.18) return "Black";
    if (lightness >= 0.96) return "White";
    return "Gray";
  }

  if (hue < 45 || hue >= 355) {
    if (
      hue >= 20 &&
      hue < 45 &&
      lightness >= 0.4 &&
      lightness < 0.7 &&
      chroma < 0.18
    )
      return "Brown";
    return lightness >= 0.72 ? "Pink" : "Red";
  }
  if (hue < 80) return lightness < 0.7 || chroma < 0.09 ? "Brown" : "Orange";
  // Dark yellow-orange reads as brown; dark yellow reads as olive green.
  if (hue < 110)
    return lightness < 0.7 ? (hue < 95 ? "Brown" : "Green") : "Yellow";
  if (hue < 175) return "Green";
  if (hue < 235) {
    return hue < 190 || lightness < 0.72 ? "Teal" : "Cyan";
  }
  if (hue < 285) return "Blue";
  if (hue < 325) return "Purple";
  return lightness < 0.6 ? "Purple" : "Pink";
}
