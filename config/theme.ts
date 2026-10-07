export const theme = {
  colors: {
    brand: "#002B5A",
    brandStrong: "#001C3D",
    brandSoft: "#E8EEF6",
    accent: "#2F7DF6",
    ink: "#0B1424",
    inkMuted: "#4A5568",
    inkSubtle: "#6B7685",
    line: "#E3E7ED",
    lineStrong: "#C9D1DC",
    surface: "#FFFFFF",
    surfaceMuted: "#F5F7FA",
    success: "#0F7B4F",
    warning: "#9A6200",
    danger: "#B42318",
  },
  radius: {
    sm: "2px",
    md: "6px",
    lg: "8px",
  },
  layout: {
    maxWidth: "1320px",
    readingWidth: "680px",
  },
} as const;

export type ThemeColor = keyof typeof theme.colors;

export function themeCssVariables(): Record<string, string> {
  const variables: Record<string, string> = {};
  for (const [key, value] of Object.entries(theme.colors)) {
    variables[`--theme-${key.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`)}`] = value;
  }
  for (const [key, value] of Object.entries(theme.radius)) {
    variables[`--theme-radius-${key}`] = value;
  }
  variables["--theme-max-width"] = theme.layout.maxWidth;
  variables["--theme-reading-width"] = theme.layout.readingWidth;
  return variables;
}
