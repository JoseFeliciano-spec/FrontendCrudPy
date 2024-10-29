"use server";
import { cookies } from "next/headers";

interface RegisterCredentials {
  email: string;
  password: string;
  name?: string;
}

// Definimos una interfaz específica para los errores
interface ValidationErrors {
  [key: string]: string[];
}

interface RegisterResponse {
  success: boolean;
  message: string;
  statusCode?: number;
  data?: {
    access_token: string;
    user?: {
      id: string;
      email: string;
      name?: string;
    };
    errors?: { [key: string]: string };
  };
  errors?: ValidationErrors; // Reemplazamos any por ValidationErrors
  error?: boolean;
}

export async function registerUser(
  body: RegisterCredentials
): Promise<RegisterResponse> {
  try {
    const response = await fetch(`${process.env.API_URL}/v1/user/register`, {
      method: "POST",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      return {
        success: false,
        message: "Error en el registro",
        statusCode: response.status,
      };
    }

    const data = (await response.json()) as RegisterResponse;

    // Si el registro es exitoso, guardamos el token
    if (data?.data?.access_token) {
      cookies().set({
        name: "auth-token",
        value: data.data.access_token,
        httpOnly: true,
        sameSite: "strict",
        maxAge: 60 * 60 * 24, // 1 día
      });

      return {
        success: true,
        message: "Registro exitoso",
        data: data.data,
      };
    }

    return data;
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Error en el servidor";

    return {
      success: false,
      message: errorMessage,
      error: true,
    };
  }
}
