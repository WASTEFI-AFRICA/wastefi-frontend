import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Card, CardContent, Skeleton } from "@/components/ui";

/**
 * Collections Page Loading Skeleton
 * Matches the layout structure of the actual collections page
 */
export function CollectionsSkeleton() {
  return (
    <Container>
      <Section>
        {/* Page Header Skeleton */}
        <div className="space-y-2 mb-6">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
      </Section>

      <Section spacing="sm">
        {/* Stats Grid Skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardContent className="p-4 text-center">
                <Skeleton className="h-8 w-12 mx-auto mb-2" />
                <Skeleton className="h-4 w-16 mx-auto" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters Skeleton */}
        <div className="space-y-3">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-9 w-24 rounded-full flex-shrink-0" />
            ))}
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-9 w-20 rounded-full flex-shrink-0" />
            ))}
          </div>
        </div>

        {/* Sort and Count Skeleton */}
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-32" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-9 w-32 rounded-md" />
          </div>
        </div>

        {/* Collections List Skeleton */}
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    <Skeleton className="w-16 h-16 rounded-lg flex-shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-5 w-24" />
                        <Skeleton className="h-5 w-16 rounded-full" />
                      </div>
                      <Skeleton className="h-4 w-32" />
                      <div className="flex items-center gap-4">
                        <Skeleton className="h-3 w-20" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                    </div>
                  </div>
                  <div className="text-right space-y-2">
                    <Skeleton className="h-6 w-16 ml-auto" />
                    <Skeleton className="h-4 w-12 ml-auto" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>
    </Container>
  );
}
