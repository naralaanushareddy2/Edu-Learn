import { createContext, useEffect, useState } from "react";

const ThemeContext = createContext();

const THEME_STORAGE_KEY = "edulearn_theme";

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    try {
      const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
      if (savedTheme === "dark" || savedTheme === "light") {
        return savedTheme;
      }
      if (
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches
      ) {
        return "dark";
      }
    } catch {
      // Fallback in environments without localStorage/matchMedia
    }
    return "light";
  });

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;

    root.setAttribute("data-theme", theme);
    body.setAttribute("data-theme", theme);

    if (theme === "dark") {
      root.classList.add("dark-theme");
      body.classList.add("dark-theme");
      root.classList.remove("light-theme");
      body.classList.remove("light-theme");
    } else {
      root.classList.add("light-theme");
      body.classList.add("light-theme");
      root.classList.remove("dark-theme");
      body.classList.remove("dark-theme");
    }

    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // localStorage may fail in private browsing modes
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  const isDark = theme === "dark";

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isDark, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;
