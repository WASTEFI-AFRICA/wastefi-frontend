"use client";

import { useState } from "react";
import { Container } from "@/components/layout/Container";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/layout/Section";
import { WalletBalanceCard } from "@/components/wallet/WalletBalanceCard";
import { TransactionList } from "@/components/wallet/TransactionList";
import { TransactionFilter, TransactionFilterType } from "@/components/wallet/TransactionFilter";
import { CashoutModal } from "@/components/wallet/CashoutModal";
import type { Transaction } from "@/types/api";

/**
 * Wallet Page
 * Manage earnings and transactions
 */

// Mock data
const mockTransactions: Transaction[] = [
  {
    id: "txn-1",
    userId: "user-123",
    type: "collection",
    amount: 25.50,
    currency: "usd",
    status: "completed",
    description: "Waste Collection - PET Plastic",
    metadata: { submissionId: "sub-001" },
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "txn-2",
    userId: "user-123",
    type: "cashout",
    amount: 50.00,
    currency: "usd",
    status: "completed",
    description: "Cash Out - Mobile Money",
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "txn-3",
    userId: "user-123",
    type: "collection",
    amount: 15.75,
    currency: "usd",
    status: "completed",
    description: "Waste Collection - Cardboard",
    metadata: { submissionId: "sub-002" },
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "txn-4",
    userId: "user-123",
    type: "collection",
    amount: 32.25,
    currency: "usd",
    status: "pending",
    description: "Waste Collection - Mixed Plastic",
    metadata: { submissionId: "sub-003" },
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
  },
  {
    id: "txn-5",
    userId: "user-123",
    type: "bonus",
    amount: 18.00,
    currency: "usd",
    status: "completed",
    description: "Bonus - Aluminum Collection",
    metadata: { submissionId: "sub-004" },
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export default function WalletPage() {
  const [activeFilter, setActiveFilter] = useState<TransactionFilterType>("all");
  const [isCashoutModalOpen, setIsCashoutModalOpen] = useState(false);

  // Mock wallet data
  const walletData = {
    balance: 125.50,
    pendingBalance: 32.25,
    totalEarned: 207.75,
  };

  // Filter transactions
  const filteredTransactions = mockTransactions.filter((txn) => {
    if (activeFilter === "all") return true;
    return txn.type === activeFilter;
  });

  return (
    <>
      <Container>
        <Section>
          <PageHeader
            title="Wallet"
            description="Manage your earnings and transactions"
          />
        </Section>

        <Section spacing="sm">
          <WalletBalanceCard
            balance={walletData.balance}
            pendingBalance={walletData.pendingBalance}
            totalEarned={walletData.totalEarned}
            onCashout={() => setIsCashoutModalOpen(true)}
            onAddFunds={() => {
              // Will be implemented later
              console.log("Add funds clicked");
            }}
          />
        </Section>

        <Section spacing="sm">
          <TransactionFilter
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
          />
        </Section>

        <Section spacing="sm">
          <TransactionList transactions={filteredTransactions} />
        </Section>
      </Container>

      {/* Cashout Modal */}
      <CashoutModal
        isOpen={isCashoutModalOpen}
        onClose={() => setIsCashoutModalOpen(false)}
        availableBalance={walletData.balance}
      />
    </>
  );
}
