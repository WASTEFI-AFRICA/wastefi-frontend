"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button, Card, Badge, FormError } from "@/components/ui";
import { useToast } from "@/lib/hooks/useToast";
import { X, Smartphone, Wallet, Building2 } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

/**
 * Cashout Modal
 * Handle withdrawal requests
 */

const cashoutSchema = z.object({
  amount: z.number({
    error: (issue) => (issue.input === undefined ? "Amount is required" : "Please enter a valid amount"),
  })
    .min(1, "Amount must be greater than $0")
    .max(10000, "Amount cannot exceed $10,000 per transaction"),
  method: z.enum(["mobile_money", "stellar", "bank"], {
    error: "Please select a payment method",
  }),
  destination: z.string()
    .min(1, "Destination is required")
    .min(5, "Please enter a valid destination address"),
});

type CashoutFormData = z.infer<typeof cashoutSchema>;

interface CashoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableBalance: number;
}

export function CashoutModal({
  isOpen,
  onClose,
  availableBalance,
}: CashoutModalProps) {
  const [selectedMethod, setSelectedMethod] = useState<"mobile_money" | "stellar" | "bank">("mobile_money");
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<CashoutFormData>({
    resolver: zodResolver(cashoutSchema),
    defaultValues: {
      method: "mobile_money",
    },
  });

  const amount = watch("amount");

  const onSubmit = async (data: CashoutFormData) => {
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      console.log("Cashout request:", data);
      
      toast.success(
        `${formatCurrency(data.amount)} has been sent to your ${data.method === "mobile_money" ? "mobile money" : data.method === "stellar" ? "Stellar wallet" : "bank account"}.`,
        { title: "Cash Out Successful" }
      );
      
      onClose();
    } catch (error) {
      toast.error("Unable to process your cash out request. Please try again.", {
        title: "Cash Out Failed"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  const methods = [
    {
      id: "mobile_money" as const,
      name: "Mobile Money",
      icon: Smartphone,
      placeholder: "Phone Number (+1234567890)",
    },
    {
      id: "stellar" as const,
      name: "Stellar",
      icon: Wallet,
      placeholder: "Stellar Address (G...)",
    },
    {
      id: "bank" as const,
      name: "Bank Transfer",
      icon: Building2,
      placeholder: "Account Number",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-fade-in">
      <Card className="w-full max-w-md animate-slide-up">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="heading-3">Cash Out</h2>
              <p className="text-sm text-[var(--muted-foreground)] mt-1">
                Available: {formatCurrency(availableBalance)}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Amount Input */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Amount
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-semibold text-[var(--muted-foreground)]">
                  $
                </span>
                <input
                  {...register("amount", { valueAsNumber: true })}
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  className={`w-full h-14 pl-8 pr-4 text-lg font-semibold rounded-md border ${
                    errors.amount 
                      ? "border-[var(--error)] focus:ring-[var(--error)]" 
                      : "border-[var(--border)] focus:ring-[var(--primary)]"
                  } bg-[var(--background)] focus:ring-2 focus:border-transparent outline-none`}
                  aria-invalid={errors.amount ? "true" : "false"}
                  aria-describedby={errors.amount ? "amount-error" : undefined}
                />
              </div>
              {errors.amount && (
                <FormError message={errors.amount.message} id="amount-error" />
              )}
              <div className="flex gap-2 mt-2">
                {[25, 50, 100].map((preset) => (
                  <Button
                    key={preset}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setValue("amount", preset)}
                  >
                    ${preset}
                  </Button>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setValue("amount", availableBalance)}
                >
                  All
                </Button>
              </div>
            </div>

            {/* Payment Method */}
            <div>
              <label className="block text-sm font-medium mb-3">
                Payment Method
              </label>
              <div className="grid grid-cols-3 gap-2">
                {methods.map((method) => {
                  const Icon = method.icon;
                  return (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => {
                        setSelectedMethod(method.id);
                        setValue("method", method.id);
                      }}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        selectedMethod === method.id
                          ? "border-[var(--primary)] bg-[var(--primary)]/5"
                          : "border-[var(--border)] hover:border-[var(--primary)]/50"
                      }`}
                    >
                      <Icon className="w-6 h-6 mx-auto mb-2" />
                      <p className="text-xs font-medium text-center">
                        {method.name}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Destination */}
            <div>
              <label className="block text-sm font-medium mb-2">
                {selectedMethod === "mobile_money"
                  ? "Phone Number"
                  : selectedMethod === "stellar"
                  ? "Stellar Address"
                  : "Account Number"}
              </label>
              <input
                {...register("destination")}
                type="text"
                placeholder={
                  methods.find((m) => m.id === selectedMethod)?.placeholder
                }
                className={`w-full h-12 px-4 rounded-md border ${
                  errors.destination 
                    ? "border-[var(--error)] focus:ring-[var(--error)]" 
                    : "border-[var(--border)] focus:ring-[var(--primary)]"
                } bg-[var(--background)] focus:ring-2 focus:border-transparent outline-none`}
                aria-invalid={errors.destination ? "true" : "false"}
                aria-describedby={errors.destination ? "destination-error" : undefined}
              />
              {errors.destination && (
                <FormError message={errors.destination.message} id="destination-error" />
              )}
            </div>

            {/* Summary */}
            {amount > 0 && (
              <div className="p-4 rounded-lg bg-[var(--muted)]">
                <div className="flex justify-between mb-2">
                  <span className="text-sm">Amount</span>
                  <span className="font-semibold">{formatCurrency(amount)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm">Fee</span>
                  <span className="font-semibold">$0.00</span>
                </div>
                <div className="pt-2 border-t border-[var(--border)] flex justify-between">
                  <span className="font-semibold">You&apos;ll receive</span>
                  <span className="font-semibold text-[var(--primary)]">
                    {formatCurrency(amount)}
                  </span>
                </div>
              </div>
            )}

            {/* Submit */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={isLoading}
              disabled={!amount || amount > availableBalance}
            >
              Confirm Cash Out
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
}
