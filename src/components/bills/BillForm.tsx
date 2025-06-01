'use client';

import { useState } from 'react';
import {
  Card,
  TextInput,
  NumberInput,
  Select,
  SelectItem,
  Button,
  Text,
  Table,
  TableHead,
  TableHeaderCell,
  TableBody,
  TableRow,
  TableCell,
} from "@tremor/react";
import { TrashIcon } from "@heroicons/react/24/outline";

interface BillFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

// Mock data - replace with actual data from your backend
const products = [
  { id: 1, name: "NPK Fertilizer", price: 1200, stock: 50 },
  { id: 2, name: "Organic Compost", price: 800, stock: 100 },
  { id: 3, name: "Urea", price: 950, stock: 75 },
];

const customers = [
  { id: 1, name: "John Doe", phone: "9876543210" },
  { id: 2, name: "Jane Smith", phone: "9876543211" },
  { id: 3, name: "Bob Wilson", phone: "9876543212" },
];

interface BillItem {
  productId: number;
  quantity: number;
  price: number;
  total: number;
}

export function BillForm({ onSubmit, onCancel }: BillFormProps) {
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState<number>(1);
  const [items, setItems] = useState<BillItem[]>([]);
  const [paymentMode, setPaymentMode] = useState('cash');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleAddItem = () => {
    if (!selectedProduct || quantity <= 0) {
      setErrors({
        ...errors,
        items: 'Please select a product and enter valid quantity',
      });
      return;
    }

    const product = products.find((p) => p.id === Number(selectedProduct));
    if (!product) return;

    const newItem: BillItem = {
      productId: product.id,
      quantity,
      price: product.price,
      total: product.price * quantity,
    };

    setItems([...items, newItem]);
    setSelectedProduct('');
    setQuantity(1);
    setErrors({ ...errors, items: '' });
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + item.total, 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!selectedCustomer) {
      newErrors.customer = 'Please select a customer';
    }
    if (items.length === 0) {
      newErrors.items = 'Please add at least one item';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const billData = {
      customerId: selectedCustomer,
      items,
      total: calculateTotal(),
      paymentMode,
      date: new Date().toISOString(),
    };

    onSubmit(billData);
  };

  return (
    <Card>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Text>Customer</Text>
          <Select
            value={selectedCustomer}
            onValueChange={setSelectedCustomer}
            error={!!errors.customer}
            placeholder="Select customer"
          >
            {customers.map((customer) => (
              <SelectItem key={customer.id} value={customer.id.toString()}>
                {customer.name} ({customer.phone})
              </SelectItem>
            ))}
          </Select>
          {errors.customer && (
            <Text color="red" className="mt-1">{errors.customer}</Text>
          )}
        </div>

        <Card>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Text>Product</Text>
                <Select
                  value={selectedProduct}
                  onValueChange={setSelectedProduct}
                  placeholder="Select product"
                >
                  {products.map((product) => (
                    <SelectItem key={product.id} value={product.id.toString()}>
                      {product.name} (₹{product.price})
                    </SelectItem>
                  ))}
                </Select>
              </div>
              <div>
                <Text>Quantity</Text>
                <NumberInput
                  value={quantity}
                  onValueChange={setQuantity}
                  min={1}
                  placeholder="Enter quantity"
                />
              </div>
              <div className="flex items-end">
                <Button
                  type="button"
                  color="blue"
                  className="w-full"
                  onClick={handleAddItem}
                >
                  Add Item
                </Button>
              </div>
            </div>

            {errors.items && (
              <Text color="red">{errors.items}</Text>
            )}

            <Table>
              <TableHead>
                <TableRow>
                  <TableHeaderCell>Product</TableHeaderCell>
                  <TableHeaderCell>Quantity</TableHeaderCell>
                  <TableHeaderCell>Price</TableHeaderCell>
                  <TableHeaderCell>Total</TableHeaderCell>
                  <TableHeaderCell>Actions</TableHeaderCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.map((item, index) => {
                  const product = products.find(p => p.id === item.productId);
                  return (
                    <TableRow key={index}>
                      <TableCell>{product?.name}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>₹{item.price}</TableCell>
                      <TableCell>₹{item.total}</TableCell>
                      <TableCell>
                        <Button
                          size="xs"
                          variant="secondary"
                          color="red"
                          icon={TrashIcon}
                          onClick={() => handleRemoveItem(index)}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
                {items.length > 0 && (
                  <TableRow>
                    <TableCell colSpan={3} className="text-right font-medium">
                      Total:
                    </TableCell>
                    <TableCell className="font-bold">
                      ₹{calculateTotal()}
                    </TableCell>
                    <TableCell />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </Card>

        <div>
          <Text>Payment Mode</Text>
          <Select
            value={paymentMode}
            onValueChange={setPaymentMode}
          >
            <SelectItem value="cash">Cash</SelectItem>
            <SelectItem value="credit">Credit</SelectItem>
            <SelectItem value="upi">UPI</SelectItem>
            <SelectItem value="card">Card</SelectItem>
          </Select>
        </div>

        <div className="flex justify-end space-x-3">
          <Button variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" color="blue">
            Create Bill
          </Button>
        </div>
      </form>
    </Card>
  );
} 