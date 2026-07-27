import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext.jsx';

// Animated light/dark theme switch
const ThemeToggle = ({ className = '' }) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      role="switch"
      aria-checked={isDark}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Light mode' : 'Dark mode'}
      className={`relative inline-flex h-9 w-16 shrink-0 items-center rounded-full p-1 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-brand-400 focus:ring-offset-2 dark:focus:ring-offset-ink-900 ${
        isDark ? 'bg-ink-700' : 'bg-brand-100'
      } ${className}`}
    >
      {/* Track icons */}
      <Sun
        size={14}
        className={`absolute left-2 text-amber-500 transition-opacity ${isDark ? 'opacity-40' : 'opacity-0'}`}
      />
      <Moon
        size={13}
        className={`absolute right-2 text-ocean-300 transition-opacity ${isDark ? 'opacity-0' : 'opacity-40'}`}
      />
      {/* Knob */}
      <span
        style={{ backgroundColor: isDark ? '#e2e8f0' : '#ffffff' }}
        className={`relative flex h-7 w-7 items-center justify-center rounded-full shadow-card transition-transform duration-300 ${
          isDark ? 'translate-x-7' : 'translate-x-0'
        }`}
      >
        {isDark ? (
          <Moon size={15} className="text-ink-700" fill="currentColor" />
        ) : (
          <Sun size={15} className="text-amber-500" />
        )}
      </span>
    </button>
  );
};

export default ThemeToggle;
