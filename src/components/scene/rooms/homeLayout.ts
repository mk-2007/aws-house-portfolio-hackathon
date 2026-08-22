/**
 * Home room geometry. Same "single source of truth" pattern as
 * corridorLayout.ts.
 *
 * Spawn is now the room's exact CENTER, not near the entrance — rooms
 * have zero player translation (menu-driven navigation only), so every
 * wall needs to be viewable roughly head-on via nothing but the arc-look
 * rotation. A center spawn makes every wall equidistant and squarely
 * facing-able; an off-center spawn (the old design) meant side-wall
 * content was always viewed at an oblique angle, which is what was
 * actually causing the reported "blurry from the side" issue — drei's
 * HTML-in-3D panels render poorly at shallow viewing angles regardless
 * of whether you're "facing" them in the sense of camera yaw.
 *
 * Wall-by-wall layout (unchanged content assignment):
 *   back wall   (-Z): identity — name, ethos, credentials
 *   left wall   (-X): focus — what's actively being built toward
 *   right wall  (+X): sensibility — design taste, hobbies
 *   front wall  (+Z): entrance/exit door
 */

export const HOME_SIZE = 9;
export const HOME_HALF = HOME_SIZE / 2;
export const HOME_WALL_HEIGHT = 4.2;

export const HOME_ENTRANCE_Z = HOME_HALF;

// Room center — facing yaw 0 (-Z) toward the identity wall by default.
export const HOME_SPAWN = { x: 0, z: 0, yaw: 0 };

export const HOME_EXIT_WIDTH = 1.6;
export const HOME_EXIT_HEIGHT = 2.6;
