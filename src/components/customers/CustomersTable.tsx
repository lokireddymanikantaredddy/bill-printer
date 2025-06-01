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
import { PencilIcon, TrashIcon, BanknotesIcon } from "@heroicons/react/24/outline";

// Temporary mock data
const customers = [
  {
    id: 1,
    name: "John Doe",
    phone: "9876543210",
    address: "123 Farm Road, Village",
    totalCredit: 15000,
    dueAmount: 5000,
    status: "Good Standing",
  },
  {
    id: 2,
    name: "Jane Smith",
    phone: "9876543211",
    address: "456 Field Street, Town",
    totalCredit: 25000,
    dueAmount: 20000,
    status: "Due Soon",
  },
  {
    id: 3,
    name: "Bob Wilson",
    phone: "9876543212",
    address: "789 Agriculture Ave, City",
    totalCredit: 10000,
    dueAmount: 10000,
    status: "Overdue",
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "Good Standing":
      return "green";
    case "Due Soon":
      return "yellow";
    case "Overdue":
      return "red";
    default:
      return "gray";
  }
};

export function CustomersTable() {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableHeaderCell>Name</TableHeaderCell>
          <TableHeaderCell>Phone</TableHeaderCell>
          <TableHeaderCell>Address</TableHeaderCell>
          <TableHeaderCell>Total Credit</TableHeaderCell>
          <TableHeaderCell>Due Amount</TableHeaderCell>
          <TableHeaderCell>Status</TableHeaderCell>
          <TableHeaderCell>Actions</TableHeaderCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {customers.map((customer) => (
          <TableRow key={customer.id}>
            <TableCell>{customer.name}</TableCell>
            <TableCell>{customer.phone}</TableCell>
            <TableCell>{customer.address}</TableCell>
            <TableCell>₹{customer.totalCredit}</TableCell>
            <TableCell>₹{customer.dueAmount}</TableCell>
            <TableCell>
              <Badge color={getStatusColor(customer.status)} size="xs">
                {customer.status}
              </Badge>
            </TableCell>
            <TableCell>
              <div className="flex space-x-2">
                <Button
                  size="xs"
                  variant="secondary"
                  icon={BanknotesIcon}
                  className="p-2"
                  tooltip="Record Payment"
                />
                <Button
                  size="xs"
                  variant="secondary"
                  icon={PencilIcon}
                  className="p-2"
                  tooltip="Edit Customer"
                />
                <Button
                  size="xs"
                  variant="secondary"
                  icon={TrashIcon}
                  color="red"
                  className="p-2"
                  tooltip="Delete Customer"
                />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
} 