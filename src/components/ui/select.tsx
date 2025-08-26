// src/components/ui/select.tsx
import { forwardRef, SelectHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
  helperText?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, error, helperText, ...props }, ref) => {
    return (
      <div className="w-full">
        <select
          className={cn(
            "flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-red-500 focus:ring-red-500",
            className
          )}
          ref={ref}
          {...props}
        >
          {children}
        </select>
        {helperText && (
          <p
            className={cn(
              "mt-1 text-xs",
              error ? "text-red-500" : "text-gray-500"
            )}
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";

export { Select };
