"use client";

import { Card, CardContent, CardHeader, CardTitle, Badge } from "@/components/ui";
import { ArrowUpRight, ArrowDownLeft, Clock } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { format } from "date-fns";
import type { Transaction } from "@/types/api";

/**
 * Transaction List Component
 * Displays transaction history with filters
 */

interface TransactionListProps {
  transactions: Transaction[];
  isLoading?: boolean;
}

export function TransactionList({ transactions, isLoading }: TransactionListProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-16 bg-[var(--muted)] rounded-lg" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (transactions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-[var(--muted)] mx-auto mb-4 flex items-center justify-center">
              <Clock className="w-8 h-8 text-[var(--muted-foreground)]" />
            </div>
            <p className="text-[var(--muted-foreground)]">No transactions yet</p>
            <p className="text-sm text-[var(--muted-foreground)] mt-1">
              Your transaction history will appear here
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          {transactions.map((transaction) => (
            <TransactionItem key={transaction.id} transaction={transaction} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function TransactionItem({ transaction }: { transaction: Transaction }) {
  const isCredit = transaction.type === "credit";
  const isPending = transaction.status === "pending";
  const isFailed = transaction.status === "failed";

  return (
    <div className="flex items-center gap-4 p-4 rounded-lg hover:bg-[var(--accent)] transition-colors">
      {/* Icon */}
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center ${
          isCredit
            ? "bg-[var(--success)]/10"
            : "bg-[var(--error)]/10"
        }`}
      >
        {isCredit ? (
          <ArrowDownLeft className={`w-5 h-5 text-[var(--success)]`} />
        ) : (
          <ArrowUpRight className={`w-5 h-5 text-[var(--error)]`} />
        )}
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <p className="font-medium truncate">{transaction.description}</p>
        <div className="flex items-center gap-2 mt-0.5">
          <p className="text-sm text-[var(--muted-foreground)]">
            {format(new Date(transaction.createdAt), "MMM dd, yyyy • HH:mm")}
          </p>
          {transaction.reference && (
            <>
              <span className="text-[var(--muted-foreground)]">•</span>
              <p className="text-xs text-[var(--muted-foreground)] truncate">
                {transaction.reference}
              </p>
            </>
          )}
        </div>
      </div>

      {/* Amount & Status */}
      <div className="flex flex-col items-end gap-1">
        <p
          className={`font-semibold ${
            isCredit ? "text-[var(--success)]" : "text-[var(--foreground)]"
          }`}
        >
          {isCredit ? "+" : "-"}
          {formatCurrency(transaction.amount)}
        </p>
        {isPending && (
          <Badge variant="warning" className="text-xs">
            Pending
          </Badge>
        )}
        {isFailed && (
          <Badge variant="error" className="text-xs">
            Failed
          </Badge>
        )}
        {transaction.status === "completed" && (
          <Badge variant="success" className="text-xs">
            Completed
          </Badge>
        )}
      </div>
    </div>
  );
}
