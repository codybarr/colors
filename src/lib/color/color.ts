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

function requireParsedHex(value: string): ParsedColor {
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
