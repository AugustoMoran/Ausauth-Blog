import React from 'react';
import { useTheme } from './ThemeContext.jsx';

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const isDark = theme === 'dark';

  const toggle = () => setTheme(isDark ? 'light' : 'dark');

  return (
    <button
      aria-label={isDark ? 'Activar tema claro' : 'Activar tema oscuro'}
      onClick={toggle}
      style={{
        position: 'fixed',
        top: 16,
        right: 16,
        zIndex: 1000,
        background: 'none',
        border: 'none',
        padding: 0,
        cursor: 'pointer',
        fontSize: 28,
        color: 'var(--color-text)'
      }}
      title={isDark ? 'Tema claro' : 'Tema oscuro'}
    >
      {isDark ? '🌙' : '☀️'}
    </button>
  );
}
