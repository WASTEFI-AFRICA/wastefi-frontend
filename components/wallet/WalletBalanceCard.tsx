"use client";

import { Card, CardContent, Button, Badge } from "@/components/ui";
import { ArrowUpRight, ArrowDownLeft, Eye, EyeOff, TrendingUp } from "lucide-react";
import { useState } from "react";
import { formatCurrency } from "@/lib/utils";

/**
 * Wallet Balance Card
 * Displays wallet balance with show/hide and quick actions
 */

interface WalletBalanceCardProps {
  balance: number;
  pendingBalance: number;
  totalEarned: number;
  onCashout?: () => void;
  onAddFunds?: () => void;
}

export function WalletBalanceCard({
  balance,
  pendingBalance,
  totalEarned,
  onCashout,
  onAddFunds,
}: WalletBalanceCardProps) {
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);

  return (
    <Card className="bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] text-white border-0">
      <CardContent className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/80 text-sm">Available Balance</p>
            <div className="flex items-center gap-3 mt-1">
              <h2 className="text-3xl font-bold">
                {isBalanceVisible ? formatCurrency(balance) : "••••••"}
              </h2>
              <button
                onClick={() => setIsBalanceVisible(!isBalanceVisible)}
                className="text-white/80 hover:text-white transition-colors"
              >
                {isBalanceVisible ? (
                  <Eye className="w-5 h-5" />
                ) : (
                  <EyeOff className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
          <TrendingUp className="w-8 h-8 text-white/60" />
        </div>

        {/* Stats */}
        <div className="flex items-center gap-6 pt-4 border-t border-white/20">
          <div>
            <p className="text-white/70 text-xs">Pending</p>
            <p className="text-lg font-semibold mt-0.5">
              {formatCurrency(pendingBalance)}
            </p>
          </div>
          <div className="w-px h-8 bg-white/20" />
          <div>
            <p className="text-white/70 text-xs">Total Earned</p>
            <p className="text-lg font-semibold mt-0.5">
              {formatCurrency(totalEarned)}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <Button
            variant="secondary"
            size="lg"
            className="flex-1 bg-white text-[var(--primary)] hover:bg-white/90"
            onClick={onCashout}
          >
            <ArrowUpRight className="w-5 h-5 mr-2" />
            Cash Out
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="flex-1 border-white/30 text-white hover:bg-white/10"
            onClick={onAddFunds}
          >
            <ArrowDownLeft className="w-5 h-5 mr-2" />
            Add Funds
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
