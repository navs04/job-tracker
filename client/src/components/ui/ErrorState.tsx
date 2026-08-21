interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export default function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="text-center py-16">
      <p className="text-red-600 text-sm mb-3">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="text-sm text-indigo-600 hover:underline font-medium">
          Try again
        </button>
      )}
    </div>
  );
}