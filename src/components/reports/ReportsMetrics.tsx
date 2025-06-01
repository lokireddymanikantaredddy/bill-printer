'use client';

import { Card, Grid, Text, Metric, Flex, ProgressBar } from "@tremor/react";

const metrics = [
  {
    title: "Total Sales",
    metric: "₹1,25,000",
    progress: 85,
    target: "₹1,50,000",
  },
  {
    title: "Products Sold",
    metric: "450",
    progress: 75,
    target: "600 units",
  },
  {
    title: "Active Customers",
    metric: "45",
    progress: 90,
    target: "50 customers",
  },
  {
    title: "Credit Due",
    metric: "₹35,000",
    progress: 65,
    target: "₹50,000",
  },
];

export function ReportsMetrics() {
  return (
    <Grid numItems={1} numItemsSm={2} numItemsLg={4} className="gap-6">
      {metrics.map((item) => (
        <Card key={item.title}>
          <Text className="text-gray-600">{item.title}</Text>
          <Flex
            justifyContent="start"
            alignItems="baseline"
            className="space-x-2 mt-2"
          >
            <Metric>{item.metric}</Metric>
            <Text className="text-gray-500">/ {item.target}</Text>
          </Flex>
          <Flex className="mt-4">
            <div className="w-full">
              <ProgressBar value={item.progress} className="mt-2" />
              <Text className="text-gray-500 text-sm mt-2">
                {item.progress}% of target
              </Text>
            </div>
          </Flex>
        </Card>
      ))}
    </Grid>
  );
} 