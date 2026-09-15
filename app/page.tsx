import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Badge,
} from "@/components/ui";
import { Recycle, Leaf, TrendingUp } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen p-8 bg-[var(--background)]">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Hero Section */}
        <section className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 text-[var(--primary)] mb-4">
            <Recycle className="w-8 h-8" />
            <h1 className="heading-1">WasteFi</h1>
          </div>
          <p className="body-large text-[var(--muted-foreground)] max-w-2xl mx-auto">
            Financial Inclusion Through Waste Collection - Powered by Open Material Standards
          </p>
        </section>

        {/* Design System Showcase */}
        <section className="space-y-8">
          <div>
            <h2 className="heading-2 mb-6">Design System Components</h2>
            
            {/* Buttons */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Buttons</CardTitle>
                <CardDescription>Various button styles and sizes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-3">
                  <Button variant="primary">Primary</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="success">Success</Button>
                  <Button variant="destructive">Destructive</Button>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Button size="sm">Small</Button>
                  <Button size="md">Medium</Button>
                  <Button size="lg">Large</Button>
                  <Button size="xl">Extra Large</Button>
                </div>
                <div>
                  <Button loading>Loading State</Button>
                </div>
              </CardContent>
            </Card>

            {/* Badges */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Badges</CardTitle>
                <CardDescription>Status indicators and labels</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  <Badge variant="default">Default</Badge>
                  <Badge variant="secondary">Secondary</Badge>
                  <Badge variant="success">Success</Badge>
                  <Badge variant="warning">Warning</Badge>
                  <Badge variant="error">Error</Badge>
                  <Badge variant="outline">Outline</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Leaf className="w-5 h-5 text-[var(--success)]" />
                    <Badge variant="success">Active</Badge>
                  </div>
                  <CardTitle className="text-xl">Environmental Impact</CardTitle>
                  <CardDescription>Track your contribution</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="body-small text-[var(--muted-foreground)]">
                        CO2 Reduced
                      </span>
                      <span className="font-semibold">125 kg</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="body-small text-[var(--muted-foreground)]">
                        Plastic Collected
                      </span>
                      <span className="font-semibold">45 kg</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-[var(--primary)]" />
                    <Badge variant="default">Verified</Badge>
                  </div>
                  <CardTitle className="text-xl">Earnings</CardTitle>
                  <CardDescription>Your wallet balance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="heading-2 text-[var(--primary)]">$125.50</p>
                    <p className="caption">Available for withdrawal</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Recycle className="w-5 h-5 text-[var(--info)]" />
                    <Badge variant="outline">Collection</Badge>
                  </div>
                  <CardTitle className="text-xl">Collections</CardTitle>
                  <CardDescription>This month</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="heading-2">24</p>
                    <p className="caption">+12% from last month</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Typography Showcase */}
        <section>
          <Card>
            <CardHeader>
              <CardTitle>Typography Scale</CardTitle>
              <CardDescription>Consistent text hierarchy</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="caption mb-1">Heading 1</p>
                <h1 className="heading-1">The quick brown fox</h1>
              </div>
              <div>
                <p className="caption mb-1">Heading 2</p>
                <h2 className="heading-2">The quick brown fox</h2>
              </div>
              <div>
                <p className="caption mb-1">Heading 3</p>
                <h3 className="heading-3">The quick brown fox</h3>
              </div>
              <div>
                <p className="caption mb-1">Body Large</p>
                <p className="body-large">The quick brown fox jumps over the lazy dog</p>
              </div>
              <div>
                <p className="caption mb-1">Body Regular</p>
                <p className="body-regular">The quick brown fox jumps over the lazy dog</p>
              </div>
              <div>
                <p className="caption mb-1">Body Small</p>
                <p className="body-small">The quick brown fox jumps over the lazy dog</p>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}
