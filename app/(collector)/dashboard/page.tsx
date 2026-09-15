import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui";

/**
 * Collector Dashboard (Placeholder)
 * Will be implemented in Phase 2: Collector Mobile App
 */

export default function CollectorDashboardPage() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="heading-1">Collector Dashboard</h1>
      <Card>
        <CardHeader>
          <CardTitle>Welcome</CardTitle>
          <CardDescription>Your waste collection dashboard</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-[var(--muted-foreground)]">
            Dashboard implementation coming in Phase 2
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
