export const theme = {
  colors: {
    brand: "#0069E8",
    brandStrong: "#0052B8",
    brandSoft: "#E8F1FD",
    accent: "#2F8BFF",
    dark: "#1C1D21",
    ink: "#1B1C20",
    inkMuted: "#4B505B",
    inkSubtle: "#656B77",
    line: "#E6E8EC",
    lineStrong: "#CDD1D8",
    surface: "#FFFFFF",
    surfaceMuted: "#F4F5F7",
    success: "#0F7B4F",
    warning: "#9A6200",
    danger: "#B42318",
  },
  radius: {
    sm: "3px",
    md: "4px",
    lg: "6px",
  },
  layout: {
    maxWidth: "1200px",
    readingWidth: "760px",
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
