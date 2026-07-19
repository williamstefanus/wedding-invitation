import { Card, Text, Flex, Heading } from "@radix-ui/themes";

export function MetricCard({ title, value, subtitle }: { title: string; value: string | number; subtitle?: string }) {
  return (
    <Card size="3" variant="surface">
      <Text as="div" size="2" weight="medium" color="gray" style={{ textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "8px" }}>
        {title}
      </Text>
      <Flex align="baseline" gap="2">
        <Heading size="8" weight="bold">{value}</Heading>
        {subtitle && <Text size="2" weight="medium" color="gray">{subtitle}</Text>}
      </Flex>
    </Card>
  );
}
