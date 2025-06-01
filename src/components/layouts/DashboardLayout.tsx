'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HomeIcon,
  ShoppingCartIcon,
  UsersIcon,
  DocumentTextIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";

const navigation = [
  { name: "Dashboard", href: "/", icon: HomeIcon },
  { name: "Products", href: "/products", icon: ShoppingCartIcon },
  { name: "Customers", href: "/customers", icon: UsersIcon },
  { name: "Bills", href: "/bills", icon: DocumentTextIcon },
  { name: "Reports", href: "/reports", icon: ChartBarIcon },
];

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col">
        <div className="flex min-h-0 flex-1 flex-col border-r border-gray-200 bg-white shadow-sm">
          <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
            <div className="flex flex-shrink-0 items-center px-4 mb-5">
              <h1 className="text-xl font-bold text-blue-600">Fertilizer Shop</h1>
            </div>
            <nav className="mt-3 flex-1 space-y-1 bg-white px-3">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`${
                      isActive
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                    } group flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors duration-200`}
                  >
                    <item.icon
                      className={`${
                        isActive ? "text-blue-600" : "text-gray-400 group-hover:text-blue-600"
                      } h-5 w-5 flex-shrink-0 transition-colors duration-200`}
                      aria-hidden="true"
                    />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto bg-gray-50 p-4">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
} 