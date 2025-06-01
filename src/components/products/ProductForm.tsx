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
} from "@tremor/react";

interface ProductFormProps {
  initialData?: {
    id?: number;
    name: string;
    category: string;
    price: number;
    stock: number;
    unit: string;
  };
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const categories = [
  { value: 'Chemical', label: 'Chemical' },
  { value: 'Organic', label: 'Organic' },
  { value: 'Bio', label: 'Bio' },
];

const units = [
  { value: 'kg', label: 'Kilogram (kg)' },
  { value: 'g', label: 'Gram (g)' },
  { value: 'l', label: 'Liter (l)' },
  { value: 'ml', label: 'Milliliter (ml)' },
];

export function ProductForm({ initialData, onSubmit, onCancel }: ProductFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    category: initialData?.category || '',
    price: initialData?.price || 0,
    stock: initialData?.stock || 0,
    unit: initialData?.unit || 'kg',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    }
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }
    if (formData.price <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }
    if (formData.stock < 0) {
      newErrors.stock = 'Stock cannot be negative';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit({ ...formData, id: initialData?.id });
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Text>Product Name</Text>
          <TextInput
            placeholder="Enter product name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            error={!!errors.name}
            errorMessage={errors.name}
          />
        </div>

        <div>
          <Text>Category</Text>
          <Select
            value={formData.category}
            onValueChange={(value) => setFormData({ ...formData, category: value })}
            error={!!errors.category}
          >
            {categories.map((category) => (
              <SelectItem key={category.value} value={category.value}>
                {category.label}
              </SelectItem>
            ))}
          </Select>
          {errors.category && (
            <Text color="red" className="mt-1">{errors.category}</Text>
          )}
        </div>

        <div>
          <Text>Price (₹)</Text>
          <NumberInput
            placeholder="Enter price"
            value={formData.price}
            onValueChange={(value) => setFormData({ ...formData, price: value || 0 })}
            error={!!errors.price}
            min={0}
          />
          {errors.price && (
            <Text color="red" className="mt-1">{errors.price}</Text>
          )}
        </div>

        <div>
          <Text>Stock</Text>
          <NumberInput
            placeholder="Enter stock quantity"
            value={formData.stock}
            onValueChange={(value) => setFormData({ ...formData, stock: value || 0 })}
            error={!!errors.stock}
            min={0}
          />
          {errors.stock && (
            <Text color="red" className="mt-1">{errors.stock}</Text>
          )}
        </div>

        <div>
          <Text>Unit</Text>
          <Select
            value={formData.unit}
            onValueChange={(value) => setFormData({ ...formData, unit: value })}
          >
            {units.map((unit) => (
              <SelectItem key={unit.value} value={unit.value}>
                {unit.label}
              </SelectItem>
            ))}
          </Select>
        </div>

        <div className="flex justify-end space-x-3">
          <Button variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" color="blue">
            {initialData ? 'Update Product' : 'Add Product'}
          </Button>
        </div>
      </form>
    </Card>
  );
} 