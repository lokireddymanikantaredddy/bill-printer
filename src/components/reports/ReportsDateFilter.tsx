'use client';

import { Card, DateRangePicker, Button } from "@tremor/react";
import { FunnelIcon } from "@heroicons/react/24/outline";

export function ReportsDateFilter() {
  return (
    <Card>
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <DateRangePicker
          className="max-w-md"
          placeholder="Select date range"
          enableSelect={false}
        />
        <div className="flex gap-2">
          <Button size="sm" variant="secondary">
            Last 7 days
          </Button>
          <Button size="sm" variant="secondary">
            Last 30 days
          </Button>
          <Button size="sm" variant="secondary">
            This Month
          </Button>
        </div>
        <Button
          icon={FunnelIcon}
          className="ml-auto"
          variant="secondary"
        >
          Filter
        </Button>
      </div>
    </Card>
  );
} 