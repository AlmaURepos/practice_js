import React, { useMemo, useState } from "react";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import {
  ThemedBadge,
  ThemedButton,
  ThemedCard,
  ThemedInput,
  ThemedText,
  ThemeSwitcher,
} from "./components/ThemedComponents";

function DemoContent() {
  const { theme, isDark } = useTheme();
  const [email, setEmail] = useState("");

  const emailError = useMemo(() => {
    if (!email) {
      return "";
    }

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
      ? ""
      : "Enter a valid email";
  }, [email]);

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: theme.colors.background,
        color: theme.colors.text,
        padding: theme.spacing.xl,
        fontFamily: theme.typography.fontFamily,
      }}
    >
      <div
        style={{
          maxWidth: "860px",
          margin: "0 auto",
          display: "grid",
          gap: theme.spacing.lg,
        }}
      >
        <ThemedCard elevated>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: theme.spacing.md,
            }}
          >
            <div style={{ display: "grid", gap: theme.spacing.xs }}>
              <ThemedText variant="title">Lab13.1: withTheme HOC</ThemedText>
              <ThemedText variant="caption">
                Active theme: {theme.name} ({isDark ? "dark" : "light"})
              </ThemedText>
            </div>
            <ThemeSwitcher />
          </div>
        </ThemedCard>

        <ThemedCard>
          <div style={{ display: "grid", gap: theme.spacing.md }}>
            <ThemedText variant="subtitle">Buttons and Styles Injection</ThemedText>
            <div style={{ display: "flex", flexWrap: "wrap", gap: theme.spacing.sm }}>
              <ThemedButton variant="primary">Primary</ThemedButton>
              <ThemedButton variant="secondary">Secondary</ThemedButton>
              <ThemedButton variant="outline">Outline</ThemedButton>
              <ThemedButton variant="ghost">Ghost</ThemedButton>
              <ThemedBadge>withStyles HOC</ThemedBadge>
            </div>
          </div>
        </ThemedCard>

        <ThemedCard>
          <div style={{ display: "grid", gap: theme.spacing.sm }}>
            <ThemedText variant="subtitle">Input with Theme-Aware Validation</ThemedText>
            <ThemedInput
              label="Email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={emailError}
            />
          </div>
        </ThemedCard>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <DemoContent />
    </ThemeProvider>
  );
}
