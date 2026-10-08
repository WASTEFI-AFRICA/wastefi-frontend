import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Card, CardContent, CardHeader, Skeleton } from "@/components/ui";

/**
 * Wallet Page Loading Skeleton
 * Matches the layout structure of the actual wallet page
 */
export function WalletSkeleton() {
  return (
    <Container>
      <Section>
        {/* Page Header Skeleton */}
        <div className="space-y-2 mb-6">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-4 w-64" />
        </div>
      </Section>

      <Section spacing="sm">
        {/* Wallet Balance Card Skeleton */}
        <Card className="bg-gradient-to-br from-[var(--primary)] to-[var(--primary)]/80">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-32 bg-white/30" />
                <Skeleton className="h-12 w-40 bg-white/30" />
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/20">
                <div className="space-y-2">
                  <Skeleton className="h-3 w-24 bg-white/30" />
                  <Skeleton className="h-6 w-20 bg-white/30" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-3 w-24 bg-white/30" />
                  <Skeleton className="h-6 w-20 bg-white/30" />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Skeleton className="h-10 flex-1 bg-white/30" />
                <Skeleton className="h-10 flex-1 bg-white/30" />
              </div>
            </div>
          </CardContent>
        </Card>
      </Section>

      <Section spacing="sm">
        {/* Transaction Filter Skeleton */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-9 w-24 rounded-full flex-shrink-0" />
          ))}
        </div>
      </Section>

      <Section spacing="sm">
        {/* Transaction List Skeleton */}
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-40 mb-2" />
            <Skeleton className="h-4 w-56" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 rounded-lg border border-[var(--border)]"
                >
                  <div className="flex items-center gap-3">
                    <Skeleton className="w-10 h-10 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-40" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                  <div className="text-right space-y-2">
                    <Skeleton className="h-5 w-16 ml-auto" />
                    <Skeleton className="h-4 w-20 ml-auto" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </Section>
    </Container>
  );
}
