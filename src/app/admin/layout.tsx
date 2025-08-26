// src/app/admin/layout.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { Container } from "@/components/ui/container";
import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";
import { cn } from "@/lib/utils";

const adminNavItems = [
  { label: "Products", href: "/admin/products" },
  { label: "Orders", href: "/admin/orders" },
  { label: "Categories", href: "/admin/categories" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const pathname = usePathname();

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (!session || session.user.role !== "ADMIN") {
    redirect("/");
  }

  return (
    <>
      <Navbar />
      <div className="bg-gray-50 min-h-screen">
        <Container className="py-6">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar */}
            <aside className="w-full md:w-64 shrink-0">
              <div className="bg-white rounded-lg shadow-sm p-4">
                <h2 className="font-semibold mb-4 text-lg">Admin Dashboard</h2>
                <nav className="space-y-1">
                  {adminNavItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "block px-4 py-2 rounded-md text-sm",
                        pathname === item.href
                          ? "bg-gray-100 text-black font-medium"
                          : "text-gray-700 hover:bg-gray-50"
                      )}
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>
              </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 bg-white rounded-lg shadow-sm p-6">
              {children}
            </main>
          </div>
        </Container>
      </div>
      <Footer />
    </>
  );
}
