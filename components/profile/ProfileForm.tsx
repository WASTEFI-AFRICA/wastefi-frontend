"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Check, Save } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { FormError } from "@/components/ui/FormError";
import { APIError } from "@/lib/api/client";
import type { CollectorProfile, ProfileChanges } from "@/lib/api/profile";

const schema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, "Enter your first name")
    .max(100, "Use at most 100 characters"),
  lastName: z
    .string()
    .trim()
    .min(1, "Enter your last name")
    .max(100, "Use at most 100 characters"),
  email: z
    .string()
    .trim()
    .max(254, "Use at most 254 characters")
    .refine(
      (value) => value === "" || z.email().safeParse(value).success,
      "Enter a valid email address",
    ),
  address: z.string().trim().max(500, "Use at most 500 characters"),
  city: z.string().trim().max(120, "Use at most 120 characters"),
});
type FormValues = z.infer<typeof schema>;

function formValues(profile: CollectorProfile): FormValues {
  return {
    firstName: profile.firstName,
    lastName: profile.lastName,
    email: profile.email ?? "",
    address: profile.address ?? "",
    city: profile.city ?? "",
  };
}

const inputClass =
  "w-full rounded-lg border border-[var(--border)] bg-[var(--background)]/40 px-3 py-3 text-sm outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 disabled:opacity-60";
const labelClass = "mb-2 block text-sm font-medium";

export function ProfileForm({
  profile,
  onSave,
}: {
  profile: CollectorProfile;
  onSave: (changes: ProfileChanges) => Promise<CollectorProfile>;
}) {
  const [message, setMessage] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: formValues(profile),
  });

  async function submit(values: FormValues) {
    setMessage(null);
    setSaved(false);
    try {
      const updated = await onSave({
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email || null,
        address: values.address || null,
        city: values.city || null,
      });
      reset(formValues(updated));
      setSaved(true);
    } catch (error) {
      if (error instanceof APIError && error.status === 409) {
        setError(
          "email",
          { message: "This email address is already in use" },
          { shouldFocus: true },
        );
      } else {
        setMessage(
          error instanceof APIError && error.status === 400
            ? "Some details were rejected. Check the form and try again."
            : "We could not confirm the update. Your edits are still here. Try saving again.",
        );
      }
    }
  }

  return (
    <section
      aria-labelledby="profile-details-title"
      className="min-w-0 rounded-2xl border border-[var(--border)] bg-[var(--card)]"
    >
      <div className="border-b border-[var(--border)] px-5 py-5 sm:px-7">
        <h2 id="profile-details-title" className="font-semibold">
          Personal details
        </h2>
        <p className="mt-1 text-sm text-[var(--muted-foreground)]">
          Keep your name and contact details up to date.
        </p>
      </div>
      <form
        onSubmit={handleSubmit(submit)}
        noValidate
        className="space-y-5 p-5 sm:p-7"
      >
        <fieldset disabled={isSubmitting} className="min-w-0 space-y-5">
          <legend className="sr-only">Edit personal details</legend>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="profile-first-name" className={labelClass}>
                First name <span className="text-[var(--error)]">*</span>
              </label>
              <input
                id="profile-first-name"
                autoComplete="given-name"
                maxLength={100}
                aria-required="true"
                aria-invalid={Boolean(errors.firstName)}
                aria-describedby={
                  errors.firstName ? "first-name-error" : undefined
                }
                className={inputClass}
                {...register("firstName")}
              />
              {errors.firstName ? (
                <FormError
                  id="first-name-error"
                  message={errors.firstName.message}
                />
              ) : null}
            </div>
            <div>
              <label htmlFor="profile-last-name" className={labelClass}>
                Last name <span className="text-[var(--error)]">*</span>
              </label>
              <input
                id="profile-last-name"
                autoComplete="family-name"
                maxLength={100}
                aria-required="true"
                aria-invalid={Boolean(errors.lastName)}
                aria-describedby={
                  errors.lastName ? "last-name-error" : undefined
                }
                className={inputClass}
                {...register("lastName")}
              />
              {errors.lastName ? (
                <FormError
                  id="last-name-error"
                  message={errors.lastName.message}
                />
              ) : null}
            </div>
          </div>
          <div>
            <label htmlFor="profile-email" className={labelClass}>
              Email{" "}
              <span className="font-normal text-[var(--muted-foreground)]">
                (optional)
              </span>
            </label>
            <input
              id="profile-email"
              type="email"
              autoComplete="email"
              maxLength={254}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? "email-error" : undefined}
              className={inputClass}
              {...register("email")}
            />
            {errors.email ? (
              <FormError id="email-error" message={errors.email.message} />
            ) : null}
          </div>
          <div>
            <label htmlFor="profile-address" className={labelClass}>
              Address{" "}
              <span className="font-normal text-[var(--muted-foreground)]">
                (optional)
              </span>
            </label>
            <textarea
              id="profile-address"
              autoComplete="street-address"
              maxLength={500}
              rows={2}
              aria-invalid={Boolean(errors.address)}
              aria-describedby={errors.address ? "address-error" : undefined}
              className={`${inputClass} resize-y`}
              {...register("address")}
            />
            {errors.address ? (
              <FormError id="address-error" message={errors.address.message} />
            ) : null}
          </div>
          <div>
            <label htmlFor="profile-city" className={labelClass}>
              City{" "}
              <span className="font-normal text-[var(--muted-foreground)]">
                (optional)
              </span>
            </label>
            <input
              id="profile-city"
              autoComplete="address-level2"
              maxLength={120}
              aria-invalid={Boolean(errors.city)}
              aria-describedby={errors.city ? "city-error" : undefined}
              className={inputClass}
              {...register("city")}
            />
            {errors.city ? (
              <FormError id="city-error" message={errors.city.message} />
            ) : null}
          </div>
        </fieldset>
        {message ? (
          <p
            role="alert"
            className="rounded-lg bg-[var(--error)]/10 p-3 text-sm text-[var(--error)]"
          >
            {message}
          </p>
        ) : null}
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[var(--border)] pt-5">
          <p
            role="status"
            className="inline-flex items-center gap-1.5 text-sm text-[var(--muted-foreground)]"
          >
            {isSubmitting ? (
              "Saving your changes…"
            ) : isDirty ? (
              "You have unsaved changes"
            ) : saved ? (
              <>
                <Check
                  className="h-4 w-4 text-[var(--primary)]"
                  aria-hidden="true"
                />
                Profile saved
              </>
            ) : (
              "Fields marked * are required"
            )}
          </p>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={!isDirty || isSubmitting}
              onClick={() => {
                reset(formValues(profile));
                setMessage(null);
                setSaved(false);
              }}
            >
              Discard changes
            </Button>
            <Button type="submit" size="sm" disabled={!isDirty || isSubmitting}>
              <Save className="mr-2 h-4 w-4" aria-hidden="true" />
              {isSubmitting ? "Saving…" : "Save changes"}
            </Button>
          </div>
        </div>
      </form>
    </section>
  );
}
