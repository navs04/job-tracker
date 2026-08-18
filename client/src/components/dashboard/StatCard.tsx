interface StatCardProps {
  label: string;
  value: string | number;
  accent?: "default" | "green" | "red" | "indigo";
}

const ACCENT_STYLES: Record<string, string> = {
  default: "text-gray-900",
  green: "text-green-600",
  red: "text-red-600",
  indigo: "text-indigo-600",
};

export default function StatCard({ label, value, accent = "default" }: StatCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</p>
      <p className={`text-2xl font-bold mt-1 ${ACCENT_STYLES[accent]}`}>{value}</p>
    </div>
  );
}