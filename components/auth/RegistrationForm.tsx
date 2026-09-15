"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button, Input, Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { useRouter } from "next/navigation";
import { User, Phone, Mail, Lock } from "lucide-react";

/**
 * Registration Form
 * Collector account registration with validation
 */

const registrationSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().regex(/^\+?[1-9]\d{9,14}$/, "Invalid phone number"),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegistrationFormData = z.infer<typeof registrationSchema>;

export function RegistrationForm() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
  });

  const onSubmit = async (data: RegistrationFormData) => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    console.log("Registration data:", data);
    
    // Navigate to phone verification
    router.push("/verify-phone");
    
    setIsLoading(false);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-center">Create Account</CardTitle>
        <p className="text-center text-sm text-[var(--muted-foreground)]">
          Join WasteFi and start earning today
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Full Name */}
          <div>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--muted-foreground)]" />
              <input
                {...register("name")}
                type="text"
                placeholder="Full Name"
                className="w-full h-12 pl-11 pr-4 rounded-md border border-[var(--border)] bg-[var(--background)] focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent outline-none"
              />
            </div>
            {errors.name && (
              <p className="text-sm text-[var(--error)] mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Phone Number */}
          <div>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--muted-foreground)]" />
              <input
                {...register("phone")}
                type="tel"
                placeholder="Phone Number (+1234567890)"
                className="w-full h-12 pl-11 pr-4 rounded-md border border-[var(--border)] bg-[var(--background)] focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent outline-none"
              />
            </div>
            {errors.phone && (
              <p className="text-sm text-[var(--error)] mt-1">{errors.phone.message}</p>
            )}
          </div>

          {/* Email (Optional) */}
          <div>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--muted-foreground)]" />
              <input
                {...register("email")}
                type="email"
                placeholder="Email (Optional)"
                className="w-full h-12 pl-11 pr-4 rounded-md border border-[var(--border)] bg-[var(--background)] focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent outline-none"
              />
            </div>
            {errors.email && (
              <p className="text-sm text-[var(--error)] mt-1">{errors.email.message}</p>
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
                className="w-full h-12 pl-11 pr-4 rounded-md border border-[var(--border)] bg-[var(--background)] focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent outline-none"
              />
            </div>
            {errors.password && (
              <p className="text-sm text-[var(--error)] mt-1">{errors.password.message}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--muted-foreground)]" />
              <input
                {...register("confirmPassword")}
                type="password"
                placeholder="Confirm Password"
                className="w-full h-12 pl-11 pr-4 rounded-md border border-[var(--border)] bg-[var(--background)] focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent outline-none"
              />
            </div>
            {errors.confirmPassword && (
              <p className="text-sm text-[var(--error)] mt-1">{errors.confirmPassword.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            loading={isLoading}
            className="mt-6"
          >
            Create Account
          </Button>

          {/* Login Link */}
          <p className="text-center text-sm text-[var(--muted-foreground)]">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => router.push("/login")}
              className="text-[var(--primary)] font-medium hover:underline"
            >
              Sign In
            </button>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
