/**
 * Projects room geometry. See homeLayout.ts for why spawn is the room's
 * exact center. This room's content is arranged differently from the
 * others though — all 6 project boxes sit in a single row along the
 * BACK wall, all facing the spawn point, like a shelf you're standing
 * in front of, rather than distributed across multiple walls.
 */

export const PROJECTS_SIZE = 11;
export const PROJECTS_HALF = PROJECTS_SIZE / 2;
export const PROJECTS_WALL_HEIGHT = 4.4;

export const PROJECTS_ENTRANCE_Z = PROJECTS_HALF;

export const PROJECTS_SPAWN = { x: 0, z: 0, yaw: 0 };

export const PROJECTS_EXIT_WIDTH = 1.6;
export const PROJECTS_EXIT_HEIGHT = 2.6;
