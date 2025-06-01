'use client';

import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { ReportsDateFilter } from "@/components/reports/ReportsDateFilter";
import { ReportsMetrics } from "@/components/reports/ReportsMetrics";
import { ReportsCharts } from "@/components/reports/ReportsCharts";
import { ReportsExport } from "@/components/reports/ReportsExport";

export default function ReportsPage() {
  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Reports</h1>
        </div>
        
        <div className="space-y-6">
          <ReportsDateFilter />
          <ReportsMetrics />
          <ReportsCharts />
          <ReportsExport />
        </div>
      </div>
    </DashboardLayout>
  );
} 