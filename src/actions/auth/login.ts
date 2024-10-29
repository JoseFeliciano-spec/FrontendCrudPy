"use server";
import { cookies } from "next/headers";

export async function login(body: any): Promise<any> {
  const data: any = await fetch(`${process.env.API_URL}/v1/user/login`, {
    method: "POST",
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...body,
    }),
  });

  const dataJson = (await data.json()) as any;

  // Si el login es exitoso, guardamos el token
  if (dataJson?.data?.access_token) {
    cookies().set({
      name: "auth-token",
      value: dataJson?.data?.access_token,
      httpOnly: true,
      sameSite: "strict",
      maxAge: 60 * 60 * 24, // 1 dia
    });
  }

  return dataJson;
}
