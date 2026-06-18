export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: string;
  subCategory?: string;
  description: string;
  sizes: string[];
  colors: string[];
  tags: string[];
  inStock: boolean;
  isNew?: boolean;
  isFeatured?: boolean;
  isBestseller?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize: string;
  selectedColor: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  size: string;
  color: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  createdAt: string;
  customer: {
    name: string;
    phone: string;
    email: string;
  };
  shipping: {
    address: string;
    area: string;
    district: string;
    division: string;
  };
  items: OrderItem[];
  subtotal: number;
  shippingCost: number;
  total: number;
  notes?: string;
  paymentMethod: "cod";
  status: "pending";
}

export interface NavItem {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
}

export interface Category {
  name: string;
  slug: string;
  image: string;
  description?: string;
}
