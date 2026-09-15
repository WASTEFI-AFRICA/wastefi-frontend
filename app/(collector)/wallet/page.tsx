import { Container } from "@/components/layout/Container";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/layout/Section";
import { Card, CardContent } from "@/components/ui";

/**
 * Wallet Page (Placeholder)
 * Will be implemented in Phase 2: Collector Mobile App
 */

export default function WalletPage() {
  return (
    <Container>
      <Section>
        <PageHeader
          title="Wallet"
          description="Manage your earnings and transactions"
        />
      </Section>

      <Section spacing="sm">
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-[var(--muted-foreground)]">
              Wallet interface coming in Phase 2
            </p>
          </CardContent>
        </Card>
      </Section>
    </Container>
  );
}
