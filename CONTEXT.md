# Web Color Identification

A single-session web application for turning a selected browser color into a useful named-color match.

## Language

**Selected color**:
The current sRGB color the person is inspecting; it controls the full-bleed background and all displayed color representations.
_Avoid_: active color, input color

**Named-color match**:
The single catalog color identified as closest to the selected color under the MVP matching rule. It always exists for a selected sRGB color.
_Avoid_: color name, nearest color

**Exact named-color match**:
A named-color match whose catalog hex is identical to the selected color's sRGB hex. When absent, the interface presents the selected color and its named-color match in equal vertical halves.
_Avoid_: no named match

**Named-color catalog**:
The fixed collection of named sRGB colors against which a selected color is matched. The MVP uses the `color-name-list` Best Of subset.
_Avoid_: palette, database
