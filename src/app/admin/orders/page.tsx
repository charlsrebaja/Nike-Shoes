// src/app/admin/orders/page.tsx
"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Eye, Truck, CheckCircle, XCircle } from "lucide-react";

const mockOrders = [
  {
    id: "ORD-001",
    customer: "John Doe",
    email: "john@example.com",
    total: 129.99,
    status: "PENDING",
    date: "2025-01-15",
    items: 2,
  },
  {
    id: "ORD-002",
    customer: "Jane Smith",
    email: "jane@example.com",
    total: 299.98,
    status: "PROCESSING",
    date: "2025-01-14",
    items: 3,
  },
  {
    id: "ORD-003",
    customer: "Mike Johnson",
    email: "mike@example.com",
    total: 89.99,
    status: "SHIPPED",
    date: "2025-01-13",
    items: 1,
  },
  {
    id: "ORD-004",
    customer: "Sarah Wilson",
    email: "sarah@example.com",
    total: 199.99,
    status: "DELIVERED",
    date: "2025-01-12",
    items: 2,
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "PENDING":
      return "bg-yellow-100 text-yellow-800";
    case "PROCESSING":
      return "bg-blue-100 text-blue-800";
    case "SHIPPED":
      return "bg-orange-100 text-orange-800";
    case "DELIVERED":
      return "bg-green-100 text-green-800";
    case "CANCELLED":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "PENDING":
      return <ShoppingCart className="h-4 w-4" />;
    case "PROCESSING":
      return <Truck className="h-4 w-4" />;
    case "SHIPPED":
      return <Truck className="h-4 w-4" />;
    case "DELIVERED":
      return <CheckCircle className="h-4 w-4" />;
    case "CANCELLED":
      return <XCircle className="h-4 w-4" />;
    default:
      return <ShoppingCart className="h-4 w-4" />;
  }
};

export default function AdminOrdersPage() {
  return (
    <Container className="py-8">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Orders Management
            </h1>
            <p className="text-gray-600 mt-2">
              View and manage all customer orders
            </p>
          </div>
          <Button>Export Orders</Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Orders
              </CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">156</div>
              <p className="text-xs text-muted-foreground">
                +12% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <div className="h-4 w-4 rounded-full bg-yellow-500"></div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">23</div>
              <p className="text-xs text-muted-foreground">
                Requires attention
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Processing</CardTitle>
              <div className="h-4 w-4 rounded-full bg-blue-500"></div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">In progress</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue</CardTitle>
              <div className="h-4 w-4 rounded-full bg-green-500"></div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$12,450</div>
              <p className="text-xs text-muted-foreground">
                +8% from last month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Orders Table */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>
              A list of all orders with their current status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(order.status)}
                      <span className="font-medium">{order.id}</span>
                    </div>
                    <div>
                      <p className="font-medium">{order.customer}</p>
                      <p className="text-sm text-gray-500">{order.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="font-medium">${order.total}</p>
                      <p className="text-sm text-gray-500">
                        {order.items} items
                      </p>
                    </div>

                    <Badge className={getStatusColor(order.status)}>
                      {order.status}
                    </Badge>

                    <div className="text-sm text-gray-500">
                      {new Date(order.date).toLocaleDateString()}
                    </div>

                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Note */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <p className="text-sm text-blue-700">
                <strong>Note:</strong> This is a demo orders page. In a real
                application, you would connect this to your database to display
                actual order data.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
}
