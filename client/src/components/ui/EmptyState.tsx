interface EmptyStateProps {
  message: string;
  action?: { label: string; onClick: () => void };
}

export default function EmptyState({ message, action }: EmptyStateProps) {
  return (
    <div className="text-center py-16 text-gray-500 border border-dashed border-gray-300 rounded-lg">
      <p>{message}</p>
      {action && (
        <button onClick={action.onClick} className="mt-3 text-sm text-indigo-600 hover:underline font-medium">
          {action.label}
        </button>
      )}
    </div>
  );
}