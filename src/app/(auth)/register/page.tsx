// src/app/(auth)/register/page.tsx
"use client";

import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormInput } from "@/components/ui/form-input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";

// Define the registration form schema
const registerSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const methods = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.message || "Registration failed");
        return;
      }

      // Automatically sign in after successful registration
      await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      router.push("/");
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl: "/" });
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Create an Account</CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="error" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
            <FormInput
              name="name"
              label="Name"
              placeholder="Enter your name"
              disabled={isLoading}
            />
            <FormInput
              name="email"
              label="Email"
              type="email"
              placeholder="Enter your email"
              disabled={isLoading}
            />
            <FormInput
              name="password"
              label="Password"
              type="password"
              placeholder="Create a password"
              disabled={isLoading}
            />
            <FormInput
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              placeholder="Confirm your password"
              disabled={isLoading}
            />
            <Button
              type="submit"
              fullWidth
              disabled={isLoading}
              className="mt-2"
            >
              {isLoading ? <Spinner size="small" className="mr-2" /> : null}
              Create Account
            </Button>
          </form>
        </FormProvider>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                Or continue with
              </span>
            </div>
          </div>

          <div className="mt-6">
            <Button
              type="button"
              variant="secondary"
              fullWidth
              onClick={handleGoogleSignIn}
              disabled={isLoading}
            >
              <svg
                className="w-5 h-5 mr-2"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12.0002 4.75C13.7702 4.75 15.3502 5.36 16.6102 6.47L20.1902 2.88C18.0702 1.08 15.2102 0 12.0002 0C7.31016 0 3.25016 2.69 1.27016 6.61L5.37016 9.82C6.35016 6.83 8.98016 4.75 12.0002 4.75Z"
                  fill="#EA4335"
                />
                <path
                  d="M23.49 12.27C23.49 11.48 23.42 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.33 17.24 16.07 18.09L20.05 21.19C22.3 19.14 23.49 15.99 23.49 12.27Z"
                  fill="#4285F4"
                />
                <path
                  d="M5.37 14.17C5.13 13.47 5 12.73 5 11.99C5 11.25 5.13 10.51 5.37 9.81L1.27 6.6C0.46 8.23 0 10.05 0 11.99C0 13.94 0.46 15.77 1.27 17.4L5.37 14.17Z"
                  fill="#FBBC05"
                />
                <path
                  d="M12.0002 24C15.2402 24 17.9502 22.94 20.0502 21.18L16.0702 18.08C15.0002 18.82 13.6202 19.25 12.0002 19.25C8.9802 19.25 6.3502 17.17 5.3702 14.17L1.2702 17.39C3.2502 21.31 7.3102 24 12.0002 24Z"
                  fill="#34A853"
                />
              </svg>
              Sign up with Google
            </Button>
          </div>
        </div>

        <p className="text-center mt-6 text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-black font-medium hover:underline"
          >
            Sign in
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
