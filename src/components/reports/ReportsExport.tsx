'use client';

import { Card, Title, Button, Grid } from "@tremor/react";
import {
  DocumentArrowDownIcon,
  TableCellsIcon,
} from "@heroicons/react/24/outline";

const exportOptions = [
  {
    title: "Sales Report",
    description: "Export detailed sales data with customer information",
    formats: ["PDF", "Excel"],
  },
  {
    title: "Inventory Report",
    description: "Export current stock levels and product details",
    formats: ["PDF", "Excel"],
  },
  {
    title: "Customer Credit Report",
    description: "Export customer credit and payment history",
    formats: ["PDF", "Excel"],
  },
  {
    title: "Product Performance",
    description: "Export product-wise sales and revenue data",
    formats: ["PDF", "Excel"],
  },
];

export function ReportsExport() {
  return (
    <Card>
      <Title>Export Reports</Title>
      <Grid numItems={1} numItemsSm={2} className="gap-6 mt-4">
        {exportOptions.map((option) => (
          <Card key={option.title} className="bg-gray-50">
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-900">{option.title}</h3>
                <p className="text-sm text-gray-500 mt-1">{option.description}</p>
              </div>
              <div className="flex gap-2">
                <Button
                  size="xs"
                  variant="secondary"
                  icon={DocumentArrowDownIcon}
                  className="flex-1"
                >
                  Export PDF
                </Button>
                <Button
                  size="xs"
                  variant="secondary"
                  icon={TableCellsIcon}
                  className="flex-1"
                >
                  Export Excel
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </Grid>
    </Card>
  );
} 