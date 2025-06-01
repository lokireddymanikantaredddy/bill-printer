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
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  unit: string;
  status: string;
}

interface ProductsTableProps {
  onEdit: (product: Product) => void;
  onDelete: (id: number) => void;
}

// Temporary mock data
const products = [
  {
    id: 1,
    name: "NPK Fertilizer",
    category: "Chemical",
    price: 1200,
    stock: 50,
    unit: "kg",
    status: "In Stock",
  },
  {
    id: 2,
    name: "Organic Compost",
    category: "Organic",
    price: 800,
    stock: 5,
    unit: "kg",
    status: "Low Stock",
  },
  {
    id: 3,
    name: "Urea",
    category: "Chemical",
    price: 950,
    stock: 0,
    unit: "kg",
    status: "Out of Stock",
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "In Stock":
      return "green";
    case "Low Stock":
      return "yellow";
    case "Out of Stock":
      return "red";
    default:
      return "gray";
  }
};

export function ProductsTable({ onEdit, onDelete }: ProductsTableProps) {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableHeaderCell>Name</TableHeaderCell>
          <TableHeaderCell>Category</TableHeaderCell>
          <TableHeaderCell>Price (₹)</TableHeaderCell>
          <TableHeaderCell>Stock</TableHeaderCell>
          <TableHeaderCell>Status</TableHeaderCell>
          <TableHeaderCell>Actions</TableHeaderCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {products.map((product) => (
          <TableRow key={product.id}>
            <TableCell>{product.name}</TableCell>
            <TableCell>{product.category}</TableCell>
            <TableCell>₹{product.price}</TableCell>
            <TableCell>
              {product.stock} {product.unit}
            </TableCell>
            <TableCell>
              <Badge color={getStatusColor(product.status)} size="xs">
                {product.status}
              </Badge>
            </TableCell>
            <TableCell>
              <div className="flex space-x-2">
                <Button
                  size="xs"
                  variant="secondary"
                  icon={PencilIcon}
                  className="p-2"
                  onClick={() => onEdit(product)}
                  tooltip="Edit Product"
                />
                <Button
                  size="xs"
                  variant="secondary"
                  icon={TrashIcon}
                  color="red"
                  className="p-2"
                  onClick={() => onDelete(product.id)}
                  tooltip="Delete Product"
                />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
} 