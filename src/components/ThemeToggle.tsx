import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

type Theme = "light" | "dark";

const STORAGE_KEY = "portfolio-theme";

function getSystemTheme(): Theme {
  if (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    return "dark";
  }
  return "light";
}

function readStoredTheme(): Theme | null {
  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    return value === "light" || value === "dark" ? value : null;
  } catch {
    return null;
  }
}

function applyThemeToDocument(resolvedTheme: Theme, storedOverride: Theme | null) {
  document.documentElement.dataset.theme = resolvedTheme;
  const meta = document.querySelector('meta[name="color-scheme"]');
  if (meta) {
    meta.setAttribute("content", storedOverride ?? "light dark");
  }
}

export function ThemeToggle() {
  const [storedOverride, setStoredOverride] = useState<Theme | null>(() => readStoredTheme());
  const [theme, setTheme] = useState<Theme>(() => readStoredTheme() ?? getSystemTheme());

  useEffect(() => {
    applyThemeToDocument(theme, storedOverride);
  }, [theme, storedOverride]);

  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key !== null && event.key !== STORAGE_KEY) return;
      const nextStored = readStoredTheme();
      setStoredOverride(nextStored);
      setTheme(nextStored ?? getSystemTheme());
    };

    window.addEventListener("storage", handleStorage);

    let mediaQuery: MediaQueryList | null = null;
    const handleMediaChange = (event: MediaQueryListEvent) => {
      // Never retroactively delete an explicit stored user override when OS changes
      if (readStoredTheme() === null) {
        setTheme(event.matches ? "dark" : "light");
      }
    };

    if (typeof window.matchMedia === "function") {
      mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      if (typeof mediaQuery.addEventListener === "function") {
        mediaQuery.addEventListener("change", handleMediaChange);
      }
    }

    return () => {
      window.removeEventListener("storage", handleStorage);
      if (mediaQuery && typeof mediaQuery.removeEventListener === "function") {
        mediaQuery.removeEventListener("change", handleMediaChange);
      }
    };
  }, []);

  const handleToggle = () => {
    const nextTheme: Theme = theme === "dark" ? "light" : "dark";
    const systemTheme = getSystemTheme();
    const nextOverride: Theme | null = nextTheme === systemTheme ? null : nextTheme;

    try {
      if (nextOverride) {
        window.localStorage.setItem(STORAGE_KEY, nextOverride);
      } else {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      // Still apply theme to the document even if storage is blocked
    }

    setStoredOverride(nextOverride);
    setTheme(nextTheme);
  };

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      className="theme-toggle"
      aria-pressed={isDark}
      onClick={handleToggle}
    >
      {isDark ? <Sun size={18} aria-hidden="true" /> : <Moon size={18} aria-hidden="true" />}
      <span className="theme-toggle-label">Dark theme</span>
    </button>
  );
}
