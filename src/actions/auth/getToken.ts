import { cookies } from "next/headers";

export function getAuthToken() {
  return cookies().get("auth-token")?.value;
}
