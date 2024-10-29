"use client";

import { Button } from "../ui/button";
import revalidatePathLocal from "@/actions/revalidath";
import { removeToken } from "@/actions/auth/getUser";
import { LogOut } from "lucide-react";

export default function ButtonLogout() {
  return (
    <Button
      variant="ghost"
      className="flex w-full items-center justify-start gap-2 px-2 py-1.5 text-destructive hover:text-destructive"
      onClick={async () => {
        await removeToken();
        await revalidatePathLocal();
      }}
    >
      <LogOut className="h-4 w-4" />
      Cerrar Sesión
    </Button>
  );
}
