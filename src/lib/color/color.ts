export type Oklab = readonly [lightness: number, a: number, b: number];

export interface NamedColor {
  name: string;
  hex: string;
  oklab: Oklab;
}

export interface ParsedColor {
  red: number;
  green: number;
  blue: number;
  hex: string;
}

const HEX_COLOR = /^#[0-9a-fA-F]{6}$/;

export function parseHex(value: string): ParsedColor | null {
  if (!HEX_COLOR.test(value)) return null;

  const hex = value.toUpperCase();
  return {
    red: Number.parseInt(hex.slice(1, 3), 16),
    green: Number.parseInt(hex.slice(3, 5), 16),
    blue: Number.parseInt(hex.slice(5, 7), 16),
    hex,
  };
}

function toHexChannel(value: number): string {
  return Math.round(Math.min(1, Math.max(0, value)) * 255)
    .toString(16)
    .padStart(2, "0");
}

function linearToSrgb(channel: number): number {
  return channel <= 0.0031308
    ? 12.92 * channel
    : 1.055 * channel ** (1 / 2.4) - 0.055;
}

function oklabToHex(lightness: number, a: number, b: number): string {
  const l = (lightness + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (lightness - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (lightness - 0.0894841775 * a - 1.291485548 * b) ** 3;
  const red = linearToSrgb(
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
  );
  const green = linearToSrgb(
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
  );
  const blue = linearToSrgb(
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  );
  return `#${toHexChannel(red)}${toHexChannel(green)}${toHexChannel(blue)}`.toUpperCase();
}

/** Parses the opaque CSS sRGB formats accepted by the selected-color text field. */
export function parseCssColor(value: string): ParsedColor | null {
  const hex = parseHex(value);
  if (hex) return hex;

  const rgb = value.match(
    /^rgb\(\s*(\d{1,3})\s*(?:,|\s)\s*(\d{1,3})\s*(?:,|\s)\s*(\d{1,3})\s*\)$/i,
  );
  if (rgb) {
    const channels = rgb.slice(1).map(Number);
    if (channels.every((channel) => channel <= 255)) {
      return parseHex(
        `#${channels.map((channel) => channel.toString(16).padStart(2, "0")).join("")}`,
      );
    }
  }

  const oklch = value.match(
    /^oklch\(\s*([\d.]+)%\s+([\d.]+)\s+(-?[\d.]+)(?:deg)?\s*\)$/i,
  );
  if (oklch) {
    const [lightness, chroma, hue] = oklch.slice(1).map(Number);
    if (lightness <= 100 && chroma >= 0) {
      const radians = (hue * Math.PI) / 180;
      return parseHex(
        oklabToHex(
          lightness / 100,
          chroma * Math.cos(radians),
          chroma * Math.sin(radians),
        ),
      );
    }
  }

  return null;
}

export function foregroundForColor(value: string): "#000" | "#fff" {
  const { red, green, blue } = requireParsedHex(value);
  const luminance =
    0.2126 * srgbToLinear(red) +
    0.7152 * srgbToLinear(green) +
    0.0722 * srgbToLinear(blue);
  return luminance > 0.179 ? "#000" : "#fff";
}

function requireParsedHex(value: string) {
  const color = parseHex(value);
  if (!color)
    throw new TypeError(`Expected a #RRGGBB color, received ${value}`);
  return color;
}

function srgbToLinear(channel: number): number {
  const normalized = channel / 255;
  return normalized <= 0.04045
    ? normalized / 12.92
    : ((normalized + 0.055) / 1.055) ** 2.4;
}

export function hexToOklab(value: string): Oklab {
  const { red, green, blue } = requireParsedHex(value);
  const r = srgbToLinear(red);
  const g = srgbToLinear(green);
  const b = srgbToLinear(blue);

  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);

  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ];
}

export function formatRgb(value: string): string {
  const { red, green, blue } = requireParsedHex(value);
  return `rgb(${red} ${green} ${blue})`;
}

function supportsOklch(): boolean {
  return (
    typeof CSS !== "undefined" && CSS.supports("color", "oklch(50% 0.1 0)")
  );
}

export function formatOklch(
  value: string,
  supported = supportsOklch(),
): string | null {
  if (!supported) return null;

  const [lightness, a, b] = hexToOklab(value);
  const chroma = Math.hypot(a, b);
  const hue = (Math.atan2(b, a) * 180) / Math.PI;
  const normalizedHue = hue < 0 ? hue + 360 : hue;
  return `oklch(${(lightness * 100).toFixed(2)}% ${chroma.toFixed(4)} ${normalizedHue.toFixed(2)})`;
}

function distance(left: Oklab, right: Oklab): number {
  return Math.hypot(left[0] - right[0], left[1] - right[1], left[2] - right[2]);
}

export function findNamedColorMatch(
  value: string,
  catalog: readonly NamedColor[],
): NamedColor {
  if (catalog.length === 0)
    throw new RangeError("The named-color catalog cannot be empty");

  const hex = requireParsedHex(value).hex;
  const exactMatches = catalog.filter(
    (color) => color.hex.toUpperCase() === hex,
  );
  if (exactMatches.length > 0) {
    return exactMatches.reduce((first, candidate) =>
      candidate.name < first.name ? candidate : first,
    );
  }

  const target = hexToOklab(hex);
  return catalog.reduce((best, candidate) => {
    const candidateDistance = distance(target, candidate.oklab);
    const bestDistance = distance(target, best.oklab);
    return candidateDistance < bestDistance ||
      (candidateDistance === bestDistance && candidate.name < best.name)
      ? candidate
      : best;
  });
}
