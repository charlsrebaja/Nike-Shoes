// src/components/ui/form-input.tsx
"use client";

import { forwardRef } from "react";
import { useFormContext, Controller } from "react-hook-form";
import { Input } from "./input";
import { cn } from "@/lib/utils";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label?: string;
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ className, name, label, type, ...props }, ref) => {
    const {
      control,
      formState: { errors },
    } = useFormContext();
    const errorMessage = errors[name]?.message as string;

    return (
      <div className={cn("space-y-2", className)}>
        {label && (
          <label
            htmlFor={name}
            className="block text-sm font-medium text-gray-700"
          >
            {label}
          </label>
        )}
        <Controller
          control={control}
          name={name}
          render={({ field }) => (
            <Input
              {...field}
              {...props}
              id={name}
              type={type}
              ref={ref}
              error={!!errorMessage}
              helperText={errorMessage}
            />
          )}
        />
      </div>
    );
  }
);

FormInput.displayName = "FormInput";
