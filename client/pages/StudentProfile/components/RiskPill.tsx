interface RiskPillProps {
  risk?: string;
}

export function RiskPill({ risk }: RiskPillProps) {
  if (!risk) return null;
  
  const cls =
    risk === "Yüksek"
      ? "bg-red-100 text-red-700"
      : risk === "Orta"
        ? "bg-amber-100 text-amber-700"
        : "bg-emerald-100 text-emerald-700";
        
  return <span className={`px-2 py-1 rounded text-xs ${cls}`}>{risk}</span>;
}
