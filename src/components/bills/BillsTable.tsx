'use client';

import {
  Table,
  TableHead,
  TableHeaderCell,
  TableBody,
  TableRow,
  TableCell,
  Badge,
  Button,
} from "@tremor/react";
import {
  PrinterIcon,
  DocumentDuplicateIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

// Temporary mock data
const bills = [
  {
    id: "BILL-001",
    date: "2024-06-01",
    customer: "John Doe",
    items: 3,
    total: 5600,
    paymentStatus: "Paid",
    paymentMode: "Cash",
  },
  {
    id: "BILL-002",
    date: "2024-06-01",
    customer: "Jane Smith",
    items: 2,
    total: 3200,
    paymentStatus: "Credit",
    paymentMode: "Credit",
  },
  {
    id: "BILL-003",
    date: "2024-06-01",
    customer: "Bob Wilson",
    items: 5,
    total: 8900,
    paymentStatus: "Partial",
    paymentMode: "Mixed",
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "Paid":
      return "green";
    case "Partial":
      return "yellow";
    case "Credit":
      return "red";
    default:
      return "gray";
  }
};

export function BillsTable() {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableHeaderCell>Bill ID</TableHeaderCell>
          <TableHeaderCell>Date</TableHeaderCell>
          <TableHeaderCell>Customer</TableHeaderCell>
          <TableHeaderCell>Items</TableHeaderCell>
          <TableHeaderCell>Total (₹)</TableHeaderCell>
          <TableHeaderCell>Payment Status</TableHeaderCell>
          <TableHeaderCell>Payment Mode</TableHeaderCell>
          <TableHeaderCell>Actions</TableHeaderCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {bills.map((bill) => (
          <TableRow key={bill.id}>
            <TableCell>{bill.id}</TableCell>
            <TableCell>{bill.date}</TableCell>
            <TableCell>{bill.customer}</TableCell>
            <TableCell>{bill.items}</TableCell>
            <TableCell>₹{bill.total}</TableCell>
            <TableCell>
              <Badge color={getStatusColor(bill.paymentStatus)} size="xs">
                {bill.paymentStatus}
              </Badge>
            </TableCell>
            <TableCell>{bill.paymentMode}</TableCell>
            <TableCell>
              <div className="flex space-x-2">
                <Button
                  size="xs"
                  variant="secondary"
                  icon={PrinterIcon}
                  className="p-2"
                  tooltip="Print Bill"
                />
                <Button
                  size="xs"
                  variant="secondary"
                  icon={DocumentDuplicateIcon}
                  className="p-2"
                  tooltip="Duplicate Bill"
                />
                <Button
                  size="xs"
                  variant="secondary"
                  icon={TrashIcon}
                  color="red"
                  className="p-2"
                  tooltip="Delete Bill"
                />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
} 