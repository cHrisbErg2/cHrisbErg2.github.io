import type { ReactNode } from "react";

interface SwapIconProps {
  active: boolean;
  activeIcon: ReactNode;
  inactiveIcon: ReactNode;
  nudgeInactivePlay?: boolean;
  className?: string;
}

/**
 * Keeps both icons mounted and cross-fades with opacity, scale(0.25 -> 1), and blur(4px -> 0)
 * using cubic-bezier(0.2, 0, 0, 1) without adding an external motion runtime.
 */
export function SwapIcon({
  active,
  activeIcon,
  inactiveIcon,
  nudgeInactivePlay = false,
  className = "",
}: SwapIconProps) {
  return (
    <span className={`swap-icon-frame${className ? ` ${className}` : ""}`} aria-hidden="true">
      <span
        className={`swap-icon-layer is-layout${nudgeInactivePlay ? " play-icon-nudge" : ""}${
          active ? " is-hidden" : " is-shown"
        }`}
      >
        {inactiveIcon}
      </span>
      <span className={`swap-icon-layer is-overlay${active ? " is-shown" : " is-hidden"}`}>
        {activeIcon}
      </span>
    </span>
  );
}
