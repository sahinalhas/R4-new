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

export const RISK_BADGE_COLORS = {
  Düşük: "bg-green-100 text-green-800",
  Orta: "bg-yellow-100 text-yellow-800",
  Yüksek: "bg-orange-100 text-orange-800",
  Kritik: "bg-red-100 text-red-800",
} as const;

export const MASTERY_COLORS = {
  Başlangıç: "bg-gray-100 text-gray-800",
  Gelişiyor: "bg-blue-100 text-blue-800",
  Yeterli: "bg-green-100 text-green-800",
  İleri: "bg-purple-100 text-purple-800",
} as const;

export const DIFFICULTY_COLORS = {
  Kolay: "bg-green-50 border-green-200",
  Orta: "bg-yellow-50 border-yellow-200",
  Zor: "bg-red-50 border-red-200",
} as const;

export const STATUS_SURFACE_COLORS = {
  success: "bg-green-50 border-green-200",
  error: "bg-red-50 border-red-200",
  neutral: "bg-gray-50 border-gray-200",
} as const;

export const STATUS_BAR_COLORS = {
  success: "bg-green-500",
  warning: "bg-yellow-500",
  danger: "bg-red-500",
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
export type MasteryLevel = keyof typeof MASTERY_COLORS;
export type DifficultyLevel = keyof typeof DIFFICULTY_COLORS;
