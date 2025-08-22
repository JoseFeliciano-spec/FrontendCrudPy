"use server";
import { revalidatePath } from "next/cache";

export default async function revalidatePathLocal(term: string = "/") {
  console.log("Revalidating path:", term);
  revalidatePath(term, "layout");
}
