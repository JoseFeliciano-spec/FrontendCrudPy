"use server";

import { cookies } from "next/headers";

interface LoginCredentials {
  email: string;
  password: string;
  // Agrega aquí otros campos que pueda tener tu body de login
}

interface LoginResponse {
  success: boolean;
  message: string;
  statusCode?: number;
  data?: {
    access_token: string;
    // Agrega aquí otros campos que pueda tener tu respuesta
    user?: {
      id: string;
      email: string;
      name?: string;
    };
  };
  error?: boolean;
}

export async function login(body: LoginCredentials): Promise<LoginResponse> {
  try {
    const response = await fetch(`${process.env.API_URL}/v1/user/login`, {
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
        message: "Error en la autenticación",
        statusCode: response.status,
      };
    }

    const data = (await response.json()) as LoginResponse;

    // Si el login es exitoso, guardamos el token
    if (data?.data?.access_token) {
      cookies().set({
        name: "auth-token",
        value: data.data.access_token,
        httpOnly: true,
        sameSite: "strict",
        maxAge: 60 * 60 * 24, // 1 dia
      });

      return {
        success: true,
        message: "Login exitoso",
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
