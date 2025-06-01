'use client';

import { Inter } from "next/font/google";
import "./globals.css";
import { useEffect, useState } from 'react';
import Welcome from '@/components/Welcome';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { SessionProvider, useSession, signOut } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';

const inter = Inter({ subsets: ["latin"] });

function AuthCheck({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const isAuthPage = pathname === '/login' || pathname === '/register';

  useEffect(() => {
    if (status === 'loading') return;

    if (!session && !isAuthPage) {
      router.push('/login');
    } else if (session && isAuthPage) {
      router.push('/dashboard');
    }
  }, [session, status, isAuthPage, router]);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (!session && !isAuthPage) {
    return null;
  }

  return <>{children}</>;
}

function NavBar() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white shadow-md fixed top-0 left-0 right-0 z-40"
    >
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/dashboard" className="text-2xl font-bold text-blue-600">
            Sri Srinivasa
          </Link>
          <div className="flex space-x-6">
            <Link href="/inventory" className="text-gray-600 hover:text-blue-600 transition-colors">
              Inventory
            </Link>
            <Link href="/billing" className="text-gray-600 hover:text-blue-600 transition-colors">
              Billing
            </Link>
            <Link href="/bills" className="text-gray-600 hover:text-blue-600 transition-colors">
              Bills
            </Link>
            <Link href="/products" className="text-gray-600 hover:text-blue-600 transition-colors">
              Products
            </Link>
            <Link href="/customers" className="text-gray-600 hover:text-blue-600 transition-colors">
              Customers
            </Link>
            <Link href="/credits" className="text-gray-600 hover:text-blue-600 transition-colors">
              Credits
            </Link>
            <Link href="/dashboard" className="text-gray-600 hover:text-blue-600 transition-colors">
              Dashboard
            </Link>
            <button
              onClick={() => signOut()}
              className="text-red-600 hover:text-red-700 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </nav>
    </motion.header>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showNavbar, setShowNavbar] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const pathname = usePathname();
  const isAuthPage = pathname === '/login' || pathname === '/register';

  useEffect(() => {
    if (!isAuthPage) {
      // Show navbar after 5 seconds
      const timer = setTimeout(() => {
        setShowNavbar(true);
        setShowWelcome(false); // Hide welcome screen after navbar appears
      }, 5000);

      return () => clearTimeout(timer);
    } else {
      setShowNavbar(false);
      setShowWelcome(false);
    }
  }, [isAuthPage]);

  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider>
          <AuthCheck>
            <AnimatePresence>
              {showWelcome && !isAuthPage && <Welcome />}
            </AnimatePresence>
            
            <AnimatePresence>
              {showNavbar && !isAuthPage && <NavBar />}
            </AnimatePresence>
            
            <main className={`container mx-auto px-4 py-8 ${!isAuthPage ? 'mt-20' : ''}`}>
              {children}
            </main>
          </AuthCheck>
        </SessionProvider>
      </body>
    </html>
  );
}
