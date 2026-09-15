import { Container } from "@/components/layout/Container";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/layout/Section";
import { WasteSubmissionForm } from "@/components/submission/WasteSubmissionForm";

/**
 * Submit Waste Page
 * Submit waste collection with photos and details
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
        <WasteSubmissionForm />
      </Section>
    </Container>
  );
}
