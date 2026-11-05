"use client";

import { useEffect, useState, type ComponentType, type InputHTMLAttributes } from "react";
import { useForm, type UseFormRegisterReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Clock, Lock, Mail, Phone, User } from "lucide-react";
import { Button, Card, CardContent, CardHeader, CardTitle, FormError } from "@/components/ui";
import { useAuthStore } from "@/store/authStore";
import { homePath, isAwaitingActivation, login, registerAccount } from "@/lib/api/auth";

/**
 * Registration Form
 * Creates a collector account through POST /api/v1/auth/register, then signs in.
 * On the public demo new accounts are active at once; elsewhere they wait for an
 * administrator, and the form says so instead of signing in.
 */

// The same rules the API applies, so mistakes are caught before the request.
const registrationSchema = z
  .object({
    firstName: z.string().trim().min(1, "First name is required").max(50, "First name is too long"),
    lastName: z.string().trim().min(1, "Last name is required").max(50, "Last name is too long"),
    phone: z
      .string()
      .min(1, "Phone number is required")
      .regex(/^\+[1-9]\d{9,14}$/, "Enter your number with the country code, for example +254712345678"),
    email: z
      .string()
      .optional()
      .or(z.literal(""))
      .refine((val) => !val || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), {
        message: "Please enter a valid email address",
      }),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .regex(/[A-Z]/, "Password must contain an uppercase letter")
      .regex(/[a-z]/, "Password must contain a lowercase letter")
      .regex(/[0-9]/, "Password must contain a number")
      .regex(/[^A-Za-z0-9]/, "Password must contain a symbol, for example ! or #"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match. Please try again.",
    path: ["confirmPassword"],
  });

type RegistrationFormData = z.infer<typeof registrationSchema>;

interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  icon: ComponentType<{ className?: string }>;
  registration: UseFormRegisterReturn;
  error?: string;
}

function Field({ icon: Icon, registration, error, id, ...input }: FieldProps) {
  const errorId = `${id}-error`;
  return (
    <div>
      <div className="relative">
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--muted-foreground)]" />
        <input
          id={id}
          {...registration}
          {...input}
          className={`w-full h-12 pl-11 pr-4 rounded-md border ${
            error
              ? "border-[var(--error)] focus:ring-[var(--error)]"
              : "border-[var(--border)] focus:ring-[var(--primary)]"
          } bg-[var(--background)] focus:ring-2 focus:border-transparent outline-none`}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? errorId : undefined}
        />
      </div>
      {error && <FormError message={error} id={errorId} />}
    </div>
  );
}

export function RegistrationForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSlow, setIsSlow] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [awaitingActivation, setAwaitingActivation] = useState(false);
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
  });

  // The demo API sleeps when idle; tell the user why the first request is slow.
  useEffect(() => {
    if (!isLoading) return;
    const timer = setTimeout(() => setIsSlow(true), 4000);
    return () => clearTimeout(timer);
  }, [isLoading]);

  const onSubmit = async (data: RegistrationFormData) => {
    setIsLoading(true);
    setIsSlow(false);
    setError(null);

    try {
      await registerAccount({
        firstName: data.firstName,
        lastName: data.lastName,
        phoneNumber: data.phone,
        email: data.email,
        password: data.password,
      });
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "The account could not be created.");
      setIsLoading(false);
      setIsSlow(false);
      return;
    }

    try {
      const session = await login(data.phone, data.password);
      setAuth(session.user, session.accessToken, session.refreshToken);
      router.replace(homePath(session.user.role));
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : "";
      if (isAwaitingActivation(message)) {
        setAwaitingActivation(true);
      } else {
        setError(`Your account was created, but signing in failed: ${message} Try signing in.`);
      }
    } finally {
      setIsLoading(false);
      setIsSlow(false);
    }
  };

  if (awaitingActivation) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-center">Account created</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <Clock className="w-10 h-10 mx-auto text-[var(--primary)]" aria-hidden="true" />
          <p className="text-sm">
            Your account is waiting to be activated. A WasteFi administrator checks new
            accounts before they can record collections and be paid. You can sign in as
            soon as it is active.
          </p>
          <Link href="/login" className="text-[var(--primary)] font-medium underline underline-offset-4">
            Go to sign in
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-center">Create Account</CardTitle>
        <p className="text-center text-sm text-[var(--muted-foreground)]">
          Join WasteFi as a collector and get paid in WASTE on Stellar
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          {error && (
            <div
              role="alert"
              className="rounded-md border border-[var(--error)] bg-[var(--background)] p-3 text-sm text-[var(--error)]"
            >
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field
              id="first-name"
              icon={User}
              registration={register("firstName")}
              error={errors.firstName?.message}
              type="text"
              placeholder="First name"
              autoComplete="given-name"
            />
            <Field
              id="last-name"
              icon={User}
              registration={register("lastName")}
              error={errors.lastName?.message}
              type="text"
              placeholder="Last name"
              autoComplete="family-name"
            />
          </div>
          <Field
            id="phone"
            icon={Phone}
            registration={register("phone")}
            error={errors.phone?.message}
            type="tel"
            placeholder="Phone number (+254712345678)"
            autoComplete="tel"
          />
          <Field
            id="email"
            icon={Mail}
            registration={register("email")}
            error={errors.email?.message}
            type="email"
            placeholder="Email (optional)"
            autoComplete="email"
          />
          <Field
            id="password"
            icon={Lock}
            registration={register("password")}
            error={errors.password?.message}
            type="password"
            placeholder="Password"
            autoComplete="new-password"
          />
          <p className="text-xs text-[var(--muted-foreground)] -mt-2">
            At least 8 characters, with upper and lower case letters, a number and a symbol.
          </p>
          <Field
            id="confirm-password"
            icon={Lock}
            registration={register("confirmPassword")}
            error={errors.confirmPassword?.message}
            type="password"
            placeholder="Confirm password"
            autoComplete="new-password"
          />

          <Button type="submit" variant="primary" size="lg" fullWidth loading={isLoading} className="mt-6">
            Create Account
          </Button>

          {isSlow && (
            <p className="text-center text-sm text-[var(--muted-foreground)]" role="status">
              Waking up the demo server. This can take up to a minute.
            </p>
          )}

          <p className="text-center text-sm text-[var(--muted-foreground)]">
            Already have an account?{" "}
            <Link href="/login" className="text-[var(--primary)] font-medium hover:underline">
              Sign In
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
