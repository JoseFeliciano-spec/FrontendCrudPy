"use server";
import { cookies } from "next/headers";

export async function registerUser(body: any): Promise<any> {
  const data = await fetch(`${process.env.API_URL}/v1/auth/register`, {
    method: "POST",
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...body,
    }),
  });
  const dataJson: any = (await data.json()) as any;
  // Si el login es exitoso, guardamos el token
  console.log(dataJson);
  if (dataJson?.access_token) {
    cookies().set({
      name: "auth-token",
      value: dataJson?.access_token,
      httpOnly: true,
      sameSite: "strict",
      maxAge: 60 * 60 * 24, // 1 dia
    });
  }

  return dataJson;
}
