"use server";
import { cookies } from "next/headers";

interface UserResponse {
  message: string;
  statusCode: number;
  data?: {
    id: string;
    name: string;
    email: string;
    createdAt: string;
  };
  errors?: string;
}

export async function removeToken(): Promise<void> {
  cookies().delete("auth-token");
}

export async function getUser(): Promise<UserResponse> {
  try {
    const token = cookies().get("auth-token");

    if (!token) {
      return {
        message: "No se encontró token de autenticación",
        statusCode: 401,
        errors: "Token no encontrado",
      };
    }

    const response = await fetch(`${process.env.API_URL}/v1/user/me`, {
      method: "GET",
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${token.value}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        message: data.message || "Error al obtener información del usuario",
        statusCode: response.status,
        errors: data.errors,
      };
    }

    return {
      message: data.message,
      statusCode: data.statusCode,
      data: {
        id: data.data.id,
        name: data.data.name,
        email: data.data.email,
        createdAt: data.data.createdAt,
      },
    };
  } catch (error) {
    return {
      message: "Error al obtener información del usuario",
      statusCode: 500,
      errors: error?.toString(),
    };
  }
}
