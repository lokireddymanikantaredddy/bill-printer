'use client';

import { Card, Title, AreaChart, BarChart, Grid } from "@tremor/react";

const salesData = [
  {
    date: "Jan",
    "Total Sales": 45000,
    "Credit Sales": 15000,
  },
  {
    date: "Feb",
    "Total Sales": 52000,
    "Credit Sales": 18000,
  },
  {
    date: "Mar",
    "Total Sales": 48000,
    "Credit Sales": 12000,
  },
  {
    date: "Apr",
    "Total Sales": 61000,
    "Credit Sales": 21000,
  },
  {
    date: "May",
    "Total Sales": 55000,
    "Credit Sales": 19000,
  },
  {
    date: "Jun",
    "Total Sales": 67000,
    "Credit Sales": 24000,
  },
];

const productData = [
  {
    name: "NPK Fertilizer",
    sales: 120,
  },
  {
    name: "Organic Compost",
    sales: 85,
  },
  {
    name: "Urea",
    sales: 95,
  },
  {
    name: "Potash",
    sales: 75,
  },
  {
    name: "Bio Fertilizer",
    sales: 45,
  },
];

export function ReportsCharts() {
  return (
    <Grid numItems={1} numItemsLg={2} className="gap-6">
      <Card>
        <Title>Sales Trend</Title>
        <AreaChart
          className="mt-4 h-72"
          data={salesData}
          index="date"
          categories={["Total Sales", "Credit Sales"]}
          colors={["blue", "red"]}
          valueFormatter={(value: number) => `₹${value.toLocaleString()}`}
        />
      </Card>
      <Card>
        <Title>Top Products by Sales</Title>
        <BarChart
          className="mt-4 h-72"
          data={productData}
          index="name"
          categories={["sales"]}
          colors={["blue"]}
          valueFormatter={(value: number) => value.toString()}
        />
      </Card>
    </Grid>
  );
} 