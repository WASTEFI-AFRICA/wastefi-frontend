"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button, Card, CardContent, CardHeader, CardTitle, FormError } from "@/components/ui";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { homePath, login, safeNextPath } from "@/lib/api/auth";
import { DemoAccounts } from "./DemoAccounts";
import { Phone, Lock } from "lucide-react";

/**
 * Login Form
 * Signs in through POST /api/v1/auth/login and sends the user to the home screen
 * for their role, or back to the page that asked them to sign in.
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
  const [error, setError] = useState<string | null>(null);
  const [isSlow, setIsSlow] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const setAuth = useAuthStore((state) => state.setAuth);

  // The demo API sleeps when idle; tell the user why the first sign-in is slow.
  useEffect(() => {
    if (!isLoading) return;
    const timer = setTimeout(() => setIsSlow(true), 4000);
    return () => clearTimeout(timer);
  }, [isLoading]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setIsSlow(false);
    setError(null);

    try {
      const session = await login(data.phone, data.password);
      setAuth(session.user, session.accessToken, session.refreshToken);
      router.replace(safeNextPath(searchParams.get("next")) ?? homePath(session.user.role));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Sign-in failed. Please try again.");
    } finally {
      setIsLoading(false);
      setIsSlow(false);
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
          <DemoAccounts
            busy={isLoading}
            onUse={(phone, password) => {
              // Fill the form so the user sees which account is signing in, then sign in.
              setValue("phone", phone, { shouldValidate: true });
              setValue("password", password, { shouldValidate: true });
              void handleSubmit(onSubmit)();
            }}
          />

          {error && (
            <div
              role="alert"
              className="rounded-md border border-[var(--error)] bg-[var(--background)] p-3 text-sm text-[var(--error)]"
            >
              {error}
            </div>
          )}

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

          {isSlow && (
            <p className="text-center text-sm text-[var(--muted-foreground)]" role="status">
              Waking up the demo server. The first sign-in can take up to a minute.
            </p>
          )}

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
