import { useCallback, useState } from "react";

/**
 * Reader-chosen text size (DES-41: larger text options for retirees).
 * Scales the root font size, so every rem-based size on the site grows with it. Remembered on this device.
 */
export type TextSize = "normal" | "large" | "xlarge";

export const TEXT_SIZES: { id: TextSize; label: string; name: string; scale: string }[] = [
  { id: "normal", label: "A", name: "Normal text", scale: "100%" },
  { id: "large", label: "A+", name: "Large text", scale: "112.5%" },
  { id: "xlarge", label: "A++", name: "Largest text", scale: "125%" },
];

const KEY = "pencom:text-size";

export function readTextSize(): TextSize {
  try {
    const v = window.localStorage.getItem(KEY);
    return v === "large" || v === "xlarge" ? v : "normal";
  } catch {
    return "normal";
  }
}

export function applyTextSize(size: TextSize) {
  const s = TEXT_SIZES.find((x) => x.id === size) ?? TEXT_SIZES[0];
  document.documentElement.style.fontSize = s.id === "normal" ? "" : s.scale;
  try {
    window.localStorage.setItem(KEY, s.id);
  } catch {
    /* storage unavailable: lasts for this visit */
  }
}

export function useTextSize() {
  const [size, setSize] = useState<TextSize>(readTextSize);
  const set = useCallback((s: TextSize) => {
    applyTextSize(s);
    setSize(s);
  }, []);
  return [size, set] as const;
}
