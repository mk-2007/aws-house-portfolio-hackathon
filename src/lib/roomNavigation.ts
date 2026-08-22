import { getCorridorDoorStand, type RoomId } from "@/components/scene/corridorLayout";
import { usePlayerStore } from "@/store/playerStore";
import { useSpaceStore } from "@/store/spaceStore";

/** Walk to a door from the corridor and enter it on arrival. */
export function enterRoom(id: RoomId) {
  const stand = getCorridorDoorStand(id);
  useSpaceStore.getState().setPendingEntry(id);
  usePlayerStore.getState().setTarget([stand.x, stand.z]);
}

/** Exit the current room back to the corridor, at the door you'd have
 *  entered through. */
export function exitToCorridor(from: RoomId) {
  const stand = getCorridorDoorStand(from);
  useSpaceStore.getState().requestTransition("corridor", stand);
}

/** Exit the current room, then immediately continue the walk into
 *  another room once the corridor is reached — reads as one trip. */
export function jumpToRoom(from: RoomId, to: RoomId) {
  const stand = getCorridorDoorStand(from);
  useSpaceStore.getState().requestTransition("corridor", stand);
  useSpaceStore.getState().setChainTo(to);
}
