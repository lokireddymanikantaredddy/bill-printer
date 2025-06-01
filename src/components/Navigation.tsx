'use client';

import Link from "next/link";
import { useState } from "react";

export default function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-semibold truncate">
              Sri Srinivasa
            </Link>
          </div>
          
          {/* Mobile menu button */}
          <div className="flex items-center lg:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>

          {/* Desktop menu */}
          <div className="hidden lg:flex lg:items-center lg:space-x-4">
            <Link
              href="/inventory"
              className="px-3 py-2 rounded-md text-sm font-medium text-gray-900 hover:bg-gray-100"
            >
              Inventory
            </Link>
            <Link
              href="/billing"
              className="px-3 py-2 rounded-md text-sm font-medium text-gray-900 hover:bg-gray-100"
            >
              Billing
            </Link>
            <Link
              href="/bills"
              className="px-3 py-2 rounded-md text-sm font-medium text-gray-900 hover:bg-gray-100"
            >
              Bills
            </Link>
            <Link
              href="/products"
              className="px-3 py-2 rounded-md text-sm font-medium text-gray-900 hover:bg-gray-100"
            >
              Products
            </Link>
            <Link
              href="/customers"
              className="px-3 py-2 rounded-md text-sm font-medium text-gray-900 hover:bg-gray-100"
            >
              Customers
            </Link>
            <Link
              href="/credits"
              className="px-3 py-2 rounded-md text-sm font-medium text-gray-900 hover:bg-gray-100"
            >
              Credits
            </Link>
            <Link
              href="/dashboard"
              className="px-3 py-2 rounded-md text-sm font-medium text-gray-900 hover:bg-gray-100"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`lg:hidden ${isMobileMenuOpen ? '' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-b border-gray-200">
          <Link
            href="/inventory"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-100"
          >
            Inventory
          </Link>
          <Link
            href="/billing"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-100"
          >
            Billing
          </Link>
          <Link
            href="/bills"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-100"
          >
            Bills
          </Link>
          <Link
            href="/products"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-100"
          >
            Products
          </Link>
          <Link
            href="/customers"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-100"
          >
            Customers
          </Link>
          <Link
            href="/credits"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-100"
          >
            Credits
          </Link>
          <Link
            href="/dashboard"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-100"
          >
            Dashboard
          </Link>
        </div>
      </div>
    </header>
  );
} 