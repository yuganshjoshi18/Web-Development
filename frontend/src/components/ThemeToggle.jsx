import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext.jsx';

/**
 * Icon-only theme switch. The label changes so it is meaningful to screen
 * readers and shows a tooltip on hover.
 */
export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const nextTheme = theme === 'dark' ? 'light' : 'dark';

  return (
    <button
      type="button"
      className="icon-button theme-toggle"
      onClick={toggleTheme}
      aria-label={`Switch to ${nextTheme} mode`}
      title={`Switch to ${nextTheme} mode`}
    >
      {theme === 'dark' ? (
        <Sun size={19} strokeWidth={1.8} aria-hidden="true" />
      ) : (
        <Moon size={19} strokeWidth={1.8} aria-hidden="true" />
      )}
    </button>
  );
}
