import { describe, expect, it } from "vitest";
import { namedColorCatalog } from "./catalog";
import {
  colorFamilyLabel,
  identifyColorFamily,
  type ColorFamily,
} from "./family";

// Representative screen colors: anchors and common confusing pairs, not an
// assertion that English color naming has universally agreed boundaries.
const examples: [string, string, ColorFamily][] = [
  ["red", "#FF0000", "Red"],
  ["maroon", "#800000", "Red"],
  ["orange", "#FFA500", "Orange"],
  ["vivid orange", "#FF8000", "Orange"],
  ["yellow", "#FFFF00", "Yellow"],
  ["gold", "#FFD700", "Yellow"],
  ["green", "#008000", "Green"],
  ["lime", "#00FF00", "Green"],
  ["forest green", "#228B22", "Green"],
  ["olive", "#808000", "Green"],
  ["cyan", "#00FFFF", "Cyan"],
  ["sky blue", "#87CEEB", "Cyan"],
  ["teal", "#008080", "Teal"],
  ["turquoise", "#40E0D0", "Teal"],
  ["blue", "#0000FF", "Blue"],
  ["navy", "#000080", "Blue"],
  ["selected blue", "#2563EB", "Blue"],
  ["purple", "#800080", "Purple"],
  ["indigo", "#4B0082", "Purple"],
  ["lavender", "#B57EDC", "Purple"],
  ["pink", "#FFC0CB", "Pink"],
  ["hot pink", "#FF69B4", "Pink"],
  ["magenta", "#FF00FF", "Pink"],
  ["brown", "#A52A2A", "Brown"],
  ["saddle brown", "#8B4513", "Brown"],
  ["tan", "#D2B48C", "Brown"],
  ["black", "#000000", "Black"],
  ["near black", "#080808", "Black"],
  ["gray", "#808080", "Gray"],
  ["light gray", "#D3D3D3", "Gray"],
  ["near neutral with blue tint", "#808085", "Gray"],
  ["white", "#FFFFFF", "White"],
  ["off white", "#FAFAFA", "White"],
];

describe("color families", () => {
  it.each(examples)("identifies %s (%s) as %s", (_, hex, family) => {
    expect(identifyColorFamily(hex)).toBe(family);
  });

  it("labels cyan and teal with the requested familiar family", () => {
    expect(colorFamilyLabel("Cyan")).toBe("Cyan — mostly blue");
    expect(colorFamilyLabel("Teal")).toBe("Teal — mostly green");
    expect(colorFamilyLabel("Purple")).toBe("Purple");
  });

  it("handles lowercase hex and rejects invalid values", () => {
    expect(identifyColorFamily("#ff0000")).toBe("Red");
    expect(() => identifyColorFamily("not a color")).toThrow(TypeError);
  });

  it("assigns every catalog color to one of the 13 families", () => {
    const families = new Set(examples.map(([, , family]) => family));
    expect(families.size).toBe(13);
    for (const color of namedColorCatalog) {
      expect(families.has(identifyColorFamily(color.hex))).toBe(true);
    }
  });
});
