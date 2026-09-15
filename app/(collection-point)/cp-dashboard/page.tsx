"use client";

import { Container } from "@/components/layout/Container";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/layout/Section";
import {
  MetricCard,
  ActivityFeed,
  QuickActions,
  CollectionChart,
  TopCollectors,
} from "@/components/collection-point";
import { Package, Users, Scale, Clock, DollarSign, TrendingUp } from "lucide-react";

/**
 * Collection Point Dashboard
 * Overview and analytics for collection point operators
 */

export default function CollectionPointDashboard() {
  // Mock metrics
  const metrics = [
    {
      title: "Total Collections",
      value: 324,
      subtitle: "This month",
      icon: Package,
      trend: { value: 12, label: "vs last month" },
      color: "var(--primary)",
    },
    {
      title: "Active Collectors",
      value: 47,
      subtitle: "Registered users",
      icon: Users,
      trend: { value: 8, label: "vs last month" },
      color: "var(--info)",
    },
    {
      title: "Total Weight",
      value: "1,234 kg",
      subtitle: "This month",
      icon: Scale,
      trend: { value: 15, label: "vs last month" },
      color: "var(--success)",
    },
    {
      title: "Pending Reviews",
      value: 12,
      subtitle: "Awaiting verification",
      icon: Clock,
      trend: { value: -5, label: "vs yesterday" },
      color: "var(--warning)",
    },
  ];

  // Mock activities
  const activities = [
    {
      id: "act-1",
      type: "submission" as const,
      collectorName: "John Doe",
      materialType: "plastic",
      weight: 5.5,
      timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
      status: "pending" as const,
    },
    {
      id: "act-2",
      type: "verification" as const,
      collectorName: "Jane Smith",
      materialType: "cardboard",
      weight: 12.3,
      timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      status: "verified" as const,
    },
    {
      id: "act-3",
      type: "submission" as const,
      collectorName: "Mike Johnson",
      materialType: "metal",
      weight: 8.7,
      timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
      status: "pending" as const,
    },
    {
      id: "act-4",
      type: "verification" as const,
      collectorName: "Sarah Williams",
      materialType: "glass",
      weight: 15.2,
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      status: "verified" as const,
    },
    {
      id: "act-5",
      type: "rejection" as const,
      collectorName: "Tom Brown",
      materialType: "mixed",
      weight: 3.4,
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
      status: "rejected" as const,
    },
  ];

  // Mock chart data - Collections by day
  const dailyCollections = [
    { label: "Monday", value: 45 },
    { label: "Tuesday", value: 52 },
    { label: "Wednesday", value: 48 },
    { label: "Thursday", value: 61 },
    { label: "Friday", value: 55 },
    { label: "Saturday", value: 38 },
    { label: "Sunday", value: 25 },
  ];

  // Mock chart data - Material types
  const materialBreakdown = [
    { label: "Plastic", value: 125 },
    { label: "Paper", value: 98 },
    { label: "Metal", value: 67 },
    { label: "Glass", value: 45 },
    { label: "E-waste", value: 34 },
  ];

  // Mock top collectors
  const topCollectors = [
    {
      id: "col-1",
      name: "Emma Johnson",
      collections: 42,
      weight: 156.8,
    },
    {
      id: "col-2",
      name: "Michael Chen",
      collections: 38,
      weight: 142.3,
    },
    {
      id: "col-3",
      name: "Sarah Williams",
      collections: 35,
      weight: 128.9,
    },
    {
      id: "col-4",
      name: "David Martinez",
      collections: 31,
      weight: 115.2,
    },
    {
      id: "col-5",
      name: "Lisa Anderson",
      collections: 28,
      weight: 98.5,
    },
  ];

  return (
    <Container>
      <Section>
        <PageHeader
          title="Dashboard"
          description="Collection point overview and analytics"
        />
      </Section>

      <Section spacing="sm">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((metric, index) => (
            <MetricCard
              key={index}
              title={metric.title}
              value={metric.value}
              subtitle={metric.subtitle}
              icon={metric.icon}
              trend={metric.trend}
              color={metric.color}
            />
          ))}
        </div>

        {/* Quick Actions */}
        <QuickActions />

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CollectionChart
            title="Collections This Week"
            data={dailyCollections}
            color="var(--primary)"
          />
          <CollectionChart
            title="Material Breakdown"
            data={materialBreakdown}
            color="var(--success)"
          />
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ActivityFeed activities={activities} />
          <TopCollectors collectors={topCollectors} />
        </div>
      </Section>
    </Container>
  );
}
