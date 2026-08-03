import { startTransition, useEffect, useState } from 'react';
import { ThemeContext } from './ThemeContextValue';

const getInitialTheme = () => {
  if (typeof window === 'undefined') {
    return 'light';
  }

  const storedTheme = localStorage.getItem('theme');

  if (storedTheme === 'light' || storedTheme === 'dark') {
    return storedTheme;
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    const root = document.documentElement;
    const themeColorMeta = document.querySelector('meta[name="theme-color"]');
    root.classList.toggle('dark', theme === 'dark');
    root.setAttribute('data-theme', theme);
    root.style.colorScheme = theme;

    if (themeColorMeta) {
      themeColorMeta.setAttribute('content', theme === 'dark' ? '#020617' : '#f8fbff');
    }

    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    startTransition(() => {
      setTheme((current) => (current === 'dark' ? 'light' : 'dark'));
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, isDark: theme === 'dark', toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
