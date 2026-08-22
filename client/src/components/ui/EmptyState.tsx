import type { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon?: LucideIcon;
  message: string;
  description?: string;
  action?: { label: string; onClick: () => void };
}

export default function EmptyState({ icon: Icon, message, description, action }: EmptyStateProps) {
  return (
    <div className="text-center py-16 px-6 border border-dashed border-border rounded-lg">
      {Icon && (
        <div className="w-12 h-12 rounded-lg bg-accent-bg flex items-center justify-center mx-auto mb-4">
          <Icon size={22} className="text-accent" strokeWidth={1.75} />
        </div>
      )}
      <p className="text-sm font-medium text-ink">{message}</p>
      {description && <p className="text-sm text-faint mt-1 max-w-xs mx-auto">{description}</p>}
      {action && (
        <div className="mt-4">
          <button onClick={action.onClick} className="text-sm text-accent hover:underline font-medium">
            {action.label}
          </button>
        </div>
      )}
    </div>
  );
}