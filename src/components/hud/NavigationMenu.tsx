"use client";

import type { IconType } from "react-icons";
import { TbHome, TbTool, TbBox, TbUser, TbDoorExit } from "react-icons/tb";
import { DOORS, type RoomId } from "@/components/scene/corridorLayout";
import { useSpaceStore } from "@/store/spaceStore";
import { enterRoom, exitToCorridor, jumpToRoom } from "@/lib/roomNavigation";

const ROOM_ICONS: Record<RoomId, IconType> = {
  home: TbHome,
  skills: TbTool,
  projects: TbBox,
  about: TbUser,
};

/**
 * A horizontal glassy directory bar, bottom-of-screen — matches the
 * reference look directly: icon + label pill buttons in a row, rather
 * than the earlier circular console. Bottom placement keeps it clear of
 * the room signboards and content up top. Same component drives both
 * the corridor's room-picker and each room's exit/jump-to-room actions,
 * so the interaction is consistent everywhere.
 */
export default function NavigationMenu() {
  const space = useSpaceStore((s) => s.space);
  const isCorridor = space === "corridor";

  const items: { key: string; label: string; icon: IconType; onClick: () => void }[] = isCorridor
    ? DOORS.map((d) => ({ key: d.id, label: d.label, icon: ROOM_ICONS[d.id], onClick: () => enterRoom(d.id) }))
    : [
        { key: "exit", label: "Exit", icon: TbDoorExit, onClick: () => exitToCorridor(space as RoomId) },
        ...DOORS.filter((d) => d.id !== space).map((d) => ({
          key: d.id,
          label: d.label,
          icon: ROOM_ICONS[d.id],
          onClick: () => jumpToRoom(space as RoomId, d.id),
        })),
      ];

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 select-none">
      <div
        className="flex items-center gap-2 px-3 py-2.5 rounded-2xl backdrop-blur-md"
        style={{
          background: "rgba(18,15,11,0.72)",
          border: "1px solid rgba(236,230,216,0.22)",
          boxShadow: "0 16px 44px rgba(0,0,0,0.55)",
        }}
      >
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.key}
              onClick={item.onClick}
              className="flex items-center gap-2 rounded-xl px-4 py-2.5 border border-[var(--color-paper)]/25 text-[var(--color-paper)] bg-[var(--color-ink)]/40 hover:bg-[var(--color-masthead)]/55 hover:border-[var(--color-paper)]/50 transition-colors"
            >
              <Icon size={18} />
              <span
                className="font-[family-name:var(--font-bacley)] tracking-widest uppercase whitespace-nowrap"
                style={{ fontSize: "clamp(0.7rem, 1vw, 0.85rem)" }}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
