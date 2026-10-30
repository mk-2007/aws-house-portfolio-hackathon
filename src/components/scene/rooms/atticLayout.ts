/**
 * Attic geometry and the corridor-side door position. Like the other rooms
 * the visitor stands at a fixed centre point and looks around (arc look).
 */
export const ATTIC_SIZE = 8;
export const ATTIC_HALF = ATTIC_SIZE / 2;
export const ATTIC_WALL_HEIGHT = 4.2;
export const ATTIC_ENTRANCE_Z = ATTIC_HALF;
export const ATTIC_SPAWN = { x: 0, z: 0, yaw: 0 };
export const ATTIC_EXIT_WIDTH = 1.6;
export const ATTIC_EXIT_HEIGHT = 2.6;

/** The attic door sits on the corridor's far end wall, right of the clock. */
export const ATTIC_DOOR_X = 1.7;
/** Where the visitor stands in front of it (door wall is at z = 12). */
export const ATTIC_DOOR_STAND = { x: ATTIC_DOOR_X, z: 10.7 };
/** Where they reappear in the corridor when leaving the attic, facing down the hall. */
export const ATTIC_EXIT_SPAWN = { x: ATTIC_DOOR_X, z: 10.7, yaw: 0 };
