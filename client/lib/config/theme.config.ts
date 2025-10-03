export const CHART_COLORS = {
  primary: "#2563eb",
  success: "#16a34a",
  warning: "#d97706",
  danger: "#dc2626",
  info: "#0891b2",
  muted: "#6b7280",
  accent: "#7c3aed",
} as const;

export const RISK_COLORS = {
  Düşük: "#16a34a",
  Orta: "#d97706",
  Yüksek: "#dc2626",
  Kritik: "#991b1b",
} as const;

export const PERFORMANCE_COLORS = [
  "#16a34a",
  "#22c55e",
  "#65a30d",
  "#84cc16",
  "#a3e635",
] as const;

export type RiskLevel = keyof typeof RISK_COLORS;
export type ChartColorKey = keyof typeof CHART_COLORS;
