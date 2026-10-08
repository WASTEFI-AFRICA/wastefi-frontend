import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Card, CardContent, CardHeader, Skeleton } from "@/components/ui";

/**
 * Dashboard Page Loading Skeleton
 * Matches the layout structure of the actual dashboard
 */
export function DashboardSkeleton() {
  return (
    <Container>
      <Section>
        {/* Page Header Skeleton */}
        <div className="flex items-center justify-between mb-6">
          <div className="space-y-2">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-10 w-40 hidden sm:block" />
        </div>
      </Section>

      <Section spacing="sm">
        {/* Stats Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-5 w-5 rounded" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-24 mb-2" />
                <Skeleton className="h-3 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      <Section spacing="sm">
        {/* Recent Activity Skeleton */}
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-40 mb-2" />
            <Skeleton className="h-4 w-48" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 rounded-lg border border-[var(--border)]"
                >
                  <div className="flex items-center gap-3">
                    <Skeleton className="w-10 h-10 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                  </div>
                  <div className="space-y-2 text-right">
                    <Skeleton className="h-4 w-16 ml-auto" />
                    <Skeleton className="h-5 w-20 ml-auto" />
                  </div>
                </div>
              ))}
            </div>
            <Skeleton className="h-10 w-full mt-4" />
          </CardContent>
        </Card>
      </Section>

      {/* Mobile FAB Skeleton */}
      <div className="fixed bottom-20 right-4 sm:hidden">
        <Skeleton className="h-14 w-14 rounded-full" />
      </div>
    </Container>
  );
}
