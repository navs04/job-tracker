import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  accent?: "default" | "success" | "danger" | "accent";
  helper?: string;
}

const ACCENT_STYLES: Record<string, { text: string; iconBg: string; iconText: string }> = {
  default: { text: "text-ink", iconBg: "bg-canvas", iconText: "text-muted" },
  accent: { text: "text-ink", iconBg: "bg-accent-bg", iconText: "text-accent" },
  success: { text: "text-ink", iconBg: "bg-status-offer-bg", iconText: "text-status-offer" },
  danger: { text: "text-ink", iconBg: "bg-status-rejected-bg", iconText: "text-status-rejected" },
};

export default function StatCard({ label, value, icon: Icon, accent = "default", helper }: StatCardProps) {
  const style = ACCENT_STYLES[accent];
  return (
    <div className="bg-surface border border-border rounded-lg p-4 hover:border-ink/20 transition-colors duration-150">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-medium text-muted uppercase tracking-wide">{label}</p>
        <div className={`w-7 h-7 rounded-md flex items-center justify-center ${style.iconBg}`}>
          <Icon size={14} className={style.iconText} strokeWidth={2} />
        </div>
      </div>
      <p className={`font-mono text-2xl font-semibold ${style.text}`}>{value}</p>
      {helper && <p className="text-xs text-faint mt-1">{helper}</p>}
    </div>
  );
}