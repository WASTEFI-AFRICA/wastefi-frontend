"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button, Card, CardContent, CardHeader, CardTitle, FormError } from "@/components/ui";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { Phone, Lock } from "lucide-react";

/**
 * Login Form
 * User authentication with phone and password
 */

const loginSchema = z.object({
  phone: z.string()
    .min(1, "Phone number is required")
    .regex(/^\+?[1-9]\d{9,14}$/, "Please enter a valid phone number (e.g., +1234567890)"),
  password: z.string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters long"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // Mock user data
      const mockUser = {
        id: "user-123",
        name: "John Collector",
        email: "",
        phone: data.phone,
        role: "collector" as const,
        kycStatus: "approved" as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      const mockToken = "mock-jwt-token-" + Date.now();
      
      // Set authentication
      setAuth(mockUser, mockToken);
      
      // Navigate to dashboard
      router.push("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-center">Welcome Back</CardTitle>
        <p className="text-center text-sm text-[var(--muted-foreground)]">
          Sign in to your WasteFi account
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Phone Number */}
          <div>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--muted-foreground)]" />
              <input
                {...register("phone")}
                type="tel"
                placeholder="Phone Number (+1234567890)"
                className={`w-full h-12 pl-11 pr-4 rounded-md border ${
                  errors.phone 
                    ? "border-[var(--error)] focus:ring-[var(--error)]" 
                    : "border-[var(--border)] focus:ring-[var(--primary)]"
                } bg-[var(--background)] focus:ring-2 focus:border-transparent outline-none`}
                aria-invalid={errors.phone ? "true" : "false"}
                aria-describedby={errors.phone ? "phone-error" : undefined}
              />
            </div>
            {errors.phone && (
              <FormError message={errors.phone.message} id="phone-error" />
            )}
          </div>

          {/* Password */}
          <div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--muted-foreground)]" />
              <input
                {...register("password")}
                type="password"
                placeholder="Password"
                className={`w-full h-12 pl-11 pr-4 rounded-md border ${
                  errors.password 
                    ? "border-[var(--error)] focus:ring-[var(--error)]" 
                    : "border-[var(--border)] focus:ring-[var(--primary)]"
                } bg-[var(--background)] focus:ring-2 focus:border-transparent outline-none`}
                aria-invalid={errors.password ? "true" : "false"}
                aria-describedby={errors.password ? "password-error" : undefined}
              />
            </div>
            {errors.password && (
              <FormError message={errors.password.message} id="password-error" />
            )}
          </div>

          {/* Forgot Password */}
          <div className="text-right">
            <button
              type="button"
              className="text-sm text-[var(--primary)] hover:underline"
              onClick={() => router.push("/forgot-password")}
            >
              Forgot Password?
            </button>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            loading={isLoading}
          >
            Sign In
          </Button>

          {/* Register Link */}
          <p className="text-center text-sm text-[var(--muted-foreground)]">
            Don&apos;t have an account?{" "}
            <button
              type="button"
              onClick={() => router.push("/register")}
              className="text-[var(--primary)] font-medium hover:underline"
            >
              Create Account
            </button>
          </p>

          {/* Public stats: no account needed */}
          <p className="text-center text-sm">
            <Link href="/stats" className="text-[var(--primary)] font-medium underline underline-offset-4">
              Just looking? See live platform stats
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
