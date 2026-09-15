import { Container } from "@/components/layout/Container";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/layout/Section";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Badge,
  Button,
} from "@/components/ui";
import { Leaf, TrendingUp, Recycle, Plus } from "lucide-react";

/**
 * Collector Dashboard (Enhanced)
 * Main dashboard for waste collectors
 */

export default function CollectorDashboardPage() {
  return (
    <Container>
      <Section>
        <PageHeader
          title="Dashboard"
          description="Track your collections and earnings"
          actions={
            <Button size="lg" className="hidden sm:flex">
              <Plus className="w-5 h-5 mr-2" />
              New Submission
            </Button>
          }
        />
      </Section>

      <Section spacing="sm">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Earnings Card */}
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-[var(--muted-foreground)]">
                Total Earnings
              </CardTitle>
              <TrendingUp className="w-5 h-5 text-[var(--primary)]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[var(--primary)]">
                $125.50
              </div>
              <p className="text-xs text-[var(--muted-foreground)] mt-1">
                +12% from last month
              </p>
            </CardContent>
          </Card>

          {/* Collections Card */}
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-[var(--muted-foreground)]">
                This Month
              </CardTitle>
              <Recycle className="w-5 h-5 text-[var(--info)]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
              <p className="text-xs text-[var(--muted-foreground)] mt-1">
                Collections completed
              </p>
            </CardContent>
          </Card>

          {/* Impact Card */}
          <Card className="hover:shadow-md transition-shadow sm:col-span-2 lg:col-span-1">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-[var(--muted-foreground)]">
                Environmental Impact
              </CardTitle>
              <Leaf className="w-5 h-5 text-[var(--success)]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[var(--success)]">
                125 kg
              </div>
              <p className="text-xs text-[var(--muted-foreground)] mt-1">
                CO₂ emissions reduced
              </p>
            </CardContent>
          </Card>
        </div>
      </Section>

      <Section spacing="sm">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Collections</CardTitle>
            <CardDescription>Your latest waste submissions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 rounded-lg border border-[var(--border)] hover:bg-[var(--accent)] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[var(--primary)]/10 flex items-center justify-center">
                      <Recycle className="w-5 h-5 text-[var(--primary)]" />
                    </div>
                    <div>
                      <p className="font-medium">PET Plastic</p>
                      <p className="text-sm text-[var(--muted-foreground)]">
                        5.5 kg • Point {i}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-[var(--primary)]">
                      $5.50
                    </p>
                    <Badge variant="success" className="text-xs">
                      Approved
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
            
            <Button variant="outline" fullWidth className="mt-4">
              View All Collections
            </Button>
          </CardContent>
        </Card>
      </Section>

      {/* Quick Actions - Mobile FAB alternative */}
      <div className="fixed bottom-20 right-4 sm:hidden">
        <Button size="lg" className="rounded-full shadow-lg">
          <Plus className="w-6 h-6" />
        </Button>
      </div>
    </Container>
  );
}
