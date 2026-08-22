import type { PageServerLoad } from "./$types";

import { namedColorCatalog } from "$lib/color/catalog";
import { randomNamedColor } from "$lib/color/color";

export const load: PageServerLoad = () => ({
  initialSelectedColor: randomNamedColor(namedColorCatalog).hex,
});
