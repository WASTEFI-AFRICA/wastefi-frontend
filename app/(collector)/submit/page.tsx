import { Container } from "@/components/layout/Container";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/layout/Section";
import { Card, CardContent } from "@/components/ui";

/**
 * Submit Waste Page (Placeholder)
 * Will be implemented in Phase 2: Collector Mobile App
 */

export default function SubmitWastePage() {
  return (
    <Container>
      <Section>
        <PageHeader
          title="Submit Waste"
          description="Record your waste collection"
        />
      </Section>

      <Section spacing="sm">
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-[var(--muted-foreground)]">
              Waste submission form coming in Phase 2
            </p>
          </CardContent>
        </Card>
      </Section>
    </Container>
  );
}
