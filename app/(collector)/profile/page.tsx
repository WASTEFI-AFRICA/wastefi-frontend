import { Container } from "@/components/layout/Container";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/layout/Section";
import { Card, CardContent } from "@/components/ui";

export default function ProfilePage() {
  return (
    <Container size="md">
      <Section>
        <PageHeader title="Profile" description="Manage your account" />
      </Section>
      <Section spacing="sm">
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-[var(--muted-foreground)]">
              Profile page coming soon
            </p>
          </CardContent>
        </Card>
      </Section>
    </Container>
  );
}
