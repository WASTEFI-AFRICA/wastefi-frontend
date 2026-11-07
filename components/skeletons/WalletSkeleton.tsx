import { Container } from "@/components/layout/Container";
import { Skeleton } from "@/components/ui/Skeleton";

export function WalletSkeleton() {
  return (
    <Container>
      <div role="status" aria-label="Loading wallet" className="space-y-6 py-6">
        <span className="sr-only">Loading your balance and collection rewards.</span>
        <Skeleton className="h-9 w-32" />
        <Skeleton className="h-4 w-64 max-w-full" />
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
          <Skeleton className="h-80 rounded-2xl" />
          <Skeleton className="h-80 rounded-2xl" />
        </div>
        <Skeleton className="h-72 rounded-2xl" />
      </div>
    </Container>
  );
}
