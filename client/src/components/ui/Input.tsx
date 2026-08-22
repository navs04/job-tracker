import type { InputHTMLAttributes } from "react";

export default function Input({ className = "", ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`w-full px-3 py-2 border border-border rounded-md text-sm text-ink placeholder:text-faint bg-white transition-shadow duration-150 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent ${className}`}
      {...props}
    />
  );
}