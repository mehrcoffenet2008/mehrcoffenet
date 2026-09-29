import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={theme === "dark" ? "فعال‌سازی تم روشن" : "فعال‌سازی تم تاریک"}
      title={theme === "dark" ? "تم روشن" : "تم تاریک"}
    >
      <span className={`theme-toggle-thumb ${theme === "light" ? "light" : ""}`}>
        <span className="theme-toggle-icon">
          {theme === "dark" ? "☀️" : "🌙"}
        </span>
      </span>
    </button>
  );
}
