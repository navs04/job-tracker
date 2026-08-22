import type { SelectHTMLAttributes } from "react";

export default function Select({ className = "", children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={`px-3 py-2 border border-border rounded-md text-sm text-ink bg-white transition-shadow duration-150 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent ${className}`}
      {...props}
    >
      {children}
    </select>
  );
}