// src/lib/types/checkout.ts

export interface CheckoutItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  size: string;
  color: string;
}

export interface CheckoutCustomer {
  name: string;
  email: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface CheckoutRequestData {
  items: CheckoutItem[];
  customer: CheckoutCustomer;
  total: number;
}

export interface CheckoutResponseData {
  orderId: string;
  url?: string;
}
