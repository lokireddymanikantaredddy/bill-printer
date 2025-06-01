'use client';

import {
  CurrencyRupeeIcon,
  ShoppingCartIcon,
  UsersIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { Card, Text, Metric, Flex, Icon } from "@tremor/react";

const metrics = [
  {
    name: "Total Sales",
    value: "₹45,231",
    description: "32% vs last month",
    icon: CurrencyRupeeIcon,
    color: "blue",
  },
  {
    name: "Products Sold",
    value: "123",
    description: "12% vs last month",
    icon: ShoppingCartIcon,
    color: "emerald",
  },
  {
    name: "Active Customers",
    value: "45",
    description: "8% vs last month",
    icon: UsersIcon,
    color: "violet",
  },
  {
    name: "Low Stock Items",
    value: "5",
    description: "Needs attention",
    icon: ExclamationTriangleIcon,
    color: "rose",
  },
];

export function DashboardMetrics() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric) => (
        <Card 
          key={metric.name} 
          className="space-y-3 p-4 hover:shadow-lg transition-shadow duration-200"
          decoration="top"
          decorationColor={metric.color}
        >
          <Flex>
            <div className={`w-14 h-14 bg-${metric.color}-50 rounded-full flex items-center justify-center`}>
              <Icon
                icon={metric.icon}
                variant="solid"
                size="xl"
                color={metric.color}
              />
            </div>
          </Flex>
          <Text className="text-sm font-medium text-gray-600">{metric.name}</Text>
          <Metric className="text-2xl font-semibold">{metric.value}</Metric>
          <Text className="text-sm font-medium text-gray-500">{metric.description}</Text>
        </Card>
      ))}
    </div>
  );
} 