"use server";
import { cookies } from "next/headers";

export interface CrudProductDto {
  name: string;
  sku: string;
  price: number;
  stock: number;
  id?: string;
}

const API_URL = process.env.API_URL;

// Fetch all products
export async function fetchProducts() {
  const token = cookies().get("auth-token")?.value;

  const response = await fetch(`${API_URL}/v1/products`, {
    method: "GET",
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();
  return data;
}

// Create a new product
export async function createProduct(product: CrudProductDto) {
  const token = cookies().get("auth-token")?.value;

  const response = await fetch(`${API_URL}/v1/products`, {
    method: "POST",
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(product),
  });

  const data = await response.json();
  return data;
}

// Update an existing product
export async function updateProduct(
  productId: string,
  updatedProduct: Partial<CrudProductDto>
) {
  const token = cookies().get("auth-token")?.value;

  const response = await fetch(`${API_URL}/v1/products/${productId}`, {
    method: "PUT",
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...updatedProduct,
      id: productId,
    }),
  });

  const data = await response.json();
  return data;
}

// Delete a product
export async function deleteProduct(productId: string) {
  const token = cookies().get("auth-token")?.value;
  const response = await fetch(`${API_URL}/v1/products/${productId}`, {
    method: "DELETE",
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();
  return data;
}
