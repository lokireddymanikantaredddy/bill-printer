'use client';

import { motion } from 'framer-motion';
import { useStore } from '@/store/store';
import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface DashboardMetrics {
  totalSales: number;
  productsSold: number;
  activeCustomers: number;
  lowStockItems: number;
  topProducts: Array<{
    name: string;
    quantity: number;
    revenue: number;
  }>;
  lowStockList: Array<{
    name: string;
    stock: number;
    minQuantity: number;
    unit: string;
  }>;
  customerActivity: Array<{
    name: string;
    purchases: number;
    total: number;
  }>;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export default function Dashboard() {
  const { bills, inventory } = useStore();
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalSales: 0,
    productsSold: 0,
    activeCustomers: 0,
    lowStockItems: 0,
    topProducts: [],
    lowStockList: [],
    customerActivity: []
  });

  useEffect(() => {
    const calculateMetrics = () => {
      // Basic metrics
      const totalSales = bills.reduce((sum, bill) => sum + bill.total, 0);
      const productsSold = bills.reduce((sum, bill) => 
        sum + bill.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0
      );
      const activeCustomers = new Set(bills.map(bill => bill.customerPhone)).size;

      // Product sales analysis
      const productSales = new Map();
      bills.forEach(bill => {
        bill.items.forEach(item => {
          const current = productSales.get(item.name) || { quantity: 0, revenue: 0 };
          productSales.set(item.name, {
            quantity: current.quantity + item.quantity,
            revenue: current.revenue + (item.price * item.quantity)
          });
        });
      });

      const topProducts = Array.from(productSales.entries())
        .map(([name, data]) => ({ name, ...data }))
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5);

      // Low stock analysis
      const lowStockList = inventory
        .filter(item => {
          const stock = item.stock || 0;
          const minQuantity = item.minQuantity || 1;
          return stock <= minQuantity;
        })
        .map(item => ({
          name: item.name,
          stock: item.stock || 0,
          minQuantity: item.minQuantity || 1,
          unit: item.unit.value
        }))
        .sort((a, b) => {
          // Sort by stock level relative to minQuantity (most critical first)
          const aRatio = a.stock / a.minQuantity;
          const bRatio = b.stock / b.minQuantity;
          return aRatio - bRatio;
        });

      // Customer activity
      const customerActivity = new Map();
      bills.forEach(bill => {
        const current = customerActivity.get(bill.customerName) || { purchases: 0, total: 0 };
        customerActivity.set(bill.customerName, {
          purchases: current.purchases + 1,
          total: current.total + bill.total
        });
      });

      const topCustomers = Array.from(customerActivity.entries())
        .map(([name, data]) => ({ name, ...data }))
        .sort((a, b) => b.total - a.total)
        .slice(0, 5);

      setMetrics({
        totalSales,
        productsSold,
        activeCustomers,
        lowStockItems: lowStockList.length,
        topProducts,
        lowStockList,
        customerActivity: topCustomers
      });
    };

    calculateMetrics();
  }, [bills, inventory]);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <div className="p-6">
      <motion.h1 
        className="text-3xl font-bold text-gray-900 mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Welcome to Sri Srinivasa Fertilizers
      </motion.h1>

      {/* Key Metrics */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={item} className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-600 mb-2">Total Sales</h3>
          <p className="text-3xl font-bold text-gray-900 mb-2">₹{metrics.totalSales.toLocaleString()}</p>
          <p className="text-sm text-blue-600">Total Revenue</p>
        </motion.div>
        <motion.div variants={item} className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-600 mb-2">Products Sold</h3>
          <p className="text-3xl font-bold text-gray-900 mb-2">{metrics.productsSold}</p>
          <p className="text-sm text-blue-600">Total Units</p>
        </motion.div>
        <motion.div variants={item} className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-600 mb-2">Active Customers</h3>
          <p className="text-3xl font-bold text-gray-900 mb-2">{metrics.activeCustomers}</p>
          <p className="text-sm text-blue-600">Unique Customers</p>
        </motion.div>
        <motion.div variants={item} className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-600 mb-2">Low Stock Items</h3>
          <p className="text-3xl font-bold text-gray-900 mb-2">{metrics.lowStockItems}</p>
          <p className="text-sm text-orange-500">Needs Attention</p>
        </motion.div>
      </motion.div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Top Products Chart */}
        <motion.div 
          className="bg-white rounded-lg shadow-md p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-lg font-semibold text-gray-600 mb-4">Top Selling Products</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={metrics.topProducts}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="quantity" fill="#0088FE" name="Units Sold" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Customer Activity Chart */}
        <motion.div 
          className="bg-white rounded-lg shadow-md p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-lg font-semibold text-gray-600 mb-4">Top Customers</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={metrics.customerActivity}
                  dataKey="total"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {metrics.customerActivity.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Low Stock Alert Section */}
      <motion.div 
        className="bg-white rounded-lg shadow-md p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h3 className="text-lg font-semibold text-gray-600 mb-4">Low Stock Alert</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Stock</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Min Required</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {metrics.lowStockList.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                    All products are well stocked
                  </td>
                </tr>
              ) : (
                metrics.lowStockList.map((item, index) => (
                  <tr key={item.name} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.stock} {item.unit}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.minQuantity} {item.unit}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        item.stock === 0 
                          ? 'bg-red-100 text-red-800' 
                          : item.stock <= item.minQuantity * 0.5
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {item.stock === 0 
                          ? 'Out of Stock' 
                          : item.stock <= item.minQuantity * 0.5
                          ? 'Critical Low'
                          : 'Low Stock'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
} 