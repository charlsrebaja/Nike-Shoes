// src/components/ui/alert.tsx
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const alertVariants = cva(
  "relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-gray-900",
  {
    variants: {
      variant: {
        default: "bg-white text-gray-900 border-gray-200",
        info: "bg-blue-50 text-blue-900 border-blue-200 [&>svg]:text-blue-900",
        success:
          "bg-green-50 text-green-900 border-green-200 [&>svg]:text-green-900",
        warning:
          "bg-yellow-50 text-yellow-900 border-yellow-200 [&>svg]:text-yellow-900",
        error: "bg-red-50 text-red-900 border-red-200 [&>svg]:text-red-900",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {}

function Alert({ className, variant, ...props }: AlertProps) {
  return (
    <div className={cn(alertVariants({ variant }), className)} {...props} />
  );
}

const AlertTitle = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h5
    className={cn("mb-1 font-medium leading-none tracking-tight", className)}
    {...props}
  />
);

const AlertDescription = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) => (
  <div className={cn("text-sm [&_p]:leading-relaxed", className)} {...props} />
);

export { Alert, AlertTitle, AlertDescription };
