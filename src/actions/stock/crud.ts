// actions/stockMovements.ts
"use server";
import { cookies } from "next/headers";

export interface StockMovementDto {
  productId: string;
  type: "entrada" | "salida";
  quantity: number;
  id?: string;
}

const API_URL = process.env.API_URL;

// Crear movimiento de stock
export async function createStockMovement(
  movement: Omit<StockMovementDto, "id">
) {
  const token = cookies().get("auth-token")?.value;

  const response = await fetch(`${API_URL}/v1/stock-movements`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(movement),
  });

  return response.json();
}

// Obtener todos los movimientos
export async function fetchStockMovements() {
  const token = cookies().get("auth-token")?.value;

  const response = await fetch(`${API_URL}/v1/stock-movements`, {
    method: "GET",
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.json();
}

// Actualizar movimiento
export async function updateStockMovement(
  movementId: string,
  updatedMovement: Partial<StockMovementDto>
) {
  const token = cookies().get("auth-token")?.value;

  const response = await fetch(`${API_URL}/v1/stock-movements/${movementId}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedMovement),
  });

  return response.json();
}

// Eliminar movimiento
export async function deleteStockMovement(movementId: string) {
  const token = cookies().get("auth-token")?.value;

  const response = await fetch(`${API_URL}/v1/stock-movements/${movementId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.json();
}
