// pages/products.tsx
"use client";
import ProductsManager from "@/components/product/ProductManager";

export default function ProductsPage({ user }: any) {
  console.log(user);
  return <ProductsManager user={user} />;
}
