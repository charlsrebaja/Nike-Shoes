// src/components/ui/spinner.tsx
import { cn } from "@/lib/utils";

interface SpinnerProps {
  size?: "small" | "medium" | "large";
  className?: string;
}

const sizeClasses = {
  small: "h-4 w-4 border-2",
  medium: "h-8 w-8 border-2",
  large: "h-12 w-12 border-3",
};

export const Spinner = ({ size = "medium", className }: SpinnerProps) => {
  return (
    <div
      className={cn(
        "animate-spin rounded-full border-solid border-gray-300 border-t-black",
        sizeClasses[size],
        className
      )}
    />
  );
};
