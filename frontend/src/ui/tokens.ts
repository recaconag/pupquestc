/**
 * Premium UI tokens for PUPQuestC (Tailwind class presets).
 * These are intentionally "string tokens" so they work everywhere (Flowbite or custom UI),
 * keeping spacing, focus rings, shadows, and motion consistent.
 */
export const ui = {
  focusRing:
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500/70 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950",
  motion: "transition-all duration-200 ease-out",
  surface:
    "bg-gray-900/90 backdrop-blur-xl border border-yellow-600/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)]",
  linkUnderline:
    "after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:bg-gradient-to-r after:from-red-700 after:to-yellow-500 after:transition-all after:duration-300",
  nav: {
    desktopGap: "md:gap-7",
    desktopItem:
      "md:inline-block md:rounded-none md:bg-transparent md:px-3 md:py-2 md:hover:bg-transparent",
    mobileItem:
      "block rounded-lg px-3 py-2 hover:bg-white/5 active:bg-white/10",
  },
  button: {
    primary:
      "bg-gradient-to-br from-red-700 to-red-900 hover:from-red-600 hover:to-red-800 text-white shadow-[0_2px_8px_rgba(128,0,0,0.40)] hover:shadow-[0_4px_16px_rgba(128,0,0,0.55)]",
    ghost:
      "bg-white/5 hover:bg-white/10 text-gray-100 border border-white/10 hover:border-white/20",
    danger:
      "bg-gradient-to-br from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 text-white shadow-[0_2px_8px_rgba(128,0,0,0.40)] hover:shadow-[0_4px_16px_rgba(128,0,0,0.55)]",
  },
} as const;

