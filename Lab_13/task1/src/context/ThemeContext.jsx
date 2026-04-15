import React, { createContext, useContext, useState } from "react";

const ThemeContext = createContext(undefined);

export const lightTheme = {
  name: "light",
  colors: {
    primary: "#0066cc",
    secondary: "#6c757d",
    background: "#ffffff",
    surface: "#f8f9fa",
    text: "#212529",
    textSecondary: "#6c757d",
    border: "#dee2e6",
    error: "#dc3545",
    success: "#28a745",
    warning: "#ffc107",
  },
  spacing: {
    xs: "4px",
    sm: "8px",
    md: "16px",
    lg: "24px",
    xl: "32px",
  },
  typography: {
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    fontSize: {
      xs: "12px",
      sm: "14px",
      md: "16px",
      lg: "18px",
      xl: "24px",
      xxl: "32px",
    },
  },
  borderRadius: {
    sm: "4px",
    md: "8px",
    lg: "12px",
  },
};

export const darkTheme = {
  ...lightTheme,
  name: "dark",
  colors: {
    primary: "#4d9fff",
    secondary: "#adb5bd",
    background: "#1a1a2e",
    surface: "#16213e",
    text: "#e9ecef",
    textSecondary: "#adb5bd",
    border: "#495057",
    error: "#f7412d",
    success: "#3fb950",
    warning: "#d29922",
  },
};

export function ThemeProvider({ children, initialTheme = lightTheme }) {
  const [theme, setTheme] = useState(initialTheme);
  const [isDark, setIsDark] = useState(initialTheme.name === "dark");

  const toggleTheme = () => {
    if (isDark) {
      setTheme(lightTheme);
      setIsDark(false);
    } else {
      setTheme(darkTheme);
      setIsDark(true);
    }
  };

  const value = {
    theme,
    isDark,
    toggleTheme,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
}

export default ThemeContext;
