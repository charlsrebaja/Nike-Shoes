// src/app/admin/page.tsx
"use client";

import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import {
  Package,
  ShoppingCart,
  Tag,
  BarChart3,
  Users,
  Settings,
} from "lucide-react";

const adminSections = [
  {
    title: "Products",
    description:
      "Manage your product catalog, add new items, and update existing products.",
    href: "/admin/products",
    icon: Package,
    color: "bg-blue-500",
  },
  {
    title: "Orders",
    description:
      "View and manage customer orders, track shipments, and handle returns.",
    href: "/admin/orders",
    icon: ShoppingCart,
    color: "bg-green-500",
  },
  {
    title: "Categories",
    description:
      "Organize your products with categories and manage category hierarchy.",
    href: "/admin/categories",
    icon: Tag,
    color: "bg-purple-500",
  },
  {
    title: "Analytics",
    description:
      "View sales reports, customer insights, and performance metrics.",
    href: "/admin/analytics",
    icon: BarChart3,
    color: "bg-orange-500",
  },
  {
    title: "Users",
    description: "Manage user accounts, roles, and permissions.",
    href: "/admin/users",
    icon: Users,
    color: "bg-indigo-500",
  },
  {
    title: "Settings",
    description:
      "Configure store settings, payment methods, and system preferences.",
    href: "/admin/settings",
    icon: Settings,
    color: "bg-gray-500",
  },
];

export default function AdminDashboard() {
  const router = useRouter();
  return (
    <Container className="py-8">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Welcome to your Nike store administration panel. Manage your
            products, orders, and store settings.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Products
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
              <p className="text-xs text-muted-foreground">
                +2 from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Orders
              </CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">+3 from last week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$2,450</div>
              <p className="text-xs text-muted-foreground">
                +12% from last month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Admin Sections */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Management Sections
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {adminSections.map((section) => {
              const Icon = section.icon;
              return (
                <Card
                    key={section.href}
                    className="hover:shadow-lg transition-shadow"
                  >
                    <CardHeader>
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${section.color}`}>
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                        <CardTitle className="text-lg">{section.title}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="mb-4">
                        {section.description}
                      </CardDescription>
                      <Button className="w-full" onClick={() => router.push(section.href)}>
                        Manage {section.title}
                      </Button>
                    </CardContent>
                  </Card>
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest updates and changes in your store
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">New product added</p>
                  <p className="text-xs text-gray-500">
                    Nike Air Max 270 - 2 hours ago
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Order completed</p>
                  <p className="text-xs text-gray-500">
                    Order #1234 - 4 hours ago
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Category updated</p>
                  <p className="text-xs text-gray-500">
                    Running category - 1 day ago
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
}
