import { describe, expect, it } from "vitest";

import {
  findNamedColorMatch,
  formatOklch,
  formatRgb,
  hexToOklab,
  namedColorSwatches,
  type NamedColor,
  parseHex,
  randomNamedColor,
} from "./color";

const catalog: NamedColor[] = [
  { name: "Beta", hex: "#000001", oklab: [0, 0, 1] },
  { name: "Alpha", hex: "#000002", oklab: [0, 0, 1] },
  { name: "Near black", hex: "#000000", oklab: [0, 0, 0] },
];

describe("selected-color utilities", () => {
  it("parses only canonical six-digit sRGB hex values and normalizes them to uppercase", () => {
    expect(parseHex("#2563eb")).toEqual({
      red: 37,
      green: 99,
      blue: 235,
      hex: "#2563EB",
    });
    expect(parseHex("#fff")).toBeNull();
    expect(parseHex("2563EB")).toBeNull();
    expect(parseHex("#2563EG")).toBeNull();
  });

  it("converts sRGB white to OKLab", () => {
    const [lightness, a, b] = hexToOklab("#FFFFFF");
    expect(lightness).toBeCloseTo(1, 6);
    expect(a).toBeCloseTo(0, 6);
    expect(b).toBeCloseTo(0, 6);
  });

  it("formats an sRGB color as RGB text and retains it when OKLCH is unavailable", () => {
    expect(formatRgb("#2563EB")).toBe("rgb(37 99 235)");
    expect(formatOklch("#2563EB", false)).toBeNull();
  });

  it("selects a random catalog color and clamps an out-of-range random value", () => {
    expect(randomNamedColor(catalog, () => 0).name).toBe("Beta");
    expect(randomNamedColor(catalog, () => 1).name).toBe("Near black");
  });

  it("chooses distinct named swatches across the catalog", () => {
    const swatches = namedColorSwatches(catalog);
    expect(swatches).toHaveLength(catalog.length);
    expect(new Set(swatches).size).toBe(catalog.length);
  });

  it("prefers an exact named-color match over its OKLab distance", () => {
    expect(findNamedColorMatch("#000001", catalog).name).toBe("Beta");
  });

  it("uses alphabetical order when multiple named colors exactly match", () => {
    const duplicateHexCatalog: NamedColor[] = [
      { name: "Zulu", hex: "#000001", oklab: [0, 0, 0] },
      { name: "Alpha", hex: "#000001", oklab: [0, 0, 0] },
    ];
    expect(findNamedColorMatch("#000001", duplicateHexCatalog).name).toBe(
      "Alpha",
    );
  });

  it("chooses the alphabetically first name when OKLab distances tie", () => {
    const tiedCatalog: NamedColor[] = [
      { name: "Beta", hex: "#000001", oklab: [1, 0, 0] },
      { name: "Alpha", hex: "#000002", oklab: [1, 0, 0] },
    ];
    expect(findNamedColorMatch("#FFFFFF", tiedCatalog).name).toBe("Alpha");
  });
});
